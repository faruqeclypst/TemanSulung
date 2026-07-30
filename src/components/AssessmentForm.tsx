import React, { useState, useEffect } from 'react';
import { 
  IconArrowRight, 
  IconArrowLeft, 
  IconSparkles, 
  IconCheckCircle, 
  IconUser, 
  IconClock, 
  IconBrain, 
  IconShieldAlert,
  IconAward
} from './CustomIcons';
import { SimpleResult } from '../types';
import { saveSimpleResult, getActiveUserProfile } from '../services/storage';

interface AssessmentFormProps {
  onComplete: (result: SimpleResult) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const activeUser = getActiveUserProfile();
  const [step, setStep] = useState<number>(1);

  // Identitas Profil (Pre-filled otomatis dari profil aktif jika sudah ada)
  const [testerName, setTesterName] = useState<string>(activeUser ? activeUser.name : '');
  const [testerAge, setTesterAge] = useState<number>(activeUser ? activeUser.age : 16);

  // Sync if active user profile changes
  useEffect(() => {
    if (activeUser) {
      setTesterName(activeUser.name);
      setTesterAge(activeUser.age);
    }
  }, [activeUser?.name, activeUser?.age]);

  // Profil Beban Domestik & Adik
  const [domesticHours, setDomesticHours] = useState<number>(3);
  const [siblingCount, setSiblingCount] = useState<number>(2);

  // 8 Pertanyaan Skrining Indikator Martin & Marsh 2006 (Skala 1-5)
  const [scores, setScores] = useState<{ [key: number]: number }>({
    1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3
  });

  const QUESTIONS = [
    {
      id: 1,
      dimensi: 'Confidence (Keyakinan Diri)',
      text: '1. Saya merasa yakin tetap bisa meraih nilai baik meskipun waktu belajar terpotong tugas rumah.',
    },
    {
      id: 2,
      dimensi: 'Confidence (Keyakinan Diri)',
      text: '2. Saya percaya pada kemampuan diri sendiri saat menghadapi materi pelajaran yang sulit di sekolah.',
    },
    {
      id: 3,
      dimensi: 'Control (Kendali Waktu)',
      text: '3. Saya mampu mengatur sesi belajar fokus (misal 25 menit) di tengah-tengah kesibukan membantu keluarga.',
    },
    {
      id: 4,
      dimensi: 'Control (Kendali Waktu)',
      text: '4. Saya berani berkomunikasi santun kepada orang tua saat membutuhkan waktu tenang untuk persiapan ujian.',
    },
    {
      id: 5,
      dimensi: 'Composure (Ketenangan Emosi)',
      text: '5. Saya bisa menenangkan pikiran dan meredakan rasa cemas ketika tugas rumah & ujian datang bersamaan.',
    },
    {
      id: 6,
      dimensi: 'Composure (Ketenangan Emosi)',
      text: '6. Saya tidak merasa bersalah berlebihan saat mengambil waktu istirahat sejenak demi kesehatan fisik.',
    },
    {
      id: 7,
      dimensi: 'Commitment (Ketekunan Belajar)',
      text: '7. Saya tetap bangkit dan tidak mudah menyerah ketika hasil ujian belum sesuai dengan harapan awal.',
    },
    {
      id: 8,
      dimensi: 'Commitment (Ketekunan Belajar)',
      text: '8. Saya tetap tekun dan memiliki motivasi tinggi untuk menggapai cita-cita masa depan saya.',
    },
  ];

  const handleScoreChange = (qId: number, val: number) => {
    setScores(prev => ({ ...prev, [qId]: val }));
  };

