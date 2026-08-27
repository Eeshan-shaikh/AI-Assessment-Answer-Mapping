import { AnswerRegion } from '@/types/assessment';

interface AnswerHighlightProps {
  region: AnswerRegion;
  label?: string;
}

export function AnswerHighlight({ region, label }: AnswerHighlightProps) {
  return (
    <div
      className="absolute border-2 border-green-500 bg-green-500/10 rounded-lg pointer-events-none transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
      style={{
        left: `${region.bbox.x}px`,
        top: `${region.bbox.y}px`,
        width: `${region.bbox.width}px`,
        height: `${region.bbox.height}px`,
      }}
    >
      {label && (
        <div className="absolute -top-3 -left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
          Q{label}
        </div>
      )}
    </div>
  );
}
