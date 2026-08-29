import { X } from 'lucide-react';

interface FilePreviewProps {
  fileName: string;
  size: string;
  pages: number;
  onRemove: () => void;
}

export function FilePreview({ fileName, size, pages, onRemove }: FilePreviewProps) {
  return (
    <div className="w-full bg-white rounded-2xl p-8 flex flex-col items-center justify-center relative shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50">
      <button 
        onClick={onRemove}
        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 text-red-500 font-bold tracking-tighter">
        PDF
      </div>
      
      <h3 className="text-gray-900 font-semibold mb-1 text-sm truncate max-w-[200px]" title={fileName}>
        {fileName}
      </h3>
      <p className="text-gray-400 text-xs font-medium">
        {size} • {pages} Pages
      </p>
    </div>
  );
}