  const handleNextStep = () => {
    if (step === 1 && !testerName.trim()) return;
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const calculateFinalResult = () => {
    const confidenceAvg = (scores[1] + scores[2]) / 2;
    const controlAvg = (scores[3] + scores[4]) / 2;
    const composureAvg = (scores[5] + scores[6]) / 2;
    const commitmentAvg = (scores[7] + scores[8]) / 2;

    const overallScore = Math.round(((confidenceAvg + controlAvg + composureAvg + commitmentAvg) / 4) * 20);

    let statusText = 'Resiliensi Sangat Baik 🌸';
    let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    let summary = `Halo ${testerName}, kemampuan resiliensimu dalam menyeimbangkan tugas rumah tangga dan pelajaran sekolah sudah sangat solid dan menginspirasi!`;
    let primaryStressors = ['Pengaturan Waktu Domestik', 'Perfeksionisme Contoh Adik'];
    let tips = [
      'Pertahankan jadwal belajar mikro 25 menit (Pomodoro) agar konsentrasi otak tetap berada di puncak.',
      'Teruskan komunikasi positif dengan orang tua dan jadilah teladan yang hangat bagi adik-adikmu.',
      'Gunakan fitur Si Jeumpa AI kapan saja saat ingin meluapkan kelelahan harian.'
    ];

    if (overallScore < 55) {
      statusText = 'Perlu Penguatan Resiliensi & Istirahat 🛋️';
      statusBadge = 'bg-rose-100 text-rose-800 border-rose-300';
      summary = `Halo ${testerName}, hasil skrining menunjukkan kamu sedang mengalami kelelahan emosional yang cukup tinggi akibat Eldest Daughter Syndrome.`;
      primaryStressors = ['Beban Tugas Rumah >3 Jam', 'Kecemasan Nilai & Rasa Bersalah (Role Guilt)'];
      tips = [
        'Pelajari Modul 1 RISE untuk mempraktikkan batasan waktu sehat bersama orang tua.',
        'Lakukan relaksasi pernapasan 4-7-8 setiap kali cemas melanda (Modul 2).',
        'Jangan ragu menemui Guru BK SMAN Modal Bangsa untuk bantuan penjadwalan belajar.'
      ];
    } else if (overallScore < 75) {
      statusText = 'Resiliensi Sedang (Cukup Baik) 🌿';
      statusBadge = 'bg-amber-100 text-amber-800 border-amber-300';
      summary = `Halo ${testerName}, kamu sudah memiliki daya tahan yang cukup baik, namun rasa cemas dan kelelahan waktu belajar kadang masih terasa menekan.`;
      primaryStressors = ['Waktu Belajar Terpotong Tugas Rumah', 'Pikiran Otomatis Negatif (ANTs)'];
      tips = [
        'Tetapkan Top 2 Priorities setiap malam sebelum mulai belajar (Modul 4).',
        'Praktikkan reframing pikiran negatif tertekan menjadi afirmasi sehat.',
        'Manfaatkan kelompok teman sebaya (Peer Group) untuk saling menyemangati.'
      ];
    }

    const finalResult: SimpleResult = {
      id: `res_${Date.now()}`,
      date: new Date().toISOString(),
      studentName: testerName,
      studentAge: testerAge,
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

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up pb-12">
      {/* Header Form */}
      <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm text-center space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
          <IconSparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Skrining Resiliensi Akademik Model RISE</span>
        </div>
        
        <h1 className="text-xl font-black text-slate-900">
          Tes Resiliensi Anak Sulung (Martin &amp; Marsh 2006)
        </h1>
        
        <p className="text-xs text-slate-600 font-medium">
          Didasarkan pada proposal riset OPSI SMAN Modal Bangsa untuk mengukur 4 dimensi ketahanan belajar.
        </p>

        {/* Progress Bar */}
        <div className="pt-3 max-w-xs mx-auto">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span>Langkah {step} dari 3</span>
            <span>{step === 1 ? '33%' : step === 2 ? '66%' : '100%'}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-purple-600 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* LANGKAH 1: Identitas Profil Kamu */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-5 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <IconUser className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Langkah 1: Identitas Profil Kamu</h2>
                <p className="text-xs text-slate-500 font-medium">Terdeteksi otomatis dari profil aktif.</p>
              </div>
            </div>

            {activeUser && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                ✓ Profil Terdeteksi
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Nama Lengkap / Panggilan Siswi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                placeholder="Misal: Dinara / Zalfa"
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:border-rose-500 bg-slate-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Usia Kamu Sekarang
              </label>
              <select
                value={testerAge}
                onChange={(e) => setTesterAge(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-rose-500 bg-slate-50/50"
              >
                {[14, 15, 16, 17, 18, 19].map((a) => (
                  <option key={a} value={a}>{a} Tahun</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleNextStep}
            disabled={!testerName.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-extrabold text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>Lanjut ke Profil Beban Rumah</span>
            <IconArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* LANGKAH 2: Profil Beban Domestik */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-5 animate-slide-up">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <IconClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Langkah 2: Profil Beban Domestik &amp; Adik</h2>
              <p className="text-xs text-slate-500 font-medium">Beban tugas rumah tangga yang kamu pegang setiap hari.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Berapa jam sehari kamu menghabiskan waktu membantu tugas rumah tangga? (menyapu, mencuci, memasak)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDomesticHours(h)}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all ${
                      domesticHours === h
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {h === 4 ? '> 3 Jam' : `${h} Jam`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                Berapa jumlah adik yang kamu bimbing atau dampingi belajar di rumah?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSiblingCount(s)}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all ${
                      siblingCount === s
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s === 4 ? '> 3 Adik' : `${s} Adik`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handlePrevStep}
              className="py-3.5 px-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <IconArrowLeft className="w-4 h-4" />
              Kembali
            </button>
            <button
              onClick={handleNextStep}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <span>Isi 8 Pertanyaan Skrining</span>
              <IconArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LANGKAH 3: 8 Pertanyaan Skrining Martin & Marsh 2006 */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-6 animate-slide-up">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <IconBrain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Langkah 3: 8 Indikator Resiliensi Akademik</h2>
              <p className="text-xs text-slate-500 font-medium">Pilih skala 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju).</p>
            </div>
          </div>

          <div className="space-y-5">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                    {q.dimensi}
                  </span>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">{q.text}</p>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleScoreChange(q.id, val)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border ${
                        scores[q.id] === val
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs scale-105'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-semibold text-slate-400 px-1">
                  <span>1: Sangat Tidak Setuju</span>
                  <span>5: Sangat Setuju</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handlePrevStep}
              className="py-4 px-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <IconArrowLeft className="w-4 h-4" />
              Kembali
            </button>
            <button
              onClick={calculateFinalResult}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-black text-sm shadow-lg shadow-rose-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
            >
              <IconCheckCircle className="w-5 h-5 text-rose-200" />
              <span> Selesai &amp; Lihat Hasil Analisis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
