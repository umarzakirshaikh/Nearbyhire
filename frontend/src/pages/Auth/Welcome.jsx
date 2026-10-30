import React from 'react';
import { GraduationCap, Store, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Welcome({ onSelectMode }) {
  const { login } = useAuth();

  const handleDemoStudent = async () => {
    await login('student@nearbyhire.com', 'password123');
  };

  const handleDemoBusiness = async () => {
    await login('rohan@roastedbean.com', 'password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-700 via-emerald-800 to-slate-900 text-white flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="pt-8 relative z-10">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Hyperlocal Student Employment</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-2">
          Find Nearby Gigs.<br />
          <span className="text-emerald-300">Build Experience.</span>
        </h1>
        <p className="text-emerald-100/80 text-sm leading-relaxed">
          Connect with neighborhood cafes, retail stores, and local businesses offering flexible shifts and instant ₹ INR earnings.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="my-8 space-y-3 relative z-10">
        <button
          onClick={() => onSelectMode('register_student')}
          className="w-full bg-white text-slate-900 rounded-2xl p-4.5 text-left shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.01] transition-all flex items-center justify-between group border border-white/80"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">I'm a Student</h3>
              <p className="text-xs text-slate-500">Find part-time shifts & get paid to UPI</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onSelectMode('register_business')}
          className="w-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/15 text-white rounded-2xl p-4.5 text-left transition-all flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-emerald-300 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">I'm a Business Owner</h3>
              <p className="text-xs text-emerald-100/70">Post urgent gigs & hire nearby talent</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onSelectMode('login')}
          className="w-full py-3.5 rounded-2xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition text-center"
        >
          I Already Have an Account
        </button>
      </div>

      {/* 1-Click Fast Demo Logins */}
      <div className="bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-3.5 relative z-10 text-center">
        <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-2">
          ⚡ Quick 1-Click Test Logins
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDemoStudent}
            className="bg-emerald-600 hover:bg-emerald-500 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
          >
            <span>Demo Student</span>
          </button>
          <button
            onClick={handleDemoBusiness}
            className="bg-amber-600 hover:bg-amber-500 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
          >
            <span>Demo Employer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
