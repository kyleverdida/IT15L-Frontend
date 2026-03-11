import { useMemo, useState } from 'react';
import { ArrowRight, GraduationCap, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasUnsafeInput, sanitizeEmailInput, stripControlChars } from '../../utils/sanitize';

function validate(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (hasUnsafeInput(values.email)) {
    errors.email = 'Email contains invalid characters.';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (hasUnsafeInput(values.password)) {
    errors.password = 'Password contains invalid characters.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [values, setValues] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const canSubmit = useMemo(
    () => values.email.trim().length > 0 && values.password.length > 0,
    [values.email, values.password],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    const sanitizedValue = name === 'email' ? sanitizeEmailInput(value) : stripControlChars(value);
    setValues((prev) => ({ ...prev, [name]: sanitizedValue }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await login({
        email: sanitizeEmailInput(values.email),
        password: stripControlChars(values.password),
      });
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error.message || 'Unable to login right now.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <section className="hidden flex-1 flex-col justify-center bg-gradient-to-br from-red-900 to-red-700 px-12 text-white lg:flex">
          <div className="max-w-md">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide">
              <GraduationCap size={16} />
              University of Mindanao
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight">Enrollment System Portal</h1>
            <p className="mt-4 text-sm text-red-100">
              Securely manage admissions, enrollment analytics, and attendance trends from one dashboard.
            </p>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
            <div className="mb-8 text-center lg:hidden">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-red-800">
                <GraduationCap size={16} /> UM EduFlow
              </p>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
            <p className="mt-1 text-sm text-slate-500">Use your admin credentials to continue.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                      fieldErrors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-red-700 focus:ring-red-100'
                    }`}
                    placeholder="admin@um.edu.ph"
                    autoComplete="email"
                  />
                </div>
                {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                      fieldErrors.password
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-red-700 focus:ring-red-100'
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>
                {fieldErrors.password ? <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p> : null}
              </div>

              {submitError ? (
                <div className="rounded-lg border border-red-100 bg-red-50 p-2 text-sm text-red-700">{submitError}</div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading || !canSubmit}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-800 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <ArrowRight size={16} />
                )}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500">
              Use your backend-issued account credentials.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
