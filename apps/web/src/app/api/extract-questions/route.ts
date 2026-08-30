import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Question } from '@vedaai/types';

// Initialize the Gemini client
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

    // Prompt instructions
    const prompt = `
      You are an expert OCR and document analysis AI.
      Analyze this question paper document. It may be an image or a PDF.
      Extract every single question present in the document.
      
      CRITICAL RULES:
      1. Extract every question in the exact printed order.
      2. Preserve the original numbering exactly as it appears (e.g., "11(a)", "Q. 12", "1."). Do NOT renumber them.
      3. Treat subquestions as entirely independent questions. If there is a question 3 with parts (a) and (b), extract them as "3(a)" and "3(b)".
      4. For each question, provide a bounding box of its physical location.
         The bounding box MUST use normalized coordinates [ymin, xmin, ymax, xmax] where 0 is top/left and 1000 is bottom/right.
      5. Provide the page number (1-indexed) where the question is found.
      
      Respond STRICTLY with a JSON array of question objects. Do not wrap it in markdown.
      Schema for each object:
      {
        "id": "unique_string_id_like_q_11_a",
        "number": "The exact question label",
        "text": "The full text of the question",
        "page": 1,
        "bbox": { "ymin": 0, "xmin": 0, "ymax": 1000, "xmax": 1000 },
        "order": 1
      }
    `;

    // Determine mime type
    const mimeType = file.type;

    // Call Gemini API (Using gemini-1.5-flash for speed and multimodal capabilities)
    // Note: We use inline data here. For very large PDFs, the File API (upload) might be needed,
    // but for 1-2 page question papers, inline base64 is fine and faster.
    let response;
    let retries = 2;
    
    while (retries >= 0) {
      try {
        response = await ai.models.generateContent({
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
                questions: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      id: { type: 'STRING' },
                      number: { type: 'STRING' },
                      text: { type: 'STRING' },
                      marks: { type: 'NUMBER' },
                      page: { type: 'INTEGER' },
                      order: { type: 'INTEGER' },
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
                    required: ['id', 'number', 'text', 'page', 'order', 'bbox']
                  }
                }
              },
              required: ['questions']
            }
          }
        });
        break; // Success, exit loop
      } catch (err: any) {
        // If it's a 503 Unavailable or Deadline Exceeded, retry
        const isTimeout = err.message?.includes('503') || err.message?.includes('UNAVAILABLE') || err.message?.includes('Deadline');
        if (retries === 0 || !isTimeout) {
          throw err;
        }
        console.warn(`Gemini API timeout, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
        retries--;
      }
    }

    if (!response || !response.text) {
      throw new Error("Failed to generate content");
    }

    // Parse the JSON response
    const parsedData = JSON.parse(response.text);
    const extractedQuestions = parsedData.questions as any[];

    // Transform normalized [ymin, xmin, ymax, xmax] (0-1000) to standard [x, y, width, height]
    // Assume a standard A4 reference size for now: 800x1131
    const referenceWidth = 800;
    const referenceHeight = 1131;

    const formattedQuestions: Question[] = extractedQuestions.map(q => {
      const ymin = q.bbox.ymin / 1000;
      const xmin = q.bbox.xmin / 1000;
      const ymax = q.bbox.ymax / 1000;
      const xmax = q.bbox.xmax / 1000;

      return {
        id: q.id,
        number: q.number,
        text: q.text,
        page: q.page,
        order: q.order,
        bbox: {
          x: xmin * referenceWidth,
          y: ymin * referenceHeight,
          width: (xmax - xmin) * referenceWidth,
          height: (ymax - ymin) * referenceHeight,
        }
      };
    });

    return NextResponse.json({ questions: formattedQuestions });

  } catch (error: any) {
    console.error('Error extracting questions:', error);
    return NextResponse.json(
      { error: 'Failed to extract questions', details: error.message },
      { status: 500 }
    );
  }
}
