import React from 'react';
import { IconAward, IconGraduationCap, IconCode, IconHeart, IconCheckCircle } from './CustomIcons';
import { RiseLogoSvg } from './RiseLogoSvg';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-slide-up pb-12">
      {/* Header Banner Card with Extra Large Application SVG Logo */}
      <div className="bg-white rounded-3xl border border-rose-200 shadow-sm p-6 sm:p-8 text-center space-y-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-rose-100/50 rounded-full blur-2xl pointer-events-none"></div>

        {/* Extra Large Application SVG Logo & Brand Label */}
        <div className="flex flex-col items-center justify-center pt-2 gap-2">
          <RiseLogoSvg size={160} />
          <div className="text-2xl font-black tracking-tight text-slate-900 pt-1">
            Teman<span className="text-rose-500 font-black">Sulung</span>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black border border-rose-200 uppercase tracking-wider">
            Olimpiade Penelitian Siswa Indonesia (OPSI)
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 pt-1">
            Tentang Aplikasi TemanSulung
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
            Aplikasi interaktif <strong>TemanSulung (Model RISE: Resilience Intervention for Supporting Eldest)</strong> dikembangkan khusus untuk mendukung resiliensi akademik dan kesehatan emosional siswi anak sulung perempuan (<em>Eldest Daughter Syndrome</em>).
          </p>
        </div>
      </div>

      {/* Tim Peneliti & Pengembang OPSI (Siswi SMAN Modal Bangsa Aceh) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <IconAward className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900">Tim Peneliti &amp; Pengembang OPSI</h2>
            <p className="text-[11px] text-slate-500 font-medium">Siswi SMAN Modal Bangsa Aceh</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Member 1 */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-base shadow-xs flex-shrink-0">
              SD
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Siti Endah Dinara</h3>
              <p className="text-[10px] text-rose-700 font-bold">Tim Peneliti OPSI</p>
              <p className="text-[10px] text-slate-500 font-medium">SMAN Modal Bangsa Aceh</p>
            </div>
          </div>

          {/* Member 2 */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-xs flex-shrink-0">
              ZZ
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Zalfa Zahiya</h3>
              <p className="text-[10px] text-purple-700 font-bold">Tim Peneliti OPSI</p>
              <p className="text-[10px] text-slate-500 font-medium">SMAN Modal Bangsa Aceh</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tim Pembimbing */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <IconGraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900">Pembimbing Penelitian &amp; Aplikasi</h2>
            <p className="text-[11px] text-slate-500 font-medium">Pendampingan Riset &amp; Pengembangan Web</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Pembimbing OPSI */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
              <IconGraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                Pembimbing OPSI
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">Eva Susanti, S.Ag., M.M</h3>
              <p className="text-[11px] text-slate-500 font-medium">Pembimbing Penelitian Riset OPSI SMAN Modal Bangsa</p>
            </div>
          </div>

          {/* Pembimbing Web */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">
              <IconCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 block">
                Pembimbing Aplikasi Web
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">Alfaruq Asri, S.Pd. Gr</h3>
              <p className="text-[11px] text-slate-500 font-medium">Pembimbing Pengembangan Sistem Aplikasi Web</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visi & Misi Penelitian */}
      <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <IconHeart className="w-4 h-4 text-rose-500 fill-rose-500" />
          Tujuan Utama Aplikasi TemanSulung:
        </h2>

        <ul className="space-y-2 text-xs text-slate-700 font-medium">
          <li className="flex items-start gap-2 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
            <IconCheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>Meningkatkan resiliensi akademik siswi anak sulung perempuan dalam menghadapi tantangan pelajaran sekolah.</span>
          </li>
          <li className="flex items-start gap-2 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
            <IconCheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>Mengurangi kecemasan &amp; beban mental (*Eldest Daughter Syndrome*) melalui teknik intervensi psikologis CBT &amp; mindfulness.</span>
          </li>
          <li className="flex items-start gap-2 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
            <IconCheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>Menyediakan akses konseling AI ramah anak &amp; fitur penyimpanan catatan privat tanpa perlu login.</span>
          </li>
        </ul>
      </div>

      {/* Copyright Footer */}
      <div className="text-center text-xs text-slate-400 font-medium py-2">
        © 2026 Aplikasi TemanSulung • Riset OPSI Model RISE
      </div>
    </div>
  );
};
