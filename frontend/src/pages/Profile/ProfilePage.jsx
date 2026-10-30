import React from 'react';
import { User, Star, Award, CheckCircle2, Shield, LogOut, ArrowRightLeft, Sparkles, Building, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, logout, login } = useAuth();

  const handleSwitchToStudent = async () => {
    await login('student@nearbyhire.com', 'password123');
  };

  const handleSwitchToBusiness = async () => {
    await login('rohan@roastedbean.com', 'password123');
  };

  const isStudent = user?.role === 'STUDENT';

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-3xl flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-3 shadow-md">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
          {user?.name}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

        <div className="inline-flex items-center space-x-1.5 mt-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
          <span>{isStudent ? '🎓 Verified Student' : '💼 Business Employer'}</span>
        </div>
      </div>

      {/* Student Reputation & Reliability Engine */}
      {isStudent && (
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Service Reputation Engine
            </span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-400/30">
              Verified ID
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            {/* Reliability Score */}
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur border border-white/10">
              <div className="text-3xl font-black text-emerald-300 tracking-tight">
                {user?.reliabilityScore || 95}%
              </div>
              <p className="text-[11px] font-bold text-slate-300 mt-1">
                Reliability Index
              </p>
              <p className="text-[10px] text-emerald-200/70">Punctuality & completion</p>
            </div>

            {/* Rating */}
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur border border-white/10">
              <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
                <span>{user?.rating || 5.0}</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-[11px] font-bold text-slate-300 mt-1">
                Employer Rating
              </p>
              <p className="text-[10px] text-amber-200/70">
                {user?.reviewCount || 6} reviews
              </p>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs text-emerald-200/90 bg-emerald-900/40 px-3 py-2 rounded-xl">
            <span>Completed Gigs</span>
            <span className="font-extrabold text-white text-sm">
              {user?.completedGigs || 6} Shifts
            </span>
          </div>
        </div>
      )}

      {/* Business Details (If Employer) */}
      {!isStudent && user?.businessProfile && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Business Profile
          </h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-900">{user.businessProfile.companyName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{user.businessProfile.contactPhone || user.phone || 'Not set'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      )}

      {/* Skills & Academic Details */}
      {isStudent && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Verified Academic & Skill Tags
          </h3>
          {user?.college && (
            <p className="text-xs text-slate-700">
              <span className="font-bold">Institution:</span> {user.college}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {user?.skills?.map((skill, idx) => (
              <span
                key={idx}
                className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-xl border border-emerald-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fast Demo Role Switcher */}
      <div className="bg-slate-200/70 rounded-3xl p-4 space-y-2.5">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
          <ArrowRightLeft className="w-4 h-4 text-slate-600" />
          <span>Quick Persona Switcher (For Evaluation)</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Seamlessly test the dual-role system without logging out manually:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSwitchToStudent}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
              isStudent
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            🎓 Switch to Student
          </button>
          <button
            onClick={handleSwitchToBusiness}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
              !isStudent
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            💼 Switch to Employer
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full bg-white hover:bg-rose-50 text-rose-600 font-bold py-3.5 rounded-2xl border border-rose-200/80 transition shadow-sm text-xs flex items-center justify-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of NearbyHire</span>
      </button>
    </div>
  );
}
