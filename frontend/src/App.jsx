import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { SocketProvider } from './context/SocketContext';

// Layout Components
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';

// Pages
import Welcome from './pages/Auth/Welcome';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MainFeed from './pages/Home/MainFeed';
import BusinessDashboard from './pages/Business/BusinessDashboard';
import WalletPage from './pages/Wallet/WalletPage';
import ChatPage from './pages/Chat/ChatPage';
import ProfilePage from './pages/Profile/ProfilePage';

function AppContent() {
  const { isAuthenticated, loading, user } = useAuth();
  const [activeTab, setActiveTab] = useState('home'); // home | business | applications | wallet | chat | me
  const [authMode, setAuthMode] = useState('welcome'); // welcome | login | register_student | register_business
  const [activeChatApp, setActiveChatApp] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-emerald-400">Loading NearbyHire...</p>
      </div>
    );
  }

  // Not logged in: Show auth flows
  if (!isAuthenticated) {
    if (authMode === 'login') {
      return (
        <Login
          onBack={() => setAuthMode('welcome')}
          onSwitchToRegister={() => setAuthMode('register_student')}
        />
      );
    }
    if (authMode === 'register_student') {
      return (
        <Register
          initialRole="STUDENT"
          onBack={() => setAuthMode('welcome')}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
    if (authMode === 'register_business') {
      return (
        <Register
          initialRole="BUSINESS"
          onBack={() => setAuthMode('welcome')}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
    return <Welcome onSelectMode={(mode) => setAuthMode(mode)} />;
  }

  // Helper to open live chat
  const handleOpenChat = (application) => {
    setActiveChatApp(application);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* Mobile container centered on desktop */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative flex flex-col border-x border-slate-200">
        <TopBar setActiveTab={setActiveTab} />

        <main className="flex-1">
          {activeTab === 'home' && <MainFeed onOpenChat={handleOpenChat} />}

          {(activeTab === 'business' || activeTab === 'applications') && (
            <BusinessDashboard onOpenChat={handleOpenChat} />
          )}

          {activeTab === 'wallet' && <WalletPage />}

          {activeTab === 'chat' && (
            <ChatPage
              activeApplication={activeChatApp}
              onBack={() => setActiveTab(user?.role === 'BUSINESS' ? 'business' : 'applications')}
            />
          )}

          {activeTab === 'me' && <ProfilePage />}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
