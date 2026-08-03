import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentResultView } from './components/AssessmentResult';
import { AICounselorModal } from './components/AICounselorModal';
import { RiseModulesView } from './components/RiseModules';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { AdminView } from './components/AdminView';
import { BackgroundDoodles } from './components/BackgroundDoodles';
import { SimpleResult } from './types';
import { getActiveUserProfile } from './services/storage';

type TabType = 'home' | 'test' | 'guide' | 'history' | 'about' | 'admin';

const getInitialTab = (): TabType => {
  const validTabs: TabType[] = ['home', 'test', 'guide', 'history', 'about', 'admin'];
  
  // 1. Check URL Hash first (e.g. #admin, #history, #test)
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (validTabs.includes(hash as TabType)) {
    return hash as TabType;
  }

  // 2. Check localStorage saved tab
  const saved = localStorage.getItem('rise_active_tab') as TabType;
  if (validTabs.includes(saved)) {
    return saved;
  }

  return 'home';
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>(getInitialTab);
  const [testResult, setTestResult] = useState<SimpleResult | null>(null);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);

  const activeUser = getActiveUserProfile();

  // Auto scroll to top whenever currentTab or testResult changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab, testResult]);

  // Sync tab state with URL Hash & localStorage
  const handleSetTab = (tab: TabType) => {
    setCurrentTab(tab);
    localStorage.setItem('rise_active_tab', tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync browser back/forward or hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase() as TabType;
      const validTabs: TabType[] = ['home', 'test', 'guide', 'history', 'about', 'admin'];
      if (validTabs.includes(hash)) {
        setCurrentTab(hash);
        localStorage.setItem('rise_active_tab', hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Reset testResult whenever active user profile changes or logs out
  useEffect(() => {
    setTestResult(null);
  }, [activeUser?.id]);

  const handleTestComplete = (res: SimpleResult) => {
    setTestResult(res);
  };

  const handleRetakeTest = () => {
    setTestResult(null);
  };

  // Scroll ke atas setiap ganti halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div className="min-w-[320px] min-h-screen bg-[#faf3f6] text-slate-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-700 relative overflow-x-hidden">
      {/* PERSISTENT VISIBLE SVG DOODLE BACKGROUND OVERLAY */}
      <BackgroundDoodles />

      {/* Header Nav with high z-index (z-50) so dropdown floats in FRONT of main content */}
      <div className="relative z-50">
        <Navbar 
          currentTab={currentTab} 
          setCurrentTab={handleSetTab} 
          onProfileChanged={() => setTestResult(null)}
        />
      </div>

      {/* Main Content View Container (z-10) with generous top padding for fixed navbar */}
      <main className={`flex-1 w-full mx-auto p-4 sm:p-6 md:p-8 pt-24 sm:pt-28 md:pt-32 relative z-10 pb-24 md:pb-8 ${
        currentTab === 'admin' ? 'max-w-6xl' : 'max-w-4xl'
      }`}>
        {currentTab === 'home' && (
          <LandingPage
            onStartTest={() => handleSetTab('test')}
            onOpenChat={() => setIsFloatingChatOpen(true)}
            onOpenGuide={() => handleSetTab('guide')}
          />
        )}

        {currentTab === 'test' && (
          testResult && (testResult.studentName.toLowerCase() === (activeUser?.name || '').toLowerCase() || testResult.studentName.toLowerCase() === (activeUser?.username || '').toLowerCase()) ? (
            <AssessmentResultView
              result={testResult}
              onOpenChat={() => setIsFloatingChatOpen(true)}
              onOpenGuide={() => handleSetTab('guide')}
              onRetake={handleRetakeTest}
            />
          ) : (
            <AssessmentForm onComplete={handleTestComplete} />
          )
        )}

        {currentTab === 'guide' && <RiseModulesView />}

        {currentTab === 'history' && <HistoryView />}

        {currentTab === 'about' && <AboutView />}

        {currentTab === 'admin' && <AdminView />}
      </main>

      {/* PERSISTENT FLOATING ACTION BUTTON (FAB) FOR SI JEUMPA AI */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50">
        <button
          onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
          className="relative w-16 h-16 rounded-full overflow-hidden border-[3px] border-white shadow-xl shadow-rose-300/60 hover:scale-110 active:scale-95 transition-all"
          aria-label="Buka Chat Si Jeumpa AI"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 animate-pulse opacity-30 pointer-events-none" />
          {/* Mascot photo */}
          <img
            src="/assets/mascot_si_jeumpa_aceh.jpg"
            alt="Si Jeumpa AI"
            className="w-full h-full object-cover"
          />
          {/* Label teks "Chat AI" di dalam bawah */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-rose-600/90 to-transparent pt-3 pb-1 flex items-end justify-center">
            <span className="text-white font-black leading-none" style={{ fontSize: '8px', letterSpacing: '0.04em' }}>Chat AI</span>
          </div>
        </button>
      </div>

      {/* FLOATING OVERLAY CHAT MODAL */}
      {isFloatingChatOpen && (
        <AICounselorModal onClose={() => setIsFloatingChatOpen(false)} />
      )}
    </div>
  );
}
