import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import Navbar from '../components/common/Navbar';
import ChatBot from '../components/ChatBot';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <ChatBot />
    </div>
  );
}
