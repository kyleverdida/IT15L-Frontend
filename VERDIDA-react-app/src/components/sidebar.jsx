import { Users, BookOpen, CreditCard, Settings, FileText } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: <Users size={20}/>, label: 'Students' },
    { icon: <BookOpen size={20}/>, label: 'Courses' },
    { icon: <CreditCard size={20}/>, label: 'Enrollment' },
    { icon: <FileText size={20}/>, label: 'Reports' },
    { icon: <Settings size={20}/>, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
      <h1 className="text-xl font-bold mb-10 text-blue-400">EduFlow Admin</h1>
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors group">
            <span className="group-hover:text-blue-400">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}