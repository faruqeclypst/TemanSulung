import React from 'react';
import { IconHome, IconTest, IconBook, IconHistory, IconInfo } from './CustomIcons';
import { RiseLogoSvg } from './RiseLogoSvg';
import { UserProfileBar } from './UserProfileBar';

interface NavbarProps {
  currentTab: 'home' | 'test' | 'guide' | 'history' | 'about';
  setCurrentTab: (tab: 'home' | 'test' | 'guide' | 'history' | 'about') => void;
  onProfileChanged?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onProfileChanged }) => {
  return (
    <>
      {/* Top Header with elevated z-index (z-50) */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-rose-100 px-4 py-2.5 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <RiseLogoSvg size={42} />

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Teman<span className="text-rose-500 font-extrabold">Sulung</span>
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'home' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconHome className="w-4 h-4" />
              Beranda
            </button>
            
            <button
              onClick={() => setCurrentTab('test')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'test' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconTest className="w-4 h-4" />
              Cek Tes
            </button>

            <button
              onClick={() => setCurrentTab('guide')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'guide' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconBook className="w-4 h-4" />
              Modul RISE
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'history' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconHistory className="w-4 h-4" />
              Catatan
            </button>

            <button
              onClick={() => setCurrentTab('about')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'about' 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconInfo className="w-4 h-4" />
              Tentang
            </button>

            {/* Profile Switcher Badge with elevated z-50 container */}
            <div className="pl-2 border-l border-slate-200 relative z-50">
              <UserProfileBar onProfileChanged={onProfileChanged} />
            </div>
          </nav>

          {/* Mobile Profile Badge */}
          <div className="md:hidden relative z-50">
            <UserProfileBar onProfileChanged={onProfileChanged} />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar (5 Columns) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-rose-100 px-2 py-2 shadow-lg">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
              currentTab === 'home' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
            }`}
          >
            <IconHome className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Beranda</span>
          </button>

          <button
            onClick={() => setCurrentTab('test')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
              currentTab === 'test' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
            }`}
          >
            <IconTest className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Cek Tes</span>
          </button>

          <button
            onClick={() => setCurrentTab('guide')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
              currentTab === 'guide' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
            }`}
          >
            <IconBook className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Modul</span>
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
              currentTab === 'history' ? 'text-rose-600 bg-rose-50 font-bold' : 'text-slate-400'
            }`}
          >
            <IconHistory className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Catatan</span>
          </button>

          <button
            onClick={() => setCurrentTab('about')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
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
