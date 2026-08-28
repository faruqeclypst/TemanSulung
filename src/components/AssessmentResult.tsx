import React, { useState, useEffect } from 'react';
import { 
  IconHeart, 
  IconSparkles, 
  IconChat, 
  IconBook, 
  IconRotateCcw, 
  IconUser, 
  IconShieldAlert, 
  IconAward, 
  IconBrain 
} from './CustomIcons';
import { SimpleResult } from '../types';
import { onlineDb } from '../services/onlineDb';

interface AssessmentResultProps {
  result: SimpleResult;
  onOpenChat: () => void;
  onOpenGuide: () => void;
  onRetake: () => void;
  onTakePostTest?: () => void;
}

export const AssessmentResultView: React.FC<AssessmentResultProps> = ({
  result,
  onOpenChat,
  onOpenGuide,
  onRetake,
  onTakePostTest,
}) => {
  const [studentPreTest, setStudentPreTest] = useState<SimpleResult | null>(result.testType === 'pre' ? result : null);
  const [studentPostTest, setStudentPostTest] = useState<SimpleResult | null>(result.testType === 'post' ? result : null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchComparison = async () => {
      try {
        const all = await onlineDb.fetchResults();
        const studentResults = all.filter(
          (r) => (r?.studentName || '').toLowerCase() === result.studentName.toLowerCase()
        );
        const pre = studentResults.find((r) => r.testType === 'pre' || !r.testType);
        const post = studentResults.find((r) => r.testType === 'post');
        if (pre) setStudentPreTest(pre);
        if (post) setStudentPostTest(post);
      } catch (e) {
        console.warn(e);
      }
    };
    fetchComparison();
  }, [result]);

  const hasBothTests = studentPreTest && studentPostTest;
  const gainPoints = hasBothTests ? (studentPostTest.score - studentPreTest.score) : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-slide-up pb-12">
      {/* Primary Result Banner */}
      <div className="bg-white rounded-3xl border border-rose-200 shadow-sm p-6 text-center space-y-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-100/50 rounded-full blur-2xl pointer-events-none"></div>

        {/* Tester Badge & Test Type */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black">
            <IconUser className="w-4 h-4 text-rose-500" />
            <span>Profil: {result.studentName} ({result.studentAge} Tahun)</span>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black border ${
            result.testType === 'post'
              ? 'bg-purple-100 text-purple-800 border-purple-300'
              : 'bg-amber-100 text-amber-800 border-amber-300'
          }`}>
            <span>{result.testType === 'post' ? '🎯 Hasil Post-Test' : '📋 Hasil Tes Awal (Pre-Test)'}</span>
          </div>
        </div>

        {/* Score Gauge Circle */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`${result.testType === 'post' ? 'text-purple-600' : 'text-rose-500'} transition-all duration-1000 ease-out`}
              strokeDasharray={`${result.score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{result.score}</span>
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Skor / 100</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="space-y-1">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black border ${result.statusBadge}`}>
            {result.statusText}
          </span>
          <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md mx-auto pt-1">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Comparison Banner (If Pre-Test and Post-Test exist) */}
      {hasBothTests && (
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-rose-900 text-white p-6 rounded-3xl shadow-lg space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h2 className="text-sm font-black tracking-wide">Analisis Komparatif Resiliensi</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
              Pre-Test vs Post-Test
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold uppercase text-purple-200 block">Tes Awal</span>
              <div className="text-xl font-black text-amber-300">{studentPreTest.score}</div>
              <span className="text-[9px] text-white/70">Baseline</span>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold uppercase text-purple-200 block">Post-Test</span>
              <div className="text-xl font-black text-emerald-300">{studentPostTest.score}</div>
              <span className="text-[9px] text-white/70">Setelah Modul</span>
            </div>

            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
              <span className="text-[10px] font-bold uppercase text-purple-200 block">Peningkatan</span>
              <div className={`text-xl font-black ${gainPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {gainPoints >= 0 ? `+${gainPoints}` : gainPoints} Poin
              </div>
              <span className="text-[9px] text-white/90 font-bold">
                {gainPoints > 0 ? '🚀 Meningkat!' : gainPoints === 0 ? '✨ Stabil' : '🛋️ Perlu Evaluasi'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Rincian 4 Dimensi Resiliensi (Martin & Marsh 2006) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <IconAward className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Analisis 4 Dimensi Resiliensi Akademik</h2>
            <p className="text-[11px] text-slate-500 font-medium">Model Martin &amp; Marsh 2006 Proposal OPSI</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Dimensi 1 */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
            <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider block">Confidence</span>
            <div className="text-lg font-black text-slate-900">{result.confidenceScore} %</div>
            <span className="text-[10px] text-slate-500 font-semibold block">Keyakinan Diri Akademik</span>
          </div>

          {/* Dimensi 2 */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
            <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block">Control</span>
            <div className="text-lg font-black text-slate-900">{result.controlScore} %</div>
            <span className="text-[10px] text-slate-500 font-semibold block">Kendali Waktu &amp; Tugas</span>
          </div>

          {/* Dimensi 3 */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider block">Composure</span>
            <div className="text-lg font-black text-slate-900">{result.composureScore} %</div>
            <span className="text-[10px] text-slate-500 font-semibold block">Ketenangan Emosi / Stres</span>
          </div>

          {/* Dimensi 4 */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">Commitment</span>
            <div className="text-lg font-black text-slate-900">{result.commitmentScore} %</div>
            <span className="text-[10px] text-slate-500 font-semibold block">Ketekunan &amp; Kegigihan</span>
          </div>
        </div>
      </div>

      {/* Practical Action Tips */}
      <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <IconSparkles className="w-4 h-4 text-rose-500" />
          Rekomendasi Langkah Nyata untuk {result.studentName}:
        </h2>
        <ul className="space-y-2 text-xs text-slate-700 font-medium">
          {result.tips.map((tip, idx) => (
            <li key={idx} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Step Callout for Post-Test */}
      {result.testType !== 'post' && onTakePostTest && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="text-sm font-black">Langkah Selanjutnya: Isi Post-Test Resiliensi</h3>
              <p className="text-xs text-purple-100 font-medium">
                Setelah mempelajari Modul RISE &amp; berkonsultasi dengan Si Jeumpa, jangan lupa isi Post-Test untuk melihat perkembanganmu! (Dapat diisi kapan saja).
              </p>
            </div>
          </div>
          <button
            onClick={onTakePostTest}
            className="w-full py-3 rounded-2xl bg-white text-purple-900 font-black text-xs hover:bg-purple-50 shadow-xs transition-all active:scale-98"
          >
            Ambil Post-Test Sekarang →
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenChat}
            className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-rose-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
          >
            <IconChat className="w-4 h-4" />
            <span>Curhat Si Jeumpa AI</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="p-4 rounded-2xl bg-white border border-rose-200 text-rose-700 font-extrabold text-xs hover:bg-rose-50 shadow-xs flex items-center justify-center gap-2"
          >
            <IconBook className="w-4 h-4" />
            <span>Buka Modul RISE</span>
          </button>
        </div>

        <button
          onClick={onRetake}
          className="w-full py-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <IconRotateCcw className="w-3.5 h-3.5" />
          <span>Ulangi Tes Skrining</span>
        </button>
      </div>
    </div>
  );
};
