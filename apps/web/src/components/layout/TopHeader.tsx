import { ArrowLeft, HelpCircle, Bell, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function TopHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
          <ClipboardIcon className="w-4 h-4" />
          <span>Exams</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-900 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-900 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button className="text-gray-500 hover:text-gray-900 transition-colors">
          <Sparkles className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2 pl-2 ml-2 border-l border-gray-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            {/* Avatar placeholder */}
            <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
              MR
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Eeshan shaikh</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    </svg>
  );
}
