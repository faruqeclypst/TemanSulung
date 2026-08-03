import React from 'react';
import { 
  IconAward, 
  IconGraduationCap, 
  IconCode, 
  IconHeart, 
  IconCheckCircle, 
  IconBrain, 
  IconSparkles, 
  IconUsers, 
  IconClock, 
  IconUser, 
  IconShieldCheck, 
  IconBook 
} from './CustomIcons';
import { RiseLogoSvg } from './RiseLogoSvg';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up pb-16">
      {/* Header Banner Card with Extra Large Application SVG Logo */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-200 shadow-sm p-6 sm:p-8 text-center space-y-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-rose-100/50 rounded-full blur-2xl pointer-events-none"></div>

        {/* Extra Large Application SVG Logo & Brand Label */}
        <div className="flex flex-col items-center justify-center pt-2 gap-2">
          <RiseLogoSvg size={140} />
          <div className="text-2xl font-black tracking-tight text-slate-900 pt-1">
            RISE<span className="text-rose-500 font-black"> App</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black border border-rose-200 uppercase tracking-wider">
            Olimpiade Penelitian Siswa Indonesia (OPSI)
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dokumentasi Lengkap &amp; Landasan Riset RISE
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
            Platform interaktif <strong>RISE (Resilience Intervention for Supporting Eldest)</strong> dikembangkan khusus untuk mengukur, mendampingi, dan meningkatkan resiliensi akademik serta kesehatan mental siswi anak sulung perempuan di **SMAN Modal Bangsa Aceh**.
          </p>
        </div>
      </div>

      {/* SECTION 1: LATAR BELAKANG RISET & ELDEST DAUGHTER SYNDROME (EDS) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <IconBrain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Latar Belakang Riset &amp; Eldest Daughter Syndrome</h2>
            <p className="text-xs text-slate-500 font-medium">Fenomena Beban Ganda Anak Sulung Perempuan</p>
          </div>
        </div>

        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          Di lingkungan sekolah berasrama maupun reguler seperti SMAN Modal Bangsa, siswi anak sulung perempuan sering kali menanggung <strong>beban ganda (*double burden*)</strong>: dituntut meraih prestasi akademik tinggi sekaligus menjadi teladan dan pembantu utama pekerjaan rumah tangga (mengasuh adik, memasak, menyapu &gt;3 jam/hari).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
            <span className="text-xs font-black text-rose-800 flex items-center gap-1.5">
              ⏱️ Time Strain
            </span>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Kelelahan waktu belajar akibat terserap untuk pekerjaan rumah tangga sebelum membuka buku.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
            <span className="text-xs font-black text-purple-800 flex items-center gap-1.5">
              ⚖️ Role Burden
            </span>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Tekanan perfeksionisme untuk selalu menjadi contoh tanpa cela bagi adik-adik di rumah.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
            <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
              😔 Role Guilt
            </span>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Rasa bersalah jika menggunakan waktu pribadi untuk beristirahat atau belajar di kamar.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: 4 DIMENSI RESILIENSI AKADEMIK (MARTIN & MARSH, 2006) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <IconSparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">4 Dimensi Resiliensi Akademik</h2>
            <p className="text-xs text-slate-500 font-medium">Model Pengukuran Instrumen Martin &amp; Marsh (2006)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">1. Confidence (Keyakinan Diri)</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">2 Pertanyaan</span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Keyakinan siswi terhadap kemampuan akademisnya untuk tetap berprestasi meskipun memiliki tanggung jawab di rumah.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">2. Control (Kendali Waktu)</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-black text-[10px]">2 Pertanyaan</span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Kemampuan mengendalikan alokasi waktu belajar mandiri dan berkomunikasi santun tentang jadwal ujian kepada orang tua.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">3. Composure (Ketenangan Stres)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">2 Pertanyaan</span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Ketenangan emosional saat adik rewel serta kepemilikan mekanisme penyaluran stres yang sehat (*CBT reframing*).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">4. Commitment (Ketekunan)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black text-[10px]">2 Pertanyaan</span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Kegigihan dan daya tahan fisik-mental untuk tetap konsisten menghadiri kelas dan menyimak pelajaran di sekolah.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: 4 PILAR INTERVENSI MODEL RISE */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <IconBook className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">4 Pilar Modul Intervensi RISE</h2>
            <p className="text-xs text-slate-500 font-medium">Panduan Edukasi &amp; Penanganan Otomatis</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
            <span className="font-black text-rose-800 text-xs block">Pilar 1: Psikoedukasi Batasan Sehat (*Healthy Boundaries*)</span>
            <p className="text-slate-700 font-medium leading-relaxed">
              Edukasi penyusunan waktu fokus 25–45 menit tanpa rasa bersalah. Siswi diajarkan berkomunikasi ramah dengan orang tua untuk mendelegasikan tugas kecil ke adik.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
            <span className="font-black text-purple-800 text-xs block">Pilar 2: Regulasi Emosi CBT &amp; Reframing Pikiran</span>
            <p className="text-slate-700 font-medium leading-relaxed">
              Melatih teknik Cognitive Behavioral Therapy (CBT) untuk merubah pikiran negatif tertekan ("Aku anak yang buruk jika istirahat") menjadi afirmasi sehat bersama Si Jeumpa AI.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <span className="font-black text-emerald-800 text-xs block">Pilar 3: Dukungan Konseling BK &amp; Peer Group</span>
            <p className="text-slate-700 font-medium leading-relaxed">
              Menghubungkan siswi dengan pendampingan Guru BK SMAN Modal Bangsa dan membentuk kelompok teman sebaya sesama anak sulung untuk saling menyemangati.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
            <span className="font-black text-sky-800 text-xs block">Pilar 4: Belajar Adaptif (*Pomodoro 25m &amp; Top 2 Priorities*)</span>
            <p className="text-slate-700 font-medium leading-relaxed">
              Penggunaan Timer Mikro 25 menit fokus belajar + 5 menit rehat, serta menetapkan 2 prioritas utama belajar setiap malam agar energi tidak terkuras habis.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: PANDUAN PENGGUNAAN ALUR FITUR */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <IconShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Panduan Fitur &amp; Akses Pengguna</h2>
            <p className="text-xs text-slate-500 font-medium">Petunjuk Penggunaan Bagi Siswi &amp; Admin BK</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Untuk Siswi */}
          <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
              <IconUser className="w-4 h-4 text-rose-500" /> Bagi Siswi SMAN Modal Bangsa:
            </span>
            <ol className="list-decimal pl-4 text-slate-700 font-medium space-y-1.5 leading-relaxed">
              <li><strong>Pendaftaran / Login PIN 6-Digit</strong>: Klik <code>Login Profil Siswi</code> di kanan atas header untuk membuat profil (Nama, Username, Usia, PIN 6-digit).</li>
              <li><strong>Cek Tes Skrining</strong>: Masuk ke menu <code>Cek Tes</code>. Jawab 8 pertanyaan skala 1-5 yang dimulai kosong secara default.</li>
              <li><strong>Analisis Otomatis</strong>: Lihat grafik skor 4 dimensi resiliensi serta tips rekomendasi penanganan otomatis.</li>
              <li><strong>Curhat Si Jeumpa AI</strong>: Klik gelembung floating chat <code>Chat AI</code> di kanan bawah untuk meluapkan kelelahan dan mendapatkan reframing positif CBT.</li>
              <li><strong>Catatan Padlet</strong>: Semua hasil tes &amp; refleksi curhat tersimpan rahasia di menu <code>Catatan</code>.</li>
            </ol>
          </div>

          {/* Untuk Admin */}
          <div className="p-4.5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
            <span className="font-black text-purple-900 text-xs flex items-center gap-1.5">
              🛡️ Bagi Admin / Konselor BK / Peneliti OPSI:
            </span>
            <ol className="list-decimal pl-4 text-purple-950 font-medium space-y-1.5 leading-relaxed">
              <li><strong>Login Admin</strong>: Klik <code>Login Profil Siswi</code> ➔ <code>🔐 Mode Admin</code>. Masukkan Email <code>admin@gmail.com</code> / Password <code>sudahlupa</code> (atau username <code>admin</code>).</li>
              <li><strong>Dashboard Admin 5-Kolom</strong>: Pantau daftar siswi, skor resiliensi terbaru, status penyelesaian 4 modul, dan lakukan <strong>Reset PIN 6-Digit</strong> jika siswi lupa PIN.</li>
              <li><strong>Ekspor Asli Excel (.xlsx)</strong>: Klik <code>Ekspor Excel (.xlsx)</code> untuk mendownload rekapitulasi data penelitian OPSI yang rapi dalam format spreadsheet Microsoft Excel.</li>
              <li><strong>Pemantauan Catatan Seluruh Siswi</strong>: Masuk ke menu <code>Catatan</code> untuk memantau seluruh riwayat tes &amp; jurnal curhat siswi lengkap dengan fitur search.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* SECTION 5: TIM PENELITI & PEMBIMBING OPSI */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <IconAward className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Tim Peneliti &amp; Pembimbing OPSI</h2>
            <p className="text-xs text-slate-500 font-medium">SMAN Modal Bangsa Aceh</p>
          </div>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-base shadow-xs flex-shrink-0">
              SD
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Siti Endah Dinara</h3>
              <p className="text-[10px] text-rose-700 font-bold">Tim Peneliti OPSI SMAN Modal Bangsa</p>
              <p className="text-[10px] text-slate-500 font-medium">Penyusun Instrumen &amp; Konsep Riset</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-xs flex-shrink-0">
              ZZ
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Zalfa Zahiya</h3>
              <p className="text-[10px] text-purple-700 font-bold">Tim Peneliti OPSI SMAN Modal Bangsa</p>
              <p className="text-[10px] text-slate-500 font-medium">Penyusun Modul Intervensi RISE</p>
            </div>
          </div>
        </div>

        {/* Pembimbing Cards */}
        <div className="space-y-3 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
              <IconGraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                Pembimbing Riset OPSI
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">Eva Susanti, S.Ag., M.M</h3>
              <p className="text-[11px] text-slate-500 font-medium">Pembimbing Penelitian Riset OPSI SMAN Modal Bangsa</p>
            </div>
          </div>

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

      {/* SECTION 6: SPESIFIKASI TEKNOLOGI (TECH STACK) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-xs space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <IconCode className="w-4 h-4 text-purple-600" />
          Spesifikasi Teknologi &amp; Arsitektur Sistem:
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs font-bold">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-normal block">Frontend</span>
            <span className="text-rose-600">React 18 + TS</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-normal block">Bundler</span>
            <span className="text-purple-600">Vite 6</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-normal block">Database</span>
            <span className="text-emerald-600">Firebase DB</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-normal block">AI Counselor</span>
            <span className="text-indigo-600">Gemini Flash</span>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="text-center text-xs text-slate-400 font-medium py-2 space-y-1">
        <p>© 2026 Aplikasi RISE (Resilience Intervention for Supporting Eldest)</p>
        <p className="text-[10px]">Proposal Penelitian OPSI SMAN Modal Bangsa Aceh</p>
      </div>
    </div>
  );
};
