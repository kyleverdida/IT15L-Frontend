import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, GraduationCap, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/dashboard'), 1200);
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-950 relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-slate-950 to-cyan-600/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />

      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 text-white relative z-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
              <GraduationCap className="w-10 h-10 text-cyan-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight">EduFlow</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Enrollment System<br />
            <span className="text-cyan-400">Made Simple</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Manage students, courses, and enrollments in one unified platform. Built for modern institutions.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Secure & fast</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Real-time insights</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <GraduationCap className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">EduFlow</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400 text-sm mb-8">Sign in to your admin account</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
            <p className="text-center text-slate-500 text-xs mt-6">Demo: Any credentials work (no backend)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
