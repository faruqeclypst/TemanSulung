import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentResultView } from './components/AssessmentResult';
import { AICounselorModal } from './components/AICounselorModal';
import { RiseModulesView } from './components/RiseModules';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { BackgroundDoodles } from './components/BackgroundDoodles';
import { SimpleResult } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'test' | 'guide' | 'history' | 'about'>('home');
  const [testResult, setTestResult] = useState<SimpleResult | null>(null);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);

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
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </div>

      {/* Main Content View Container (z-10) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 relative z-10">
        {currentTab === 'home' && (
          <LandingPage
            onStartTest={() => setCurrentTab('test')}
            onOpenChat={() => setIsFloatingChatOpen(true)}
            onOpenGuide={() => setCurrentTab('guide')}
          />
        )}

        {currentTab === 'test' && (
          testResult ? (
            <AssessmentResultView
              result={testResult}
              onOpenChat={() => setIsFloatingChatOpen(true)}
              onOpenGuide={() => setCurrentTab('guide')}
              onRetake={handleRetakeTest}
            />
          ) : (
            <AssessmentForm onComplete={handleTestComplete} />
          )
        )}

        {currentTab === 'guide' && <RiseModulesView />}

        {currentTab === 'history' && <HistoryView />}

        {currentTab === 'about' && <AboutView />}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-slide-up">
          <div className="w-full max-w-lg">
            <AICounselorModal onClose={() => setIsFloatingChatOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
