import React, { useState } from 'react';
import { MapPin, Navigation, MoreVertical, LogOut, Briefcase, User, Sparkles, X } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

export default function TopBar({ setActiveTab }) {
  const { cityName, selectPresetLocation, presetLocations, detectDeviceLocation, isLocating } = useLocation();
  const { user, logout } = useAuth();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Logo & Location */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm font-bold text-lg">
              📍
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">NearbyHire</span>
                {user?.role === 'BUSINESS' ? (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    Employer
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    Student
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center text-xs font-medium text-slate-500 hover:text-emerald-700 transition"
              >
                <MapPin className="w-3.5 h-3.5 mr-0.5 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[140px] text-left">{cityName}</span>
              </button>
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="relative flex items-center space-x-1">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              aria-label="Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Context Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-11 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>

                {user?.role === 'BUSINESS' ? (
                  <button
                    onClick={() => { setActiveTab('business'); setShowMenu(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Job Posts</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { setActiveTab('wallet'); setShowMenu(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>My ₹ INR Wallet</span>
                  </button>
                )}

                <button
                  onClick={() => { setActiveTab('me'); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Profile & Settings</span>
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => { logout(); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Select Your Location</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Button */}
            <button
              onClick={() => {
                detectDeviceLocation();
                setShowLocationModal(false);
              }}
              disabled={isLocating}
              className="w-full mb-3 flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl font-semibold text-xs hover:bg-emerald-100 transition"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting GPS...' : 'Use Current Device GPS'}</span>
            </button>

            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Or Choose Popular Cities
            </div>

            <div className="space-y-1.5">
              {presetLocations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    selectPresetLocation(loc);
                    setShowLocationModal(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    cityName === loc.name
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{loc.name}</span>
                  {cityName === loc.name && <span className="text-[10px] font-bold">ACTIVE</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
