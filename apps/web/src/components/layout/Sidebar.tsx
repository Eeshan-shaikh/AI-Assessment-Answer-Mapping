'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, ClipboardList, BookOpen, Settings, Sparkles } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'My Classroom', href: '/classroom', icon: Users },
  { name: 'Assignments', href: '/assignments', icon: FileText },
  { name: 'Exams', href: '/exams', icon: ClipboardList },
  { name: 'My Library', href: '/library', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white rounded-3xl border border-gray-100 flex flex-col h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-gray-900 text-white p-1.5 rounded-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg>
          </div>
          <span className="text-xl font-bold tracking-tight">VedaAI</span>
        </div>

        <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium mb-8 hover:opacity-90 transition-opacity">
          <Sparkles className="w-4 h-4 text-orange-400" />
          AI Teacher's Toolkit
        </button>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/exams' && pathname === '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100/80 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <span className="text-green-700 text-xs font-bold">DPS</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">Delhi Public School</p>
            <p className="text-xs text-gray-500 truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
