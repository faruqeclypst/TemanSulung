import React, { useState, useEffect } from 'react';
import { IconHome, IconTest, IconBook, IconHistory, IconInfo } from './CustomIcons';
import { RiseLogoSvg } from './RiseLogoSvg';
import { UserProfileBar } from './UserProfileBar';
import { getActiveUserProfile } from '../services/storage';

interface NavbarProps {
  currentTab: 'home' | 'test' | 'guide' | 'history' | 'about' | 'admin';
  setCurrentTab: (tab: 'home' | 'test' | 'guide' | 'history' | 'about' | 'admin') => void;
  onProfileChanged?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onProfileChanged }) => {
  const [activeUser, setActiveUser] = useState(() => getActiveUserProfile());

  // Continuously sync active user session
  useEffect(() => {
    const sync = () => {
      setActiveUser(getActiveUserProfile());
    };
    sync();
    const interval = setInterval(sync, 400);
    return () => clearInterval(interval);
  }, []);

  const isAdminActive = activeUser?.id === 'admin_bk' || activeUser?.username === 'admin';

  return (
    <>
      {/* Top Header Fixed to screen top at all times (z-50) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-rose-100 px-4 sm:px-6 py-2.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Branding */}
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group flex-shrink-0"
          >
            <RiseLogoSvg size={40} />

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  RISE<span className="text-rose-500 font-extrabold text-xs ml-1 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">App</span>
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 flex-wrap justify-end">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'home' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconHome className="w-4 h-4" />
              Beranda
            </button>
            
            {!isAdminActive && (
              <button
                onClick={() => setCurrentTab('test')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === 'test' 
                    ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <IconTest className="w-4 h-4" />
                Cek Tes
              </button>
            )}

            <button
              onClick={() => setCurrentTab('guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'guide' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconBook className="w-4 h-4" />
              Modul
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'history' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconHistory className="w-4 h-4" />
              Catatan
            </button>

            <button
              onClick={() => setCurrentTab('about')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'about' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconInfo className="w-4 h-4" />
              Tentang
            </button>

            {/* Render Admin Tab Button ONLY when Admin is Logged In */}
            {isAdminActive && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentTab === 'admin' 
                    ? 'bg-purple-600 text-white shadow-2xs' 
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin
              </button>
            )}

            {/* Profile Switcher & Admin Login Badge */}
            <div className="pl-2 border-l border-slate-200 relative z-50">
              <UserProfileBar 
                onProfileChanged={onProfileChanged} 
                onNavigateTab={setCurrentTab} 
              />
            </div>
          </nav>

          {/* Mobile Profile Badge */}
          <div className="lg:hidden relative z-50 flex items-center gap-2">
            <UserProfileBar 
              onProfileChanged={onProfileChanged} 
              onNavigateTab={setCurrentTab} 
            />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar (5 Columns) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-rose-100 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              currentTab === 'home' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
            }`}
          >
            <IconHome className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Beranda</span>
          </button>

          {!isAdminActive ? (
            <button
              onClick={() => setCurrentTab('test')}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
                currentTab === 'test' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
              }`}
            >
              <IconTest className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">Cek Tes</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
                currentTab === 'admin' ? 'text-purple-600 bg-purple-50 font-bold' : 'text-purple-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[9px] mt-0.5">Admin</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('guide')}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              currentTab === 'guide' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
            }`}
          >
            <IconBook className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Modul</span>
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              currentTab === 'history' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
            }`}
          >
            <IconHistory className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Catatan</span>
          </button>

          <button
            onClick={() => setCurrentTab('about')}
            className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
              currentTab === 'about' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
            }`}
          >
            <IconInfo className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Tentang</span>
          </button>
        </div>
      </div>
    </>
  );
};
