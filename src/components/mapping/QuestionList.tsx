import { AssessmentResult } from '@/types/assessment';
import { QuestionItem } from './QuestionItem';

interface QuestionListProps {
  data: AssessmentResult;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function QuestionList({ data, selectedId, onSelect }: QuestionListProps) {
  return (
    <div className="space-y-3">
      {data.questions.map((question) => {
        const mapping = data.mappings.find((m) => m.questionId === question.id);
        const status = mapping?.status || 'unmatched';
        
        return (
          <QuestionItem
            key={question.id}
            question={question}
            status={status}
            isSelected={selectedId === question.id}
            onClick={() => onSelect(question.id)}
          />
        );
      })}
    </div>
  );
}
