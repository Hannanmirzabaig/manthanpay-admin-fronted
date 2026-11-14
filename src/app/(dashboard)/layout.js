
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <Sidebar />

      <main className="min-h-screen pt-20 pb-10 md:pl-64">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 flex h-10 items-center justify-center border-t border-blue-400/20 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-3 md:left-64">
        <p className="text-xs font-medium tracking-wide text-slate-200">
          © 2026 <span className="font-bold text-blue-400">ManthanPay</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
