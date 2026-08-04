import React, { useState, useEffect } from 'react';
import { IconSparkles, IconUser, IconArrowRight, IconCheckCircle, IconBrain } from './CustomIcons';
import { SimpleResult, UserProfile } from '../types';
import { saveSimpleResult, getActiveUserProfile, getUserProfiles, saveUserProfile } from '../services/storage';

interface AssessmentFormProps {
  onComplete: (result: SimpleResult) => void;
  initialTestType?: 'pre' | 'post';
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete, initialTestType = 'pre' }) => {
  const [activeUser, setActiveUser] = useState<UserProfile | null>(() => getActiveUserProfile());
  const [step, setStep] = useState<number>(1);
  const [testType, setTestType] = useState<'pre' | 'post'>(initialTestType);

  // Sync testType when initialTestType prop changes
  useEffect(() => {
    if (initialTestType) {
      setTestType(initialTestType);
    }
  }, [initialTestType]);

  // Continuously sync with active user session from header bar
  useEffect(() => {
    const syncActiveUser = () => {
      const current = getActiveUserProfile();
      setActiveUser(current);
    };

    syncActiveUser();
    const timer = setInterval(syncActiveUser, 400);
    window.addEventListener('storage', syncActiveUser);

    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', syncActiveUser);
    };
  }, []);

  // Auto scroll to top on every step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Profil Beban Domestik & Adik
  const [domesticHours, setDomesticHours] = useState<number>(3);
  const [siblingCount, setSiblingCount] = useState<number>(2);

  // 8 Pertanyaan RISE Assessment Model (Skala 1 - 5) - Unselected by default
  const [scores, setScores] = useState<Record<number, number>>({});

  const QUESTIONS = [
    {
      id: 1,
      category: 'Confidence (Keyakinan Diri Akademik)',
      question: 'Saya yakin mampu menyelesaikan tugas sekolah dengan baik meskipun lelah membantu rumah tangga.',
    },
    {
      id: 2,
      category: 'Confidence (Keyakinan Diri Akademik)',
      question: 'Saya merasa percaya diri bisa meraih cita-cita akademis saya tanpa harus mengorbankan peran di keluarga.',
    },
    {
      id: 3,
      category: 'Control (Kendali Waktu & Tugas)',
      question: 'Saya dapat mengatur waktu belajar mandiri di rumah di antara kesibukan mengasuh adik atau menyapu.',
    },
    {
      id: 4,
      category: 'Control (Kendali Waktu & Tugas)',
      question: 'Saya berani berkomunikasi dengan santun kepada orang tua saat membutuhkan waktu fokus ujian.',
    },
    {
      id: 5,
      category: 'Composure (Ketenangan Emosi & Stres)',
      question: 'Saya tetap tenang dan tidak mudah marah saat adiknya rewel di kala saya sedang mengerjakan tugas.',
    },
    {
      id: 6,
      category: 'Composure (Ketenangan Emosi & Stres)',
      question: 'Saya memiliki cara sehat (seperti curhat atau istirahat sejenak) untuk melepaskan beban emosional.',
    },
    {
      id: 7,
      category: 'Commitment (Ketekunan & Kegigihan)',
      question: 'Saya tidak mudah menyerah meskipun lelah secara fisik setelah menyelesaikan pekerjaan rumah.',
    },
    {
      id: 8,
      category: 'Commitment (Ketekunan & Kegigihan)',
      question: 'Saya tetap konsisten menghadiri sekolah dan menyimak pelajaran dengan penuh motivasi.',
    },
  ];

  const handleScoreChange = (qId: number, val: number) => {
    setScores((prev) => ({ ...prev, [qId]: val }));
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const calculateFinalResult = () => {
    const confidenceAvg = (scores[1] + scores[2]) / 2;
    const controlAvg = (scores[3] + scores[4]) / 2;
    const composureAvg = (scores[5] + scores[6]) / 2;
    const commitmentAvg = (scores[7] + scores[8]) / 2;

    const overallScore = Math.round(((confidenceAvg + controlAvg + composureAvg + commitmentAvg) / 4) * 20);

    let statusText = 'Resiliensi Sangat Baik 🌸';
    let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    let summary = `Halo ${activeUser?.name || 'Siswi'}, ${testType === 'post' ? 'setelah mempelajari modul & konsultasi Si Jeumpa, ' : ''}kemampuan resiliensimu dalam menyeimbangkan tugas rumah tangga dan pelajaran sekolah sudah sangat solid dan menginspirasi!`;
    let primaryStressors = ['Pengaturan Waktu Domestik', 'Perfeksionisme Contoh Adik'];
    let tips = [
      'Pertahankan jadwal belajar mikro 25 menit (Pomodoro) agar konsentrasi otak tetap berada di puncak.',
      'Teruskan komunikasi positif dengan orang tua dan jadilah teladan yang hangat bagi adik-adikmu.',
      'Gunakan fitur Si Jeumpa AI kapan saja saat ingin meluapkan kelelahan harian.'
    ];

    if (overallScore < 55) {
      statusText = 'Perlu Penguatan Resiliensi & Istirahat 🛋️';
      statusBadge = 'bg-rose-100 text-rose-800 border-rose-300';
      summary = `Halo ${activeUser?.name || 'Siswi'}, kamu sedang berada di fase kelelahan fisik & emosional yang cukup tinggi akibat beban ganda di rumah. Kamu sangat hebat sudah bertahan sejauh ini!`;
      primaryStressors = ['Beban Bantu Rumah Tangga Tinggi (>3 jam)', 'Kelelahan Emosional Sulung (EDS)'];
      tips = [
        'Segera praktikkan Pilar 1 RISE: Tetapkan batasan waktu belajar 30 menit tanpa gangguan pekerjaan rumah.',
        'Bicarakan dengan Guru BK sekolah untuk mendapatkan pendampingan dan penyesuaian beban tugas.',
        'Istirahatlah tanpa rasa bersalah. Kesehatan emosionalmu adalah prioritas utama!'
      ];
    } else if (overallScore < 75) {
      statusText = 'Resiliensi Sedang (Cukup Baik) 🌿';
      statusBadge = 'bg-blue-100 text-blue-800 border-blue-300';
      summary = `Halo ${activeUser?.name || 'Siswi'}, kamu memiliki daya tahan yang cukup baik, namun terkadang masih merasa lelah di kala tugas sekolah & rumah tangga menumpuk bersamaan.`;
      tips = [
        'Gunakan teknik reframing CBT (Modul 2) saat mulai merasa tertekan atau bersalah pada diri sendiri.',
        'Bagikan tugas kecil ke adik jika memungkinkan agar kamu punya waktu bernapas.',
        'Manfaatkan kelompok teman sebaya (Peer Group) untuk saling mendukung.'
      ];
    }

    const finalResult: SimpleResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      testType,
      studentName: activeUser?.name || 'Anonim',
      studentAge: activeUser?.age || 16,
      domesticHours,
      siblingCount,
      confidenceScore: Math.round(confidenceAvg * 20),
      controlScore: Math.round(controlAvg * 20),
      composureScore: Math.round(composureAvg * 20),
      commitmentScore: Math.round(commitmentAvg * 20),
      score: overallScore,
      statusText,
      statusBadge,
      summary,
      primaryStressors,
      tips
    };

    saveSimpleResult(finalResult);
    onComplete(finalResult);
  };

  // Strictly Enforce Login Gate
  if (!activeUser) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12">
        {/* Header Banner Panel Card */}
        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-sm text-center space-y-3 animate-fade-in">
          <span className="px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-700 font-extrabold text-xs inline-flex items-center gap-1.5 shadow-2xs">
            <IconSparkles className="w-4 h-4 text-rose-500" /> Skrining Resiliensi Akademik RISE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Evaluasi Daya Tahan &amp; Beban Eldest Daughter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Isi 8 pertanyaan singkat berikut untuk mengetahui tingkat resiliensimu dan mendapatkan rekomendasi penanganan otomatis.
          </p>
        </div>

        {/* Login Gate Screen */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-rose-100 shadow-sm text-center space-y-6 animate-slide-up max-w-lg mx-auto">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xs">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900">Login Terlebih Dahulu</h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
              Tes Skrining Resiliensi RISE hanya dapat diakses oleh siswi yang sudah login dengan profil &amp; PIN 6-digit.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold text-left space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <span>🔒 Mengapa Wajib Login?</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Agar data hasil skor 4 dimensi resiliensi &amp; jurnal curhat milikmu tersimpan rahasia secara pribadi dan tidak bercampur dengan siswi lain.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-xs font-extrabold text-slate-700">
              Silakan klik tombol <span className="text-rose-600 font-black">"Login Profil Siswi"</span> di kanan atas layar untuk masuk atau membuat akun baru.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Test Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-rose-200 shadow-2xs max-w-md mx-auto">
        <button
          onClick={() => { setTestType('pre'); setStep(1); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            testType === 'pre'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-rose-50'
          }`}
        >
          <span>📋 Tes Awal (Pre-Test)</span>
        </button>

        <button
          onClick={() => { setTestType('post'); setStep(1); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            testType === 'post'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>🎯 Post-Test Resiliensi</span>
        </button>
      </div>

      {/* Header Banner Panel Card */}
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-sm text-center space-y-3 animate-fade-in">
        <span className={`px-3.5 py-1.5 rounded-full font-extrabold text-xs inline-flex items-center gap-1.5 shadow-2xs ${
          testType === 'post'
            ? 'bg-purple-100 text-purple-800 border border-purple-200'
            : 'bg-rose-100 text-rose-700 border border-rose-200'
        }`}>
          <IconSparkles className={`w-4 h-4 ${testType === 'post' ? 'text-purple-600' : 'text-rose-500'}`} />
          {testType === 'post' ? 'Post-Test Evaluasi Akhir Resiliensi RISE' : 'Tes Awal Cek Resiliensi Akademik (Pre-Test)'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {testType === 'post' ? 'Ukur Peningkatan Resiliensimu' : 'Evaluasi Daya Tahan & Beban Eldest Daughter'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
          {testType === 'post'
            ? 'Isi 8 pertanyaan Post-Test berikut untuk mengevaluasi perkembangan daya tahanmu setelah mempelajari Modul RISE & berkonsultasi dengan Si Jeumpa AI.'
            : 'Isi 8 pertanyaan singkat berikut untuk mengetahui tingkat resiliensimu dan mendapatkan rekomendasi penanganan otomatis.'}
        </p>

        {/* Progress Bar */}
        <div className="pt-2 max-w-sm mx-auto">
          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1.5">
            <span>Langkah {step} dari 2</span>
            <span className="text-purple-600 font-mono font-black">{step === 1 ? '50%' : '100%'}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                testType === 'post'
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-rose-500'
                  : 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600'
              }`}
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* LANGKAH 1: Confirm Profile & Domestic Burden */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-xs space-y-6 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-2xs">
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Konfirmasi Profil &amp; Beban Domestik</h2>
                <p className="text-xs text-emerald-700 font-bold">
                  @{activeUser.username || activeUser.name.toLowerCase().replace(/\s+/g, '_')} • Usia {activeUser.age} Tahun
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300">
              ✓ Active
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Berapa jam rata-rata kamu membantu pekerjaan rumah tangga dalam sehari?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDomesticHours(h)}
                    className={`py-3 rounded-2xl text-xs font-black transition-all border ${
                      domesticHours === h
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {h === 4 ? '> 3 Jam' : `${h} Jam`}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400">Termasuk menyapu, mencuci piring, mengasuh adik, atau memasak.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Berapa jumlah adik yang kamu asuh di rumah?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setSiblingCount(cnt)}
                    className={`py-3 rounded-2xl text-xs font-black transition-all border ${
                      siblingCount === cnt
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cnt === 3 ? '≥ 3 Adik' : `${cnt} Adik`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleNextStep}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-98"
          >
            <span>Mulai Pertanyaan Tes (8 Soal)</span>
            <IconArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* LANGKAH 2: 8 Pertanyaan Model RISE */}
      {step === 2 && (() => {
        const unansweredCount = QUESTIONS.filter((q) => !scores[q.id]).length;
        const isAllAnswered = unansweredCount === 0;

        return (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-xs space-y-6 animate-slide-up">
            <div className="border-b border-slate-100 pb-3.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold text-slate-900">8 Pertanyaan Skrining Resiliensi</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                    isAllAnswered ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {isAllAnswered ? '✓ 8/8 Terjawab' : `${8 - unansweredCount}/8 Terjawab`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Pilihlah jawaban 1 - 5 yang paling menggambarkan kondisi harimu.</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                ← Kembali
              </button>
            </div>

            <div className="space-y-5">
              {QUESTIONS.map((q) => {
                const isSelected = scores[q.id] !== undefined && scores[q.id] !== null;

                return (
                  <div key={q.id} className={`p-4.5 rounded-2xl border transition-all space-y-3 ${
                    isSelected ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50/70 border-slate-200/80'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs ${
                        isSelected ? 'bg-rose-500 text-white' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {q.id}
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-extrabold text-purple-600 tracking-wider uppercase block">
                          {q.category}
                        </span>
                        <p className="text-xs font-bold text-slate-800 leading-relaxed">{q.question}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {[
                        { val: 1, label: 'Sangat Tidak Sesuai' },
                        { val: 2, label: 'Tidak Sesuai' },
                        { val: 3, label: 'Netral' },
                        { val: 4, label: 'Sesuai' },
                        { val: 5, label: 'Sangat Sesuai' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => handleScoreChange(q.id, opt.val)}
                          className={`py-2 px-1 rounded-xl text-[10px] font-extrabold transition-all border flex flex-col items-center justify-center gap-0.5 ${
                            scores[q.id] === opt.val
                              ? 'bg-rose-500 text-white border-rose-500 shadow-2xs scale-102 font-black'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs font-black">{opt.val}</span>
                          <span className="text-[8px] font-normal leading-tight hidden sm:block text-center">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <button
                onClick={calculateFinalResult}
                disabled={!isAllAnswered}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-black text-xs shadow-lg transition-all hover:shadow-xl active:scale-98 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <IconBrain className="w-5 h-5" />
                <span>
                  {isAllAnswered 
                    ? 'Kirim & Lihat Analisis Resiliensi' 
                    : `Mohon Jawab Semua Soal (Tersisa ${unansweredCount} Pertanyaan)`}
                </span>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
