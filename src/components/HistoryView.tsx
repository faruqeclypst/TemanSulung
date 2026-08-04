import React, { useState, useEffect } from 'react';
import { IconHistory, IconCalendar, IconChat, IconUser } from './CustomIcons';
import { 
  getSavedResults, 
  getSavedJournals, 
  getActiveUserProfile, 
  getUserProfiles 
} from '../services/storage';
import { SimpleResult, CBTJournalEntry, UserProfile } from '../types';

export const HistoryView: React.FC = () => {
  const [activeUser, setActiveUser] = useState<UserProfile | null>(() => getActiveUserProfile());
  const [results, setResults] = useState<SimpleResult[]>([]);
  const [journals, setJournals] = useState<CBTJournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Pastel Color Themes for Padlet Cards
  const CARD_THEMES = [
    { bg: 'bg-amber-50/90', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-200/80 text-amber-900', pin: '📌' },
    { bg: 'bg-rose-50/90', border: 'border-rose-200', text: 'text-rose-900', badge: 'bg-rose-200/80 text-rose-900', pin: '🌸' },
    { bg: 'bg-purple-50/90', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-200/80 text-purple-900', pin: '✨' },
    { bg: 'bg-emerald-50/90', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-200/80 text-emerald-900', pin: '🌿' },
    { bg: 'bg-sky-50/90', border: 'border-sky-200', text: 'text-sky-900', badge: 'bg-sky-200/80 text-sky-900', pin: '☁️' },
  ];

  const isAdminActive = activeUser?.id === 'admin_bk' || activeUser?.username === 'admin';

  // Reactively sync activeUser session & load records (All records for Admin, Private for Student)
  useEffect(() => {
    const syncActiveUser = () => {
      const current = getActiveUserProfile();
      setActiveUser(current);

      const isAdmin = current?.id === 'admin_bk' || current?.username === 'admin';

      if (isAdmin) {
        // Admin gets access to ALL student test results & ALL student CBT journals
        const allRes = getSavedResults();
        const allJournals = getSavedJournals();
        setResults(allRes);
        setJournals(allJournals);
      } else if (current) {
        // Student gets access strictly to her own private records
        const allRes = getSavedResults(current.name);
        const allJournals = getSavedJournals(current.name);

        const studentRes = allRes.filter((r) =>
          (r?.studentName || '').toLowerCase() === current.name.toLowerCase() ||
          (r?.studentName || '').toLowerCase() === (current.username || '').toLowerCase()
        );
        const studentJournals = allJournals.filter((j) =>
          (j?.studentName || '').toLowerCase() === current.name.toLowerCase() ||
          (j?.studentName || '').toLowerCase() === (current.username || '').toLowerCase()
        );

        setResults(studentRes);
        setJournals(studentJournals);
      } else {
        setResults([]);
        setJournals([]);
      }
    };

    syncActiveUser();
    const timer = setInterval(syncActiveUser, 400);
    window.addEventListener('storage', syncActiveUser);

    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', syncActiveUser);
    };
  }, [activeUser?.id]);

  // Filtered lists for Admin search
  const filteredResults = results.filter((r) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (r?.studentName || '').toLowerCase().includes(query) || (r?.summary || '').toLowerCase().includes(query);
  });

  const filteredJournals = journals.filter((j) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (j?.studentName || '').toLowerCase().includes(query) || (j?.curhatan || '').toLowerCase().includes(query) || (j?.saranPositif || '').toLowerCase().includes(query);
  });

  if (!activeUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100 shadow-xl text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-600 shadow-xs">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-slate-800">Catatan &amp; Jurnal CBT Privasi</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Sesi profil Anda sedang <strong>Keluar / Offline</strong>. Silakan login atau pilih profil Anda melalui menu kanan atas untuk melihat catatan &amp; hasil tes rahasia Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up pb-16">
      {/* Padlet Board Header */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-rose-200 shadow-sm text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black border border-rose-200">
          <span>{isAdminActive ? '🛡️ Papan Catatan & Jurnal Seluruh Siswi (Mode Admin BK)' : `📌 Papan Catatan & Jurnal @${activeUser.username || activeUser.name}`}</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {isAdminActive ? 'Pemantauan Catatan Skrining & Refleksi Siswi' : 'Riwayat Skrining & Jurnal Refleksi CBT'}
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
          {isAdminActive 
            ? 'Sebagai Admin / Konselor BK, Anda dapat memantau seluruh hasil skrining resiliensi dan jurnal curhat CBT milik semua siswi SMAN Modal Bangsa.' 
            : 'Semua catatan hasil evaluasi dan kalimat reframing positif Si Jeumpa AI milikmu tersimpan rapi dan aman di sini.'}
        </p>

        {/* Search Bar for Admin */}
        {isAdminActive && (
          <div className="pt-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Cari nama siswi atau isi catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-2xs text-center"
            />
          </div>
        )}
      </div>

      {/* SECTION 1: PADLET STICKY NOTES MASONRY - HASIL TES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>📋 Riwayat Evaluasi Resiliensi Akademik</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px]">
              {filteredResults.length} Catatan
            </span>
          </h2>
        </div>

        {filteredResults.length === 0 ? (
          <div className="p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-rose-200 text-center space-y-2">
            <p className="text-xs font-bold text-slate-500">
              {isAdminActive ? 'Belum ada data riwayat tes resiliensi siswi.' : `Belum ada riwayat tes resiliensi untuk ${activeUser.name}.`}
            </p>
            {!isAdminActive && (
              <p className="text-[11px] text-slate-400">Klik menu "Cek Tes" untuk memulai evaluasi pertama kamu!</p>
            )}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {filteredResults.map((r, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              const rotation = idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]';

              return (
                <div
                  key={r.id}
                  className={`break-inside-avoid relative p-5 rounded-3xl border-2 ${theme.bg} ${theme.border} shadow-md transition-all hover:scale-[1.02] hover:shadow-lg ${rotation} space-y-3 mb-4`}
                >
                  <div className="w-12 h-3 bg-white/80 backdrop-blur-sm rounded-xs shadow-2xs rotate-[-2deg] mx-auto -mt-7 mb-1 border border-slate-200/50"></div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between border-b border-slate-900/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-white/80 border border-slate-300 text-slate-800 flex items-center justify-center font-black text-xs shadow-2xs">
                          {r.studentName ? r.studentName.charAt(0).toUpperCase() : 'U'}
                        </span>
                        <div>
                          <span className="font-extrabold text-slate-900 text-xs block">{r.studentName}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{r.studentAge} Tahun</span>
                        </div>
                      </div>

                      <span className="text-base">{theme.pin}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/80 border border-slate-200 text-slate-800">
                          {r.statusText}
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {r.score} <span className="text-[9px] font-normal text-slate-500">/100</span>
                        </span>
                      </div>

                      <div className="pt-0.5">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          r.testType === 'post'
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {r.testType === 'post' ? '🎯 Post-Test' : '📋 Tes Awal'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 font-medium leading-relaxed pt-1">
                        {r.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900/10 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <IconCalendar className="w-3 h-3 text-slate-400" />
                      {new Date(r.date).toLocaleDateString('id-ID')}
                    </span>
                    <span className={r.testType === 'post' ? 'text-purple-600 font-black' : 'text-rose-600'}>Model RISE</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: PADLET STICKY NOTES MASONRY - CURHATAN AI */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>💬 Papan Tempel Curhatan Si Jeumpa AI</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px]">
              {filteredJournals.length} Jurnal
            </span>
          </h2>
        </div>

        {filteredJournals.length === 0 ? (
          <div className="p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-purple-200 text-center space-y-2">
            <p className="text-xs font-bold text-slate-500">Belum ada catatan jurnal CBT Si Jeumpa.</p>
            <p className="text-[11px] text-slate-400">Curahkan isi hatimu di tombol Chat AI Si Jeumpa untuk otomatis disimpan di sini!</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {filteredJournals.map((j, idx) => {
              const theme = CARD_THEMES[(idx + 2) % CARD_THEMES.length];
              const rotation = idx % 2 === 0 ? 'rotate-[1deg]' : 'rotate-[-1deg]';

              return (
                <div
                  key={j.id}
                  className={`break-inside-avoid relative p-5 rounded-3xl border-2 ${theme.bg} ${theme.border} shadow-md transition-all hover:scale-[1.02] hover:shadow-lg ${rotation} space-y-3 mb-4`}
                >
                  <div className="w-12 h-3 bg-white/80 backdrop-blur-sm rounded-xs shadow-2xs rotate-[2deg] mx-auto -mt-7 mb-1 border border-slate-200/50"></div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-900/10 pb-2">
                      <span className="font-extrabold text-slate-900">{j.studentName || 'Siswi'}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{new Date(j.date).toLocaleDateString('id-ID')}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-white/70 p-3 rounded-2xl border border-slate-200/50">
                        <span className="text-[10px] font-black text-rose-500 uppercase block mb-0.5">Ungkapan Perasaan:</span>
                        <p className="text-slate-800 font-medium italic">"{j.curhatan}"</p>
                      </div>

                      <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/60">
                        <span className="text-[10px] font-black text-emerald-700 uppercase block mb-0.5">Reframing CBT Si Jeumpa:</span>
                        <p className="text-emerald-950 font-bold">{j.saranPositif}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
