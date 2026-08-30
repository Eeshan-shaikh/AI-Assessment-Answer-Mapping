import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { AnswerMapping, Question, Answer } from '@vedaai/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to normalize question labels
// E.g., "Q. 11(a)", "Q11(a)", "11 a", "11-a" -> "11(a)"
function normalizeLabel(label: string | null | undefined): string {
  if (!label) return '';
  return label
    .toLowerCase()
    .replace(/^q\.?\s*/, '') // Remove leading Q or Q.
    .replace(/[^a-z0-9]/g, ''); // Remove EVERYTHING that is not a letter or number (dots, parens, spaces, dashes)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questions, answers } = body as { questions: Question[], answers: Answer[] };

    if (!questions || !answers) {
      return NextResponse.json({ error: 'Missing questions or answers' }, { status: 400 });
    }

    let mappings: AnswerMapping[] = [];
    let unmatchedQuestions = [...questions];
    
    // Merge answers with the same normalized label
    const mergedAnswers: Answer[] = [];
    const labelMap = new Map<string, Answer>();
    
    for (const ans of answers) {
      if (ans.detectedQuestionLabel) {
        const norm = normalizeLabel(ans.detectedQuestionLabel);
        if (norm) {
          if (labelMap.has(norm)) {
            const existing = labelMap.get(norm)!;
            existing.regions = [...existing.regions, ...ans.regions];
            existing.pages = Array.from(new Set([...existing.pages, ...ans.pages]));
            existing.text = existing.text + "\\n" + ans.text;
            continue;
          } else {
            const newAns = { ...ans, regions: [...ans.regions], pages: [...ans.pages] };
            labelMap.set(norm, newAns);
            continue;
          }
        }
      }
      mergedAnswers.push(ans);
    }
    labelMap.forEach(ans => mergedAnswers.push(ans));
    
    let unmatchedAnswers = [...mergedAnswers];

    // Priority 1 & 2: Explicit and Normalized Label Matching
    for (let i = unmatchedAnswers.length - 1; i >= 0; i--) {
      const answer = unmatchedAnswers[i];
      if (answer.detectedQuestionLabel) {
        const normalizedAnswerLabel = normalizeLabel(answer.detectedQuestionLabel);
        
        // Find matching question
        const matchedQuestionIndex = unmatchedQuestions.findIndex(
          q => normalizeLabel(q.number) === normalizedAnswerLabel
        );

        if (matchedQuestionIndex !== -1) {
          const matchedQuestion = unmatchedQuestions[matchedQuestionIndex];
          mappings.push({
            questionId: matchedQuestion.id,
            answerId: answer.id,
            confidence: 0.95,
            method: 'explicit',
            status: 'matched'
          });
          
          // Remove from unmatched pools
          unmatchedAnswers.splice(i, 1);
          unmatchedQuestions.splice(matchedQuestionIndex, 1);
        }
      }
    }

    // Priority 3: Semantic Matching for remaining unmatched answers
    if (unmatchedAnswers.length > 0 && unmatchedQuestions.length > 0) {
      const prompt = `
        You are an expert AI grading assistant. Your task is to match handwritten student answers to the correct questions.
        
        Unmatched Questions:
        ${JSON.stringify(unmatchedQuestions.map(q => ({ id: q.id, text: q.text })))}
        
        Unmatched Answers:
        ${JSON.stringify(unmatchedAnswers.map(a => ({ id: a.id, text: a.text })))}
        
        Analyze the semantic meaning of each answer and determine which question it answers.
        
        Respond STRICTLY with a JSON array of mappings.
        Schema:
        [
          {
            "questionId": "id_of_matched_question",
            "answerId": "id_of_answer",
            "confidence": 0.85, // Float between 0 and 1
            "status": "matched" // Use "uncertain" if confidence < 0.7
          }
        ]
        Only include answers that you can confidently map.
      `;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        if (response.text) {
          const semanticMappings = JSON.parse(response.text) as any[];
          
          for (const sm of semanticMappings) {
            mappings.push({
              questionId: sm.questionId,
              answerId: sm.answerId,
              confidence: sm.confidence,
              method: 'semantic',
              status: sm.status
            });
            
            // Remove from pools
            unmatchedAnswers = unmatchedAnswers.filter(a => a.id !== sm.answerId);
            unmatchedQuestions = unmatchedQuestions.filter(q => q.id !== sm.questionId);
          }
        }
      } catch (semanticError) {
        console.error("Semantic matching failed, continuing without it.", semanticError);
      }
    }

    // Handle remaining unanswered questions
    for (const q of unmatchedQuestions) {
      mappings.push({
        questionId: q.id,
        answerId: null,
        confidence: 0,
        method: 'explicit', // Default
        status: 'unanswered'
      });
    }

    // Handle remaining unmatched answers (Need Review)
    // We can add them with a null questionId as requested in Edge Case 19
    for (const a of unmatchedAnswers) {
      mappings.push({
        questionId: 'unmapped_' + a.id, // Fake ID so it can render, or null
        answerId: a.id,
        confidence: 0,
        method: 'explicit',
        status: 'unmatched'
      });
    }

    return NextResponse.json({ mappings });

  } catch (error: any) {
    console.error('Error mapping answers:', error);
    return NextResponse.json(
      { error: 'Failed to map answers', details: error.message },
      { status: 500 }
    );
  }
}
