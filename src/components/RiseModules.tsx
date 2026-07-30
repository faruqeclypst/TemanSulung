import React, { useState, useEffect } from 'react';
import { 
  IconBook, 
  IconSparkles, 
  IconClock, 
  IconBrain, 
  IconUsers, 
  IconPlay, 
  IconPause, 
  IconRotateCcw, 
  IconLightbulb, 
  IconShieldCheck, 
  IconZap, 
  IconBookmarkCheck, 
  IconChevronRight 
} from './CustomIcons';
import { getModuleProgress, updateModuleProgress } from '../services/storage';
import { ModuleProgress } from '../types';

export const RiseModulesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState<ModuleProgress>(getModuleProgress());

  // --- Functional Timer State ---
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Timer countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleSelectMinutes = (mins: number) => {
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    setIsRunning(false);
    setIsFinished(false);
  };

  const handleToggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedMinutes * 60);
      setIsFinished(false);
    }
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
    setIsFinished(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleCompletion = (modKey: keyof ModuleProgress) => {
    const updated = updateModuleProgress({ [modKey]: !progress[modKey] });
    setProgress(updated);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-rose-200 shadow-sm overflow-hidden">
        <div className="h-56 sm:h-64 w-full relative">
          <img
            src="/assets/sister_support_rise.jpg"
            alt="Panduan Model RISE"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-5">
            <div>
              <span className="text-rose-300 font-extrabold text-xs uppercase tracking-wider block">
                Model RISE • Panduan Pembelajaran Interaktif
              </span>
              <h1 className="text-lg sm:text-xl font-black text-white">
                4 Modul Pendampingan Anak Sulung
              </h1>
            </div>
          </div>
        </div>

        <div className="p-4 text-center">
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Materi modul disusun lengkap sesuai proposal riset OPSI SMAN Modal Bangsa untuk penguatan resiliensi akademik &amp; kesehatan mental siswi.
          </p>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        {[
          { id: 1, label: 'Modul 1', sub: 'Psikoedukasi', icon: IconBrain, key: 'module1' as const },
          { id: 2, label: 'Modul 2', sub: 'Regulasi Emosi', icon: IconSparkles, key: 'module2' as const },
          { id: 3, label: 'Modul 3', sub: 'Dukungan BK', icon: IconUsers, key: 'module3' as const },
          { id: 4, label: 'Modul 4', sub: 'Belajar Adaptif', icon: IconClock, key: 'module4' as const },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDone = progress[tab.key];

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1 font-black">
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </div>
              <span className="text-[10px] font-medium opacity-90 truncate">{tab.sub}</span>
              {isDone && <span className="text-[9px] font-bold text-emerald-300">✓ Selesai</span>}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODUL 1: Psikoedukasi Beban Peran & Batasan Sehat */}
      {/* ========================================================================= */}
      {activeTab === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-5 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <IconBrain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Modul 1: Psikoedukasi Eldest Daughter Syndrome
                </h2>
                <p className="text-xs text-slate-500 font-medium">Memahami Beban Peran &amp; Membangun Batasan Sehat</p>
              </div>
            </div>

            <button
              onClick={() => toggleCompletion('module1')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold border transition-all ${
                progress.module1 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {progress.module1 ? '✓ Selesai' : 'Tandai Selesai'}
            </button>
          </div>

          {/* Gambar Konten Modul 1 */}
          <div className="rounded-2xl overflow-hidden border border-rose-100 shadow-xs h-52 sm:h-60 w-full relative">
            <img
              src="/assets/hero_rise_student.jpg"
              alt="Ilustrasi Siswi Belajar Modul 1"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-3.5">
              <span className="text-white text-xs font-bold">
                🌸 Menyeimbangkan Sekolah &amp; Tugas Rumah
              </span>
            </div>
          </div>

          {/* Materi Isi Lengkap Modul 1 */}
          <div className="space-y-4 text-xs text-slate-700 font-medium leading-relaxed">
            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 space-y-2">
              <h3 className="font-extrabold text-rose-900 flex items-center gap-1.5 text-sm">
                <IconLightbulb className="w-4 h-4 text-rose-600" />
                1. Fenomena Eldest Daughter Syndrome (EDS)
              </h3>
              <p>
                <strong>Eldest Daughter Syndrome (EDS)</strong> merujuk pada kondisi psikososial di mana anak perempuan sulung menanggung beban ganda dalam keluarga: mengasuh adik, memasak, dan merapikan rumah (seringkali &gt;3 jam/hari) sekaligus dituntut berprestasi tinggi di sekolah.
              </p>
              <p className="text-[11px] text-rose-800">
                📌 <em>Riset OPSI SMAN Modal Bangsa menunjukkan beban domestik ini memicu kelelahan emosional dan menurunkan fokus belajar jika tidak dikelola dengan tepat.</em>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1">
                <IconBookmarkCheck className="w-4 h-4 text-rose-500" />
                2. Tiga Indikator Utama yang Sering Dialami:
              </h3>
              <ul className="space-y-2">
                <li className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                    <strong className="text-slate-900 text-xs">Beban Waktu Domestik (Time Strain)</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7">
                    Waktu belajar malam sering terpotong untuk menyapu, mencuci piring, atau menemani adik belajar, sehingga energi belajar habis sebelum mulai membuka buku sekolah.
                  </p>
                </li>

                <li className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                    <strong className="text-slate-900 text-xs">Perfeksionisme &amp; Beban Contoh (Role Burden)</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7">
                    Merasa harus selalu mendapat nilai sempurna agar menjadi teladan ideal bagi adik-adik dan tidak membuat kecewa orang tua.
                  </p>
                </li>

                <li className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                    <strong className="text-slate-900 text-xs">Rasa Bersalah Waktu Pribadi (Role Guilt)</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-7">
                    Merasa bersalah atau menjadi anak yang buruk jika duduk beristirahat, menonton, atau menggunakan waktu pribadi untuk belajar di kamar.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 space-y-2">
              <h3 className="font-extrabold text-purple-900 flex items-center gap-1.5 text-sm">
                💡 3 Langkah Praktis Membangun Batasan Sehat (Healthy Boundaries):
              </h3>

              <div className="space-y-2 text-[11px] text-slate-700">
                <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-purple-100">
                  <IconChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Komunikasi Kebutuhan Ujian:</strong> Beritahu orang tua 2 hari sebelum ujian: <em>&quot;Ma, 45 menit ini aku fokus persiapan ujian ya, setelah itu langsung lanjut bantu rumah&quot;</em>.</span>
                </div>

                <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-purple-100">
                  <IconChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Delegasi Tugas Rumah ke Adik:</strong> Ajak adik mengambil tanggung jawab kecil merapikan meja belajar sendiri agar dia mandiri.</span>
                </div>

                <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-purple-100">
                  <IconChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Istirahat Tanpa Rasa Bersalah:</strong> Tubuh yang sehat &amp; rileks adalah syarat utama agar kamu bisa belajar dengan tenang.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODUL 2: Regulasi Emosi CBT & Mindfulness */}
      {/* ========================================================================= */}
      {activeTab === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-5 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <IconSparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Modul 2: Regulasi Emosi CBT &amp; Mindfulness
                </h2>
                <p className="text-xs text-slate-500 font-medium">Meredakan Kecemasan &amp; Mengubah Pikiran Negatif</p>
              </div>
            </div>

            <button
              onClick={() => toggleCompletion('module2')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold border transition-all ${
                progress.module2 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {progress.module2 ? '✓ Selesai' : 'Tandai Selesai'}
            </button>
          </div>

          {/* Gambar Konten Modul 2 */}
          <div className="rounded-2xl overflow-hidden border border-purple-100 shadow-xs h-52 sm:h-60 w-full relative">
            <img
              src="/assets/cbt_mindfulness_rise.jpg"
              alt="Ilustrasi Jurnal Emosi CBT Modul 2"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent flex items-end p-3.5">
              <span className="text-white text-xs font-bold">
                ✨ Praktik Jurnal Ketenangan Emosi CBT
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700 font-medium leading-relaxed">
            <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 space-y-2">
              <h3 className="font-extrabold text-purple-900 flex items-center gap-1.5 text-sm">
                <IconZap className="w-4 h-4 text-purple-600" />
                1. Konsep CBT Cognitive Reframing
              </h3>
              <p>
                Pendekatan <strong>Cognitive Behavioral Therapy (CBT)</strong> mengajarkan bahwa emosi tertekan bukan disebabkan oleh keadaan rumah, melainkan bagaimana pikiran kita menafsirkan keadaan tersebut.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                2. Contoh Mengubah Pikiran Otomatis Negatif (ANTs):
              </h3>

              <div className="space-y-2">
                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-100 space-y-1">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Pikiran Tertekan (Awal):</span>
                  <p className="text-slate-800 italic">&quot;Kalau nilaiku turun sedikit saja, aku gagal jadi anak sulung yang berguna.&quot;</p>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block pt-1">Afirmasi Reframing Sehat:</span>
                  <p className="text-slate-800 font-bold bg-white p-2 rounded-xl border border-emerald-200 text-emerald-900">
                    &quot;Nilaiku adalah proses belajar. Usaha keras yang kutunjukkan setiap hari sudah sangat berharga.&quot;
                  </p>
                </div>

                <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-100 space-y-1">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Pikiran Tertekan (Awal):</span>
                  <p className="text-slate-800 italic">&quot;Aku tidak boleh istirahat kalau rumah belum rapi sempurna.&quot;</p>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block pt-1">Afirmasi Reframing Sehat:</span>
                  <p className="text-slate-800 font-bold bg-white p-2 rounded-xl border border-emerald-200 text-emerald-900">
                    &quot;Tubuhku butuh istirahat agar besok bisa fokus sekolah dengan baik dan tidak sakit.&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                🧘 3. Latihan Pernapasan Relaksasi 4-7-8 (Saat Tertekan):
              </h3>
              <ol className="space-y-1.5 text-[11px] text-slate-600 list-decimal list-inside font-medium">
                <li>Tarik napas perlahan lewat hidung selama <strong>4 detik</strong>.</li>
                <li>Tahan napasmu di dada selama <strong>7 detik</strong>.</li>
                <li>Hembuskan napas perlahan lewat mulut selama <strong>8 detik</strong>.</li>
                <li>Ulangi 3 kali siklus sampai detak jantung &amp; pikiranmu terasa lebih tenang.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODUL 3: Dukungan Sekolah & BK */}
      {/* ========================================================================= */}
      {activeTab === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-xs space-y-5 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <IconUsers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Modul 3: Dukungan Sekolah &amp; Konseling BK
                </h2>
                <p className="text-xs text-slate-500 font-medium">Pelibatan Guru BK &amp; Pembentukan Peer Support Group</p>
              </div>
            </div>

            <button
              onClick={() => toggleCompletion('module3')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold border transition-all ${
                progress.module3 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {progress.module3 ? '✓ Selesai' : 'Tandai Selesai'}
            </button>
          </div>

          {/* Gambar Konten Modul 3 */}
          <div className="rounded-2xl overflow-hidden border border-indigo-100 shadow-xs h-52 sm:h-60 w-full relative">
            <img
              src="/assets/sister_support_rise.jpg"
              alt="Ilustrasi Dukungan Peer Group Modul 3"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-transparent to-transparent flex items-end p-3.5">
              <span className="text-white text-xs font-bold">
                👥 Kelompok Dukungan Sebaya &amp; Konseling BK
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700 font-medium leading-relaxed">
            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2">
              <h3 className="font-extrabold text-indigo-900 flex items-center gap-1.5 text-sm">
                <IconShieldCheck className="w-4 h-4 text-indigo-600" />
                1. Mengapa Perlu Menemui Guru BK SMAN Modal Bangsa?
              </h3>
              <p>
                Guru BK adalah fasilitator sekolah yang terikat kerahasiaan. Jika tugas sekolah terasa menumpuk berbarengan dengan kelelahan menjaga rumah/adik, Guru BK siap membantumu berdiskusi dengan wali kelas atau memberikan keringanan jadwal tugas.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                2. Cara Menyampaikan Kondisi ke Guru BK:
              </h3>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] space-y-1.5 font-mono">
                <p className="text-slate-800">
                  &quot;Ibu/Bapak Guru BK, saya mau berkonsultasi. Di rumah saya memegang tugas mengurus adik dan rumah tangga. Saat ini saya merasa agak kewalahan membagi waktu belajar ujian. Boleh saya minta saran atau bantuan pendampingan?&quot;
                </p>
              </div>
            </div>

            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 space-y-1">
              <strong className="text-rose-900 font-extrabold text-sm block">👥 3. Pembentukan Peer Support Group (Kelompok Sebaya)</strong>
              <p className="text-[11px] text-slate-600">
                Berbagi cerita dengan sesama siswi anak sulung membuatmu sadar bahwa perjuanganmu tidak sendiri. Saling bertukar strategi belajar mikro dan memberikan semangat bisa meningkatkan resiliensi emosional secara nyata.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODUL 4: Keterampilan Belajar Adaptif & Live Timer */}
      {/* ========================================================================= */}
      {activeTab === 4 && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-5 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <IconClock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Modul 4: Keterampilan Belajar Adaptif
                </h2>
                <p className="text-xs text-slate-500 font-medium">Sesi Belajar Mikro Pomodoro &amp; Timer Fungsional</p>
              </div>
            </div>

            <button
              onClick={() => toggleCompletion('module4')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold border transition-all ${
                progress.module4 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {progress.module4 ? '✓ Selesai' : 'Tandai Selesai'}
            </button>
          </div>

          {/* Gambar Konten Modul 4 */}
          <div className="rounded-2xl overflow-hidden border border-emerald-100 shadow-xs h-56 sm:h-64 w-full relative">
            <img
              src="/assets/mascot_si_jeumpa_aceh.jpg"
              alt="Ilustrasi Si Jeumpa Mascot Modul 4"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/75 via-transparent to-transparent flex items-end p-3.5">
              <span className="text-white text-xs font-bold">
                ⏱️ Belajar Mikro 25 Menit Didampingi Si Jeumpa
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700 font-medium leading-relaxed">
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <h3 className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-sm">
                💡 1. Strategi Belajar Mikro (Pomodoro Adaptif)
              </h3>
              <p>
                Kamu tidak perlu memaksa belajar 3 jam maraton tanpa henti saat tubuh sudah lelah. Belajar fokus <strong>25 menit diselingi rehat 5 menit</strong> jauh lebih efektif menyerap materi dan mencegah kelelahan otak (*academic burnout*).
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                2. Atur 2 Tugas Prioritas Harian (Top 2 Priorities):
              </h3>
              <p className="text-[11px] text-slate-600">
                Pilih maksimal 2 tugas sekolah paling penting setiap malam. Selesaikan 2 tugas ini terlebih dahulu sebelum mengerjakan hal lainnya.
              </p>
            </div>

            {/* LIVE FUNCTIONAL TIMER INTERAKTIF */}
            <div className="bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100/50 p-6 rounded-3xl border border-emerald-200 text-center space-y-4 shadow-2xs">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                  ⏱️ 3. Timer Belajar Mikro Interaktif
                </span>
                <p className="text-[11px] text-slate-500 font-medium">Pilih durasi dan tekan Mulai untuk hitung mundur:</p>
              </div>

              {/* Minute Selection Buttons */}
              <div className="flex justify-center gap-2">
                {[15, 25, 45].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleSelectMinutes(m)}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                      selectedMinutes === m
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m} Menit
                  </button>
                ))}
              </div>

              {/* Display Digital Clock */}
              <div className="py-2">
                <div className={`text-5xl font-black font-mono tracking-tight transition-colors ${
                  isRunning ? 'text-emerald-600 animate-pulse' : 'text-slate-800'
                }`}>
                  {formatTime(timeLeft)}
                </div>
                {isFinished && (
                  <div className="mt-2 p-2 rounded-xl bg-emerald-500 text-white text-xs font-bold animate-bounce">
                    🎉 Sesi Belajar Selesai! Saatnya Rehat 5 Menit 🌸
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center items-center gap-3 pt-1">
                <button
                  onClick={handleToggleTimer}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-extrabold text-xs shadow-md transition-transform active:scale-95 ${
                    isRunning
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <IconPause className="w-4 h-4 fill-white" />
                      <span>Jeda Timer</span>
                    </>
                  ) : (
                    <>
                      <IconPlay className="w-4 h-4 fill-white" />
                      <span>Mulai Timer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs shadow-2xs"
                >
                  <IconRotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
