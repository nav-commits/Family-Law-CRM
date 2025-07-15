import { DashboardSidebar } from '../features/sidebar';
import { DashboardHeader } from '../features/header'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
}