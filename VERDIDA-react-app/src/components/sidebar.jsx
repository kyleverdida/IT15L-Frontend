import { NavLink } from 'react-router-dom';
import { Users, BookOpen, CreditCard, Settings, FileText, LayoutDashboard, Menu, X, GraduationCap, Layers } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/students', icon: Users, label: 'Students' },
  { to: '/dashboard/courses', icon: BookOpen, label: 'Courses' },
  { to: '/dashboard/programs', icon: GraduationCap, label: 'Programs' },
  { to: '/dashboard/subjects', icon: Layers, label: 'Subjects' },
  { to: '/dashboard/enrollment', icon: CreditCard, label: 'Enrollment' },
  { to: '/dashboard/reports', icon: FileText, label: 'Reports' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white text-slate-800 border border-slate-200 lg:hidden shadow-lg"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white text-slate-900 border-r border-slate-200
          transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 lg:pt-8 pt-16 lg:pt-6">
            <h1 className="text-xl font-bold text-red-800 flex items-center gap-2">
              <span className="w-2 h-8 rounded-full bg-red-800" />
              UM EduFlow
            </h1>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                  ${isActive ? 'bg-red-50 text-red-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
