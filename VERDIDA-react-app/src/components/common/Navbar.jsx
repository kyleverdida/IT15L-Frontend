import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900">University of Mindanao</p>
            <p className="text-xs text-slate-500">Enrollment Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-slate-500">{user?.email ?? 'admin@um.edu.ph'}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
