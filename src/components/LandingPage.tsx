import React from 'react';
import { 
  IconHeart, 
  IconSparkles, 
  IconArrowRight, 
  IconShieldCheck, 
  IconGraduationCap, 
  IconBrain, 
  IconUsers, 
  IconClock 
} from './CustomIcons';

interface LandingPageProps {
  onStartTest: () => void;
  onOpenChat: () => void;
  onOpenGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartTest,
  onOpenChat,
  onOpenGuide,
}) => {
  return (
    <div className="space-y-6 animate-slide-up pb-8 max-w-2xl mx-auto">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-rose-200/90 shadow-md p-6 sm:p-8 space-y-5">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-100/60 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
            <IconHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Khusus Kamu, Anak Sulung Perempuan 🌸</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            <IconGraduationCap className="w-3.5 h-3.5 text-rose-600" />
            <span>OPSI SMAN Modal Bangsa</span>
          </div>
        </div>

        {/* 2D Cute Anime Mascot Si Jeumpa Greeting */}
        <div className="relative z-10 bg-gradient-to-r from-rose-50 via-purple-50 to-pink-50 rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-white">
            <img
              src="/assets/mascot_si_jeumpa_aceh.jpg"
              alt="Maskot Si Jeumpa"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="inline-block px-2.5 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider">
              Halo! Aku Si Jeumpa 🌸
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Teman Pendamping Anak Sulung
            </h2>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              &quot;Kamu sudah berjuang luar biasa mengurus rumah sambil sekolah. Yuk kita jaga kesehatan mentalmu bersama Si Jeumpa!&quot;
            </p>
          </div>
        </div>

        {/* Main Title */}
        <div className="relative z-10 space-y-1.5 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Hebat Banget Kamu Sudah Bertahan Sampai Hari Ini! 💕
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            Dikembangkan khusus sesuai riset OPSI SMAN Modal Bangsa untuk mendampingi siswi yang mengalami <strong className="text-rose-600">Eldest Daughter Syndrome</strong>.
          </p>
        </div>

        {/* Primary CTA Button */}
        <div className="relative z-10 pt-1">
          <button
            onClick={onStartTest}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-200 transition-all hover:scale-[1.01] active:scale-95"
          >
            <IconSparkles className="w-5 h-5 text-rose-200 animate-pulse" />
            <span>Mulai Cek Resiliensi Akademik (2 Menit)</span>
            <IconArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 4 Pilar Model RISE */}
      <section className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <IconHeart className="w-4 h-4 fill-rose-600 text-rose-600" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">4 Pilar Intervensi Model RISE</h2>
            <p className="text-[11px] text-slate-500 font-medium">Proposal OPSI SMAN Modal Bangsa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Pilar 1 */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-rose-900 flex items-center gap-1">
                <IconBrain className="w-3.5 h-3.5 text-rose-600" /> Psikoedukasi Batasan Sehat
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Cara izin belajar santun ke orang tua &amp; membagi tugas rumah tangga.
              </p>
            </div>
          </div>

          {/* Pilar 2 */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-purple-900 flex items-center gap-1">
                <IconSparkles className="w-3.5 h-3.5 text-purple-600" /> Regulasi Emosi CBT
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Mengubah rasa bersalah &amp; pikiran tertekan menjadi kalimat penguat.
              </p>
            </div>
          </div>

          {/* Pilar 3 */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-indigo-900 flex items-center gap-1">
                <IconUsers className="w-3.5 h-3.5 text-indigo-600" /> Dukungan Sekolah (BK)
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Konseling Guru BK &amp; dukungan kelompok teman sebaya (*Peer Group*).
              </p>
            </div>
          </div>

          {/* Pilar 4 */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              4
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1">
                <IconClock className="w-3.5 h-3.5 text-emerald-600" /> Belajar Adaptif 25 Mins
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Timer belajar mikro yang pas di sela-sela waktu tugas mengurus adik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 Matching 2D Vector Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Chat Teman AI */}
        <button
          onClick={onOpenChat}
          className="bg-white rounded-3xl border border-purple-100 shadow-xs text-left hover:border-purple-300 transition-all group overflow-hidden flex flex-col"
        >
          <div className="h-36 w-full overflow-hidden relative bg-purple-50">
            <img
              src="/assets/cbt_mindfulness_rise.jpg"
              alt="Teman Curhat Si Jeumpa"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent"></div>
            <span className="absolute bottom-2 left-3 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg bg-purple-600/90 backdrop-blur-md">
              💬 Si Jeumpa AI
            </span>
          </div>

          <div className="p-4 space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
              Teman Curhat Si Jeumpa
            </h3>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Curhat santai dengan maskot Si Jeumpa untuk meluapkan emosi &amp; ketegangan mental.
            </p>
          </div>
        </button>

        {/* Card 2: Panduan & Tips */}
        <button
          onClick={onOpenGuide}
          className="bg-white rounded-3xl border border-rose-100 shadow-xs text-left hover:border-rose-300 transition-all group overflow-hidden flex flex-col"
        >
          <div className="h-36 w-full overflow-hidden relative bg-rose-50">
            <img
              src="/assets/sister_support_rise.jpg"
              alt="Panduan Model RISE"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent"></div>
            <span className="absolute bottom-2 left-3 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-600/90 backdrop-blur-md">
              📖 Modul RISE
            </span>
          </div>

          <div className="p-4 space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
              Panduan Model RISE
            </h3>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Modul 1-4: Penjelasan EDS, regulasi emosi CBT, &amp; timer belajar mikro.
            </p>
          </div>
        </button>
      </div>

      {/* Trust Footer */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
        <IconShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Riset OPSI SMAN Modal Bangsa • Bebas Login &amp; Tersimpan Privat di HP.</span>
      </div>
    </div>
  );
};
