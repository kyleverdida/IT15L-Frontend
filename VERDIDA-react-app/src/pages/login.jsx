import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, GraduationCap, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleLogin = async(e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials, please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      setError("Invalid credentials, please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-white relative">

      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 text-slate-900 relative z-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-red-50 border border-red-100">
              <GraduationCap className="w-10 h-10 text-red-500" />
            </div>
            <span className="text-2xl font-bold tracking-tight">UM EduFlow</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Enrollment System<br />
            <span className="text-red-400">Made Simple</span>
          </h1>
          <p className="text-slate-600 text-lg mb-8">
            Manage students, courses, and enrollments in one unified platform. Built for modern institutions.
          </p>
          <div className="flex gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Secure & fast</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> Real-time insights</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/40">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <GraduationCap className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold text-slate-900">UM EduFlow</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-600 text-sm mb-8">Sign in to your admin account</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-800/30 focus:border-red-800 transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-800/30 focus:border-red-800 transition"
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-red-900/25 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
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
            <p className="text-center text-slate-500 text-xs mt-6">Demo: Enter correct credentials (has backend)</p>
          </div>
        </div>
      </div>
    </div>
  );
}