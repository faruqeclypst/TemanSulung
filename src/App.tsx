import React, { useState } from 'react';
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
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-rose-300/60 hover:scale-105 active:scale-95 transition-all border-2 border-white group"
          aria-label="Buka Chat Si Jeumpa AI"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-xs flex-shrink-0 bg-white">
            <img
              src="/assets/mascot_si_jeumpa_aceh.jpg"
              alt="Mascot Si Jeumpa Floating Button"
              className="w-full h-full object-cover"
            />
          </div>

          <span className="text-xs font-black tracking-tight text-white pr-1">
            Si Jeumpa AI 🌸
          </span>
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
