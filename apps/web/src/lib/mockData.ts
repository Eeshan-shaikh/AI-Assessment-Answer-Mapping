import { AssessmentResult } from '@vedaai/types';

export const mockData: AssessmentResult = {
  questions: [
    {
      id: 'q1',
      number: '1',
      text: 'Which blood vessel carries blood away from the heart?',
      page: 1,
      order: 1,
    },
    {
      id: 'q2',
      number: '2',
      text: 'Which of the following organelles is primarily involved in photosynthesis?',
      page: 1,
      order: 2,
    },
    {
      id: 'q3',
      number: '3',
      text: 'Explain the role of chloroplasts in photosynthesis, naming the main pigments involved and briefly outlining the two major stages of the process.',
      page: 1,
      order: 3,
    },
    {
      id: 'q4',
      number: '4',
      text: 'Describe the flow of blood through the human heart starting from the right atrium and ending at the aorta.',
      page: 1,
      order: 4,
    },
    {
      id: 'q5',
      number: '5',
      text: 'Draw a labelled diagram of an alveolus showing capillaries.',
      page: 1,
      order: 5,
    },
  ],
  answers: [
    {
      id: 'a1',
      text: 'Artery',
      regions: [
        {
          page: 1,
          bbox: { x: 100, y: 150, width: 400, height: 40 },
        },
      ],
      pages: [1],
      detectedQuestionLabel: '1',
    },
    {
      id: 'a2',
      text: 'Chloroplast',
      regions: [
        {
          page: 1,
          bbox: { x: 100, y: 220, width: 400, height: 40 },
        },
      ],
      pages: [1],
      detectedQuestionLabel: '2',
    },
    {
      id: 'a3',
      text: 'Chloroplasts contain chlorophyll. Light reaction and dark reaction.',
      regions: [
        {
          page: 1,
          bbox: { x: 100, y: 300, width: 600, height: 120 },
        },
        {
          page: 2,
          bbox: { x: 100, y: 80, width: 600, height: 80 },
        },
      ],
      pages: [1, 2],
      detectedQuestionLabel: '3',
    },
    {
      id: 'a5',
      text: 'Diagram of alveolus',
      regions: [
        {
          page: 2,
          bbox: { x: 100, y: 200, width: 500, height: 300 },
        },
      ],
      pages: [2],
      detectedQuestionLabel: '5',
    },
  ],
  mappings: [
    {
      questionId: 'q1',
      answerId: 'a1',
      confidence: 0.99,
      method: 'explicit',
      status: 'matched',
    },
    {
      questionId: 'q2',
      answerId: 'a2',
      confidence: 0.98,
      method: 'explicit',
      status: 'matched',
    },
    {
      questionId: 'q3',
      answerId: 'a3',
      confidence: 0.85,
      method: 'semantic',
      status: 'uncertain',
    },
    {
      questionId: 'q4',
      answerId: null,
      confidence: 0,
      method: 'explicit',
      status: 'unanswered',
    },
    {
      questionId: 'q5',
      answerId: 'a5',
      confidence: 0.95,
      method: 'explicit',
      status: 'matched',
    },
  ],
};
