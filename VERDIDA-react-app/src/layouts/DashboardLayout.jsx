import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto min-h-screen pt-16 lg:pt-0">
        <Outlet />
      </main>
      <ChatBot />
    </div>
  );
}
