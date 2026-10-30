import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login({ onBack, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  const handleFillStudent = () => {
    setEmail('student@nearbyhire.com');
    setPassword('password123');
  };

  const handleFillBusiness = () => {
    setEmail('rohan@roastedbean.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 max-w-md mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start p-2 text-slate-500 hover:text-slate-900 -ml-2 rounded-full hover:bg-slate-200/60 transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="mt-6 mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
        <p className="text-xs text-slate-500 mt-1">Sign in to manage your gigs and payouts</p>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition shadow-sm flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In</span>}
        </button>
      </form>

      {/* Auto-fill buttons */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-xs font-semibold text-slate-500 mb-2.5 text-center">
          Or fill demo credentials:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleFillStudent}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-xl transition"
          >
            Fill Student Demo
          </button>
          <button
            type="button"
            onClick={handleFillBusiness}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-xl transition"
          >
            Fill Business Demo
          </button>
        </div>
      </div>

      <p className="mt-auto pt-8 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-emerald-600 font-bold hover:underline"
        >
          Create an account
        </button>
      </p>
    </div>
  );
}
