export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Question {
  id: string;
  number: string;
  text: string;
  page: number;
  bbox?: BoundingBox;
  order: number;
  parentQuestion?: string;
  subPart?: string;
}

export interface AnswerRegion {
  page: number;
  bbox: BoundingBox;
}

export interface Answer {
  id: string;
  text: string;
  regions: AnswerRegion[];
  pages: number[];
  detectedQuestionLabel?: string;
}

export interface AnswerMapping {
  questionId: string;
  answerId: string | null;
  confidence: number;
  method: 'explicit' | 'ocr' | 'semantic';
  status: 'matched' | 'unanswered' | 'unmatched' | 'uncertain';
}

export interface AssessmentResult {
  questions: Question[];
  answers: Answer[];
  mappings: AnswerMapping[];
}
