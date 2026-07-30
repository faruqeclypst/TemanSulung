import React, { useState, useEffect } from 'react';
import { IconHistory, IconCalendar, IconChat, IconUser } from './CustomIcons';
import { 
  getSavedResults, 
  getSavedJournals, 
  getActiveUserProfile, 
  getUserProfiles,
  setActiveUserProfile 
} from '../services/storage';
import { SimpleResult, CBTJournalEntry, UserProfile } from '../types';

export const HistoryView: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(getUserProfiles());
  const [activeUser, setActiveUser] = useState<UserProfile | null>(getActiveUserProfile());
  const [selectedFilterName, setSelectedFilterName] = useState<string>(
    activeUser ? activeUser.name : 'all'
  );

  const [results, setResults] = useState<SimpleResult[]>([]);
  const [journals, setJournals] = useState<CBTJournalEntry[]>([]);

  // Pastel Color Themes for Padlet Cards
  const CARD_THEMES = [
    { bg: 'bg-amber-50/90', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-200/80 text-amber-900', pin: '📌' },
    { bg: 'bg-rose-50/90', border: 'border-rose-200', text: 'text-rose-900', badge: 'bg-rose-200/80 text-rose-900', pin: '🌸' },
    { bg: 'bg-purple-50/90', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-200/80 text-purple-900', pin: '✨' },
    { bg: 'bg-emerald-50/90', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-200/80 text-emerald-900', pin: '🌿' },
    { bg: 'bg-sky-50/90', border: 'border-sky-200', text: 'text-sky-900', badge: 'bg-sky-200/80 text-sky-900', pin: '☁️' },
  ];

  useEffect(() => {
    loadData();
  }, [selectedFilterName]);

  const loadData = () => {
    const filter = selectedFilterName === 'all' ? undefined : selectedFilterName;
    setResults(getSavedResults(filter));
    setJournals(getSavedJournals(filter));
  };

  const handleSelectFilter = (name: string) => {
    setSelectedFilterName(name);
    if (name !== 'all') {
      const found = profiles.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (found) {
        setActiveUserProfile(found);
        setActiveUser(found);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up pb-16">
      {/* Padlet Board Header */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-rose-200 shadow-sm text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black border border-rose-200">
          <span>📌 Papan Catatan Padlet TemanSulung</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Papan Catatan &amp; Sticky Notes
        </h1>

        <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
          Tampilan gaya Padlet papan tempel interaktif untuk riwayat tes resiliensi &amp; jurnal curhatan AI.
        </p>

        {/* User Filter Selector */}
        {profiles.length > 0 && (
          <div className="pt-2 flex justify-center items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block w-full">
              Filter Papan Profil:
            </span>

            <button
              onClick={() => handleSelectFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                selectedFilterName === 'all'
                  ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Semua ({getSavedResults().length})
            </button>

            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectFilter(p.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                  selectedFilterName.toLowerCase() === p.name.toLowerCase()
                    ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {p.name} ({getSavedResults(p.name).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 1: PADLET STICKY NOTES TRUE MASONRY - RIWAYAT TES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>📌 Papan Hasil Tes Resiliensi</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px]">
              {results.length} Catatan
            </span>
          </h2>

          {selectedFilterName !== 'all' && (
            <span className="text-[10px] text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 font-bold">
              Profil: {selectedFilterName}
            </span>
          )}
        </div>

        {results.length === 0 ? (
          <div className="bg-amber-50/60 border-2 border-dashed border-amber-200 p-8 rounded-3xl text-center text-xs text-amber-800 font-medium">
            📌 Papan Padlet belum ada catatan tes. Lakukan tes di menu &quot;Cek Tes&quot; untuk menempelkan catatan pertamamu!
          </div>
        ) : (
          /* True CSS Masonry Columns - zero vertical gap */
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {results.map((r, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              const rotation = idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]';

              return (
                <div
                  key={r.id}
                  className={`break-inside-avoid relative p-5 rounded-3xl border-2 ${theme.bg} ${theme.border} shadow-md transition-all hover:scale-[1.02] hover:shadow-lg ${rotation} space-y-3 mb-4`}
                >
                  {/* Tape Strip Accent */}
                  <div className="w-12 h-3 bg-white/80 backdrop-blur-sm rounded-xs shadow-2xs rotate-[-2deg] mx-auto -mt-7 mb-1 border border-slate-200/50"></div>

                  <div className="space-y-2">
                    {/* Header Note */}
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

                    {/* Score Badge & Status */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${r.statusBadge}`}>
                          {r.statusText}
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {r.score} <span className="text-[9px] font-normal text-slate-500">/100</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 font-medium leading-relaxed pt-1">
                        {r.summary}
                      </p>
                    </div>
                  </div>

                  {/* Footer Date */}
                  <div className="pt-2 border-t border-slate-900/10 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <IconCalendar className="w-3 h-3 text-slate-400" />
                      {new Date(r.date).toLocaleDateString('id-ID')}
                    </span>
                    <span className="text-rose-600">Model RISE</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: PADLET STICKY NOTES TRUE MASONRY - CURHATAN AI */}
      {journals.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span>💬 Papan Tempel Curhatan Si Jeumpa AI</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px]">
                {journals.length} Jurnal
              </span>
            </h2>
          </div>

          {/* True CSS Masonry Columns - zero vertical gap */}
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {journals.map((j, idx) => {
              const rotation = idx % 2 === 0 ? 'rotate-[1deg]' : 'rotate-[-1.5deg]';
              return (
                <div
                  key={j.id}
                  className={`break-inside-avoid relative p-5 rounded-3xl border-2 bg-purple-50/90 border-purple-200 shadow-md transition-all hover:scale-[1.02] ${rotation} space-y-2.5 mb-4`}
                >
                  {/* Tape Strip Accent */}
                  <div className="w-12 h-3 bg-white/80 backdrop-blur-sm rounded-xs shadow-2xs rotate-[1deg] mx-auto -mt-7 mb-1 border border-slate-200/50"></div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-purple-200/60 pb-1.5">
                      <span className="font-extrabold text-purple-900 text-[11px]">
                        👤 {j.studentName ? j.studentName : 'Kamu'}
                      </span>
                      <span className="text-xs">🌸</span>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100 text-slate-700 font-bold italic">
                      &quot;{j.curhatan}&quot;
                    </div>

                    <div className="text-purple-900 font-medium text-[11px] leading-relaxed pt-0.5">
                      <strong>Si Jeumpa AI:</strong> {j.saranPositif}
                    </div>
                  </div>

                  <div className="text-[9px] font-bold text-purple-400 text-right pt-1 border-t border-purple-200/40">
                    {new Date(j.date).toLocaleDateString('id-ID')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
