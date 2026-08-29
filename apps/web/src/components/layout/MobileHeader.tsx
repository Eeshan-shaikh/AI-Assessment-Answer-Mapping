import { Bell, Menu } from 'lucide-react';
import Link from 'next/link';

export function MobileHeader() {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:hidden sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <button className="p-1 -ml-1 text-gray-500 hover:bg-gray-50 rounded-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 text-white p-1 rounded">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg>
          </div>
          <span className="font-bold text-gray-900">VedaAI</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-gray-500 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
          MR
        </div>
        <button className="text-gray-500">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
