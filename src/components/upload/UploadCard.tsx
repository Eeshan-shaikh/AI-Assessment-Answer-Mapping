import { Upload } from 'lucide-react';

interface UploadCardProps {
  title: React.ReactNode;
  maxSizeText?: string;
  onUpload?: () => void;
}

export function UploadCard({ title, maxSizeText = 'Max 10MB', onUpload }: UploadCardProps) {
  return (
    <button
      onClick={onUpload}
      className="w-full bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center transition-all hover:border-orange-300 hover:bg-orange-50/30 group"
    >
      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-white shadow-sm transition-colors">
        <Upload className="w-5 h-5 text-gray-700" />
      </div>
      <h3 className="text-gray-900 font-semibold mb-1 text-lg">{title}</h3>
      <p className="text-gray-400 text-xs font-medium">{maxSizeText}</p>
    </button>
  );
}
