import { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  LayoutDashboard,
  X,
  GraduationCap,
  Layers,
  CalendarCheck2,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/students', icon: Users, label: 'Students' },
  { to: '/dashboard/enrollments', icon: CalendarCheck2, label: 'Enrollments' },
  { to: '/dashboard/school-calendar', icon: CalendarCheck2, label: 'School Calendar' },
  { to: '/dashboard/programs', icon: GraduationCap, label: 'Programs' },
  { to: '/dashboard/subjects', icon: Layers, label: 'Subjects' },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <>
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
          flex flex-col h-screen
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 lg:pt-6 pt-16">
          <h1 className="text-xl font-bold text-red-800 flex items-center gap-2">
            <span className="w-2 h-8 rounded-full bg-red-800" />
            University of Mindanao
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => (
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
              {createElement(icon, { size: 20 })}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 pt-0" />

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </aside>
    </>
  );
}