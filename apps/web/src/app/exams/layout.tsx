import { Sidebar } from '@/components/layout/Sidebar';

export default function ExamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F1F2F4] p-2 md:p-3 gap-3 overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
