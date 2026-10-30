import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Phone, GraduationCap, Building, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register({ initialRole = 'STUDENT', onBack, onSwitchToLogin }) {
  const { register } = useAuth();
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Student fields
  const [college, setCollege] = useState('');
  const [skills, setSkills] = useState('');

  // Business fields
  const [companyName, setCompanyName] = useState('');
  const [industryCategory, setIndustryCategory] = useState('Retail & Store');
  const [city, setCity] = useState('Mumbai');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name,
      email,
      password,
      role,
      phone,
      ...(role === 'STUDENT'
        ? {
            college,
            skills: skills.split(',').map((s) => s.trim()).filter(Boolean)
          }
        : {
            companyName,
            industryCategory,
            city,
            address: address || `${city} Market`
          })
    };

    const res = await register(payload);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 max-w-md mx-auto">
      <button
        onClick={onBack}
        className="self-start p-2 text-slate-500 hover:text-slate-900 -ml-2 rounded-full hover:bg-slate-200/60 transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="mt-4 mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
        <p className="text-xs text-slate-500 mt-1">Join the student hyperlocal employment exchange</p>
      </div>

      {/* Role Toggle Tabs */}
      <div className="bg-slate-200/70 p-1 rounded-2xl flex mb-5">
        <button
          type="button"
          onClick={() => setRole('STUDENT')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            role === 'STUDENT' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
          }`}
        >
          🎓 Student
        </button>
        <button
          type="button"
          onClick={() => setRole('BUSINESS')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            role === 'BUSINESS' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
          }`}
        >
          💼 Business Owner
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          {error.includes('already exists') && (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs font-bold text-emerald-700 underline hover:text-emerald-800 ml-2 whitespace-nowrap"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Role Specific Fields */}
        {role === 'STUDENT' ? (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                College / University
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Mumbai University"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Skills (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Cashier, Barista, Event Helper, English"
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store / Company Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Corner Bakery Cafe"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={industryCategory}
                  onChange={(e) => setIndustryCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Cafe & Restaurant">Cafe & Restaurant</option>
                  <option value="Retail & Store">Retail & Store</option>
                  <option value="Event Management">Event Management</option>
                  <option value="Delivery & Logistics">Delivery & Logistics</option>
                  <option value="Tutoring & Education">Tutoring & Education</option>
                  <option value="Warehouse & Moving">Warehouse & Moving</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition shadow-sm flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Complete Registration</span>}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Already registered?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-emerald-600 font-bold hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
