import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, CreditCard, MessageSquare, CloudSun } from 'lucide-react';

const mockData = [
  { name: 'Mon', students: 40 }, { name: 'Tue', students: 35 },
  { name: 'Wed', students: 55 }, { name: 'Thu', students: 70 },
  { name: 'Fri', students: 90 },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Mock */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h1 className="text-xl font-bold mb-10">EduFlow Admin</h1>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 text-blue-400 bg-blue-500/10 p-2 rounded"> <Users size={20}/> Students</div>
          <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer p-2"> <BookOpen size={20}/> Courses</div>
          <div className="flex items-center gap-3 hover:text-blue-400 cursor-pointer p-2"> <CreditCard size={20}/> Enrollment</div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {/* Header with Weather Mock */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Overview</h2>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <CloudSun className="text-orange-400" />
            <span className="text-sm font-medium">Tagum City: 29°C</span>
          </div>
        </header>

        {/* Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Widget icon={<Users />} label="Total Students" value="1,240" color="bg-blue-500" />
          <Widget icon={<BookOpen />} label="Active Courses" value="48" color="bg-green-500" />
          <Widget icon={<CreditCard />} label="Pending Fees" value="$12,400" color="bg-purple-500" />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Enrollment Trends (Weekly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Chatbot Interface */}
        <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border overflow-hidden">
          <div className="bg-blue-600 p-3 text-white flex items-center gap-2">
            <MessageSquare size={18} /> <span>EduBot Helper</span>
          </div>
          <div className="p-4 h-48 overflow-y-auto text-sm text-gray-600">
            <p className="bg-gray-100 p-2 rounded-lg mb-2">Hello! How can I help you with enrollment today?</p>
          </div>
          <div className="p-2 border-t">
            <input type="text" placeholder="Type a message..." className="w-full text-sm outline-none" />
          </div>
        </div>
      </main>
    </div>
  );
}

function Widget({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}