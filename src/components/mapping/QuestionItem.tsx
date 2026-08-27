import { Question } from '@/types/assessment';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionItemProps {
  question: Question;
  status: string;
  isSelected: boolean;
  onClick: () => void;
}

export function QuestionItem({ question, status, isSelected, onClick }: QuestionItemProps) {
  // Determine colors based on status and selection
  // Figma styling: selected is orange circle, unselected is gray circle
  const circleClass = isSelected 
    ? 'bg-orange-500 text-white' 
    : 'bg-gray-200 text-gray-700';

  const cardBorderClass = isSelected 
    ? 'border-orange-400 shadow-sm' 
    : 'border-transparent hover:border-gray-200';

  return (
    <div 
      className={`bg-white rounded-xl p-4 transition-all cursor-pointer border-2 ${cardBorderClass}`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Number Circle */}
        <div className="shrink-0 mt-0.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${circleClass}`}>
            {question.number}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <p className={`text-sm leading-snug ${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
              {question.text}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              {/* Optional Grading - keeping it static for mockup */}
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">2/2</span>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded State (AI Feedback mockup) */}
          {isSelected && status !== 'unanswered' && (
            <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-700 mb-1">AI Feedback</p>
              <p className="text-xs text-gray-600">
                Excellent work! You correctly identified the core concepts and provided a clear explanation.
              </p>
            </div>
          )}
          
          {isSelected && status === 'unanswered' && (
            <div className="mt-4 bg-red-50 rounded-lg p-3 border border-red-100">
              <p className="text-xs font-bold text-red-700 mb-1">Unanswered</p>
              <p className="text-xs text-red-600">
                No answer was detected for this question.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
