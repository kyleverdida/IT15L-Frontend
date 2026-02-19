import { Settings as SettingsIcon, Bell, Shield, Database } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your enrollment system preferences</p>
      </header>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-slate-100">
              <Bell size={20} className="text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-800">Notifications</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">Configure email and in-app notifications for enrollments and updates.</p>
          <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700">Configure</button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-slate-100">
              <Shield size={20} className="text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-800">Security</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">Manage password policies and session settings.</p>
          <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700">Configure</button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-slate-100">
              <Database size={20} className="text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-800">API Integration</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">Connect to Laravel backend. Set VITE_API_URL in .env for production.</p>
          <code className="block text-xs bg-slate-100 px-3 py-2 rounded-lg text-slate-600">VITE_API_URL=http://localhost:8000/api</code>
        </div>
      </div>
    </div>
  );
}
