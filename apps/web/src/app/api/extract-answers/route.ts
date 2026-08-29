import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Ensure GEMINI_API_KEY is set in your .env.local file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert the File to a Buffer for the Gemini API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Prompt instructions for answer extraction
    const prompt = `
      You are an expert OCR and document analysis AI.
      Analyze this student's handwritten answer sheet. It may be an image or a PDF.
      Extract every single answer written by the student.
      
      CRITICAL RULES:
      1. Identify the question label the student has written (e.g., "Q1", "11(a)", "Ans 3").
         If the student did not write a question label, set it to null.
      2. Extract the text of the handwritten answer as accurately as possible.
      3. For each answer, provide the bounding boxes of its physical location.
         Because answers can span multiple paragraphs or regions, provide an array of regions.
         Each region MUST use normalized coordinates [ymin, xmin, ymax, xmax] where 0 is top/left and 1000 is bottom/right.
      4. Provide the page number (1-indexed) where each region is found.
      
      Respond STRICTLY with a JSON array of answer objects. Do not wrap it in markdown.
      Schema for each object:
      {
        "id": "unique_string_id_like_a_1",
        "detectedQuestionLabel": "Q1" or null,
        "text": "The full text of the handwritten answer",
        "regions": [
          {
            "page": 1,
            "bbox": { "ymin": 0, "xmin": 0, "ymax": 1000, "xmax": 1000 }
          }
        ]
      }
    `;

    const mimeType = file.type;

    // Call Gemini API 
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        prompt,
        {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType: mimeType,
          },
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            answers: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  id: { type: 'STRING' },
                  detectedQuestionLabel: { type: 'STRING' },
                  pages: {
                    type: 'ARRAY',
                    items: { type: 'INTEGER' }
                  },
                  regions: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        page: { type: 'INTEGER' },
                        bbox: {
                          type: 'OBJECT',
                          properties: {
                            ymin: { type: 'NUMBER' },
                            xmin: { type: 'NUMBER' },
                            ymax: { type: 'NUMBER' },
                            xmax: { type: 'NUMBER' }
                          },
                          required: ['ymin', 'xmin', 'ymax', 'xmax']
                        }
                      },
                      required: ['page', 'bbox']
                    }
                  }
                },
                required: ['id', 'detectedQuestionLabel', 'pages', 'regions']
              }
            }
          },
          required: ['answers']
        }
      }
    });

    if (!response.text) {
      throw new Error("Failed to generate content");
    }

    // Parse the JSON response
    const parsedData = JSON.parse(response.text);
    const extractedAnswers = parsedData.answers as any[];

    // Transform normalized [ymin, xmin, ymax, xmax] (0-1000) to standard [x, y, width, height]
    // Assume a standard A4 reference size for now: 800x1131
    const referenceWidth = 800;
    const referenceHeight = 1131;

    const formattedAnswers = extractedAnswers.map(a => {
      const formattedRegions = a.regions.map((r: any) => {
        const ymin = r.bbox.ymin / 1000;
        const xmin = r.bbox.xmin / 1000;
        const ymax = r.bbox.ymax / 1000;
        const xmax = r.bbox.xmax / 1000;
        
        return {
          page: r.page,
          bbox: {
            x: xmin * referenceWidth,
            y: ymin * referenceHeight,
            width: (xmax - xmin) * referenceWidth,
            height: (ymax - ymin) * referenceHeight,
          }
        };
      });
      
      // Calculate unique pages this answer spans across
      const pages = Array.from(new Set(formattedRegions.map((r: any) => r.page))) as number[];

      return {
        id: a.id,
        text: a.text,
        regions: formattedRegions,
        pages: pages,
        detectedQuestionLabel: a.detectedQuestionLabel
      };
    });

    return NextResponse.json({ answers: formattedAnswers });

  } catch (error: any) {
    console.error('Error extracting answers:', error);
    return NextResponse.json(
      { error: 'Failed to extract answers', details: error.message },
      { status: 500 }
    );
  }
}
