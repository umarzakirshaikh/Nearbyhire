import React from 'react';
import { Home, Briefcase, Wallet, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { user } = useAuth();
  const isBusiness = user?.role === 'BUSINESS';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    {
      id: isBusiness ? 'business' : 'applications',
      label: isBusiness ? 'Business' : 'My Gigs',
      icon: Briefcase
    },
    {
      id: isBusiness ? 'chat' : 'wallet',
      label: isBusiness ? 'Messages' : 'Wallet',
      icon: isBusiness ? MessageSquare : Wallet
    },
    { id: 'me', label: 'Me', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 py-1.5 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
