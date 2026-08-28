import React, { useState, useEffect } from 'react';
import { UserProfile, SimpleResult, CBTJournalEntry, ModuleProgress } from '../types';
import { 
  getUserProfiles, 
  getSavedResults, 
  getSavedJournals, 
  getModuleProgress, 
  clearAllStorageData,
  deleteUserProfile,
  resetStudentPin,
  setActiveUserProfile,
  getActiveUserProfile 
} from '../services/storage';
import { onlineDb } from '../services/onlineDb';
import * as XLSX from 'xlsx';

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

const getStatusLabel = (r?: SimpleResult): string => {
  if (!r) return '-';
  if (r.statusText && !r.statusText.includes('bg-')) {
    return r.statusText;
  }
  if (r.score >= 75) return 'Resiliensi Sangat Baik';
  if (r.score >= 55) return 'Resiliensi Sedang';
  return 'Resiliensi Rendah';
};

export const AdminView: React.FC = () => {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const active = getActiveUserProfile();
    return active?.id === 'admin_bk' || active?.username === 'admin';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync authentication reactively with active user session in header bar
  useEffect(() => {
    const syncAuth = () => {
      const active = getActiveUserProfile();
      if (active?.id === 'admin_bk' || active?.username === 'admin') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    syncAuth();
    const interval = setInterval(syncAuth, 400);
    return () => clearInterval(interval);
  }, []);

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [results, setResults] = useState<SimpleResult[]>([]);
  const [journals, setJournals] = useState<CBTJournalEntry[]>([]);
  const [moduleMap, setModuleMap] = useState<Record<string, ModuleProgress>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  const handleResetData = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus/reset SEMUA data uji coba online & lokal? Data akan kembali bersih ke 0 untuk siswi asli.')) {
      setLoading(true);
      await clearAllStorageData();
      setProfiles([]);
      setResults([]);
      setJournals([]);
      setModuleMap({});
      setSelectedStudent(null);
      setLoading(false);
      alert('Data uji coba berhasil dibersihkan di semua server & perangkat!');
    }
  };

  const handleAdminResetPin = async (student: UserProfile) => {
    const newPinInput = window.prompt(
      `Reset PIN Profil Siswi "${student.name}" (@${student.username || student.name})\n\nMasukkan 6-digit PIN baru untuk siswi ini:`,
      '123456'
    );

    if (newPinInput !== null && newPinInput.trim() !== '') {
      setLoading(true);
      const updatedPin = newPinInput.trim();
      await resetStudentPin(student.id, updatedPin);
      await loadData();
      
      if (selectedStudent?.id === student.id) {
        setSelectedStudent({ ...selectedStudent, pin: updatedPin });
      }
      
      setLoading(false);
      alert(`PIN untuk siswi "${student.name}" berhasil diperbarui menjadi: ${updatedPin}`);
    }
  };

  const handleDeleteStudent = async (student: UserProfile) => {
    if (window.confirm(`Hapus siswi "${student.name}" (@${student.username || student.name}) beserta seluruh data hasil tes dan jurnalnya secara permanen?`)) {
      setLoading(true);
      await deleteUserProfile(student.id);
      if (selectedStudent?.id === student.id) {
        setSelectedStudent(null);
      }
      await loadData();
      setLoading(false);
      alert(`Profil siswi "${student.name}" berhasil dihapus.`);
    }
  };

  // Load online data directly from Firebase Realtime Database
  const loadData = async () => {
    setLoading(true);
    try {
      const conn = await onlineDb.checkConnection();
      setIsOnline(conn);

      const p = await onlineDb.fetchProfiles();
      const r = await onlineDb.fetchResults();
      const j = await onlineDb.fetchJournals();
      const m = await onlineDb.fetchAllModuleProgress();

      setProfiles(Array.isArray(p) ? p.filter(Boolean) : []);
      setResults(Array.isArray(r) ? r.filter(Boolean) : []);
      setJournals(Array.isArray(j) ? j.filter(Boolean) : []);
      setModuleMap(m || {});
    } catch (err) {
      console.warn('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const uClean = adminUsername.trim().toLowerCase();
    const pClean = adminPassword.trim();

    if ((uClean === 'admin@gmail.com' || uClean === 'admin') && pClean === 'sudahlupa') {
      const adminProf: UserProfile = {
        id: 'admin_bk',
        name: 'Admin',
        username: 'admin',
        age: 30,
        pin: 'sudahlupa'
      };
      setActiveUserProfile(adminProf);
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Username atau Password Admin salah! Silakan periksa kembali.');
    }
  };

  const getStudentModules = (profileId: string): ModuleProgress => {
    return moduleMap[profileId] || { module1: false, module2: false, module3: false, module4: false };
  };

  const getModuleSummaryString = (prog?: ModuleProgress): string => {
    if (!prog) return 'Belum Ada';
    const completed: string[] = [];
    if (prog.module1) completed.push('Modul 1 (Psikoedukasi)');
    if (prog.module2) completed.push('Modul 2 (Regulasi CBT)');
    if (prog.module3) completed.push('Modul 3 (Dukungan BK)');
    if (prog.module4) completed.push('Modul 4 (Belajar Adaptif)');
    return completed.length > 0 ? completed.join('; ') : 'Belum Ada Modul Selesai';
  };

  // Native Excel (.xlsx) Export logic (PINs are strictly masked as •••••• for privacy)
  const exportToXLSX = () => {
    if (results.length === 0 && profiles.length === 0) {
      alert('Belum ada data untuk diekspor.');
      return;
    }

    const dataToExport = profiles.map((p, idx) => {
      const pName = p?.name || 'Anonim';
      const pUsername = p?.username || pName.toLowerCase().replace(/\s+/g, '_');
      const studentResults = results.filter((r) =>
        (r?.studentName || '').toLowerCase() === pName.toLowerCase() ||
        (r?.studentName || '').toLowerCase() === pUsername.toLowerCase()
      );

      const preTest = studentResults.find((r) => r.testType === 'pre' || !r.testType);
      const postTest = studentResults.find((r) => r.testType === 'post');
      const prog = getStudentModules(p.id);

      const preScore = preTest ? preTest.score : '-';
      const preCategory = preTest ? getStatusLabel(preTest) : '-';
      const preDate = preTest ? formatDate(preTest.date) : '-';

      const postScore = postTest ? postTest.score : '-';
      const postCategory = postTest ? getStatusLabel(postTest) : '-';
      const postDate = postTest ? formatDate(postTest.date) : '-';

      let gainStr = '-';
      if (typeof preScore === 'number' && typeof postScore === 'number') {
        const diff = postScore - preScore;
        gainStr = diff >= 0 ? `+${diff} Poin` : `${diff} Poin`;
      }

      return {
        'No': idx + 1,
        'Nama Lengkap Siswi': pName,
        'Username / NISN Unik': pUsername,
        'Usia (Tahun)': p?.age || '-',
        'PIN Profil (Privasi)': '•••••• (Disamarkan)',
        'Beban Domestik (jam/hari)': preTest?.domesticHours || postTest?.domesticHours || 0,
        'Jumlah Adik': preTest?.siblingCount || postTest?.siblingCount || 0,
        'Skor Tes Awal (Pre-Test)': preScore,
        'Kategori Tes Awal': preCategory,
        'Tanggal Tes Awal': preDate,
        'Skor Post-Test': postScore,
        'Kategori Post-Test': postCategory,
        'Tanggal Post-Test': postDate,
        'Peningkatan Resiliensi': gainStr,
        'Progress Modul RISE': getModuleSummaryString(prog),
        'Total Evaluasi Tes': studentResults.length,
        'Rekomendasi & Tips BK': ((postTest || preTest)?.tips || []).join('; ')
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Auto-fit column widths in Excel
    worksheet['!cols'] = [
      { wch: 5 },   // No
      { wch: 25 },  // Nama Lengkap
      { wch: 22 },  // Username
      { wch: 12 },  // Usia
      { wch: 20 },  // PIN
      { wch: 28 },  // Beban Domestik
      { wch: 14 },  // Jumlah Adik
      { wch: 22 },  // Skor Tes Awal
      { wch: 24 },  // Kategori Tes Awal
      { wch: 20 },  // Tanggal Tes Awal
      { wch: 20 },  // Skor Post-Test
      { wch: 24 },  // Kategori Post-Test
      { wch: 20 },  // Tanggal Post-Test
      { wch: 22 },  // Peningkatan Resiliensi
      { wch: 38 },  // Progress Modul
      { wch: 20 },  // Total Evaluasi
      { wch: 55 },  // Rekomendasi & Tips
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Evaluasi Resiliensi RISE');

    const fileName = `RISE_Evaluasi_Pre_Post_Test_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Metric Computations: Filter to test results belonging to registered student profiles
  const validStudentResults = results.filter((r) =>
    profiles.some((p) => 
      (p?.name || '').toLowerCase() === (r?.studentName || '').toLowerCase() ||
      (p?.username || '').toLowerCase() === (r?.studentName || '').toLowerCase()
    )
  );
  const activeResults = validStudentResults.length > 0 ? validStudentResults : results;

  const totalStudents = profiles.length;
  const totalTests = activeResults.length;
  const avgScore = totalTests > 0
    ? Math.round(activeResults.reduce((acc, r) => acc + (r?.score || 0), 0) / totalTests)
    : 0;

  const lowResilienceCount = activeResults.filter((r) =>
    getStatusLabel(r).toLowerCase().includes('rendah')
  ).length;

  // Filtered Students
  const filteredProfiles = profiles.filter((p) => {
    const pName = p?.name || '';
    const pUsername = p?.username || '';
    if (!pName && !pUsername) return false;

    const query = (searchTerm || '').toLowerCase();
    const matchesSearch = pName.toLowerCase().includes(query) || pUsername.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    if (categoryFilter === 'ALL') return true;
    const studentResults = results.filter((r) => 
      (r?.studentName || '').toLowerCase() === pName.toLowerCase() ||
      (r?.studentName || '').toLowerCase() === pUsername.toLowerCase()
    );
    if (studentResults.length === 0) return categoryFilter === 'NONE';

    const latest = studentResults[0];
    const cat = getStatusLabel(latest).toLowerCase();
    return cat.includes(categoryFilter.toLowerCase());
  });

  // Admin Username & Password Protection Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100 shadow-xl text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-600 shadow-xs">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-800">Login Panel Admin RISE</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Khusus Admin Aplikasi RISE</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Username / Email Admin</label>
            <input
              type="text"
              placeholder="Username / Email Admin"
              value={adminUsername}
              onChange={(e) => {
                setAdminUsername(e.target.value);
                setAuthError(null);
              }}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold text-xs shadow-2xs bg-slate-50/50"
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Password Admin</label>
            <input
              type="password"
              placeholder="Password Admin"
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                setAuthError(null);
              }}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold text-xs shadow-2xs bg-slate-50/50"
            />
          </div>

          {authError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse text-center">
              ⚠️ {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={!adminUsername.trim() || !adminPassword.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-black rounded-2xl shadow-md transition-all active:scale-95 text-xs disabled:opacity-50"
          >
            Masuk Panel Admin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="bg-white/95 backdrop-blur-md p-5 sm:p-7 rounded-3xl border border-rose-100 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Dashboard Admin RISE</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
              isOnline ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isOnline ? 'Firebase Online DB Active' : 'Offline / Local Cache'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Pemantauan & Analisis Data Resiliensi Akademik Siswi SMAN Modal Bangsa</p>
        </div>

        {/* Action Button Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full lg:w-auto">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>

          <button
            onClick={exportToXLSX}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Ekspor Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleResetData}
            title="Hapus semua data uji coba dan mulai bersih 0"
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs hover:shadow-md transition-shadow">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Siswi Terdaftar</div>
          <div className="text-3xl font-black text-slate-800">{totalStudents}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Profil online di Firebase</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs hover:shadow-md transition-shadow">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Tes Resiliensi</div>
          <div className="text-3xl font-black text-rose-600">{totalTests}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Dari {totalStudents} siswi terdaftar</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs hover:shadow-md transition-shadow">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rata-rata Skor Resiliensi</div>
          <div className="text-3xl font-black text-purple-600">{avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Model RISE Assessment</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-3xl border border-amber-200 shadow-2xs hover:shadow-md transition-shadow">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Perlu Pendampingan BK</div>
          <div className="text-3xl font-black text-amber-600">{lowResilienceCount}</div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">Resiliensi Rendah / Sangat Rendah</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-rose-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-slate-900">Daftar Siswi &amp; Reset PIN Profil</h2>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari nama atau username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-2xs"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 w-full sm:w-auto shadow-2xs"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Tinggi">Resiliensi Tinggi</option>
              <option value="Sedang">Resiliensi Sedang</option>
              <option value="Rendah">Resiliensi Rendah</option>
            </select>
          </div>
        </div>

        {/* Compact 5-Column Table (Fit on Screen without Horizontal Scroll) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase border-b border-slate-200">
                <th className="py-3 px-4">Identitas Siswi</th>
                <th className="py-3 px-4">Evaluasi Resiliensi Terbaru</th>
                <th className="py-3 px-4 text-center">Modul RISE</th>
                <th className="py-3 px-4">Tanggal Tes</th>
                <th className="py-3 px-4 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 italic">
                    Belum ada data siswi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((p) => {
                  const pName = p?.name || 'Siswi';
                  const pUsername = p?.username || pName.toLowerCase().replace(/\s+/g, '_');
                  const studentResults = results.filter((r) => 
                    (r?.studentName || '').toLowerCase() === pName.toLowerCase() ||
                    (r?.studentName || '').toLowerCase() === pUsername.toLowerCase()
                  );
                  const latestResult = studentResults[0];
                  const prog = getStudentModules(p.id);
                  const countCompleted = [prog.module1, prog.module2, prog.module3, prog.module4].filter(Boolean).length;
                  const badgeText = latestResult ? getStatusLabel(latestResult) : '';

                  return (
                    <tr key={p?.id || Math.random()} className="hover:bg-rose-50/50 transition-colors">
                      {/* Col 1: Identitas Siswi (PIN Strictly Masked as ••••••) */}
                      <td className="py-3 px-4">
                        <div className="font-black text-slate-900">{pName}</div>
                        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-purple-600 font-mono font-bold">@{pUsername}</span>
                          <span>•</span>
                          <span>{p?.age || 16} Th</span>
                          <span>•</span>
                          <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200" title="PIN Rahasia Siswi (Disamarkan)">🔑 ••••••</span>
                        </div>
                      </td>

                      {/* Col 2: Evaluasi Resiliensi Terbaru */}
                      <td className="py-3 px-4">
                        {latestResult ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-rose-600 text-sm">{latestResult.score || 0} <span className="text-[10px] font-normal text-slate-400">/ 100</span></span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                badgeText.toLowerCase().includes('tinggi') || badgeText.toLowerCase().includes('sangat baik')
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : badgeText.toLowerCase().includes('sedang')
                                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                  : 'bg-amber-100 text-amber-700 border border-amber-200'
                              }`}>
                                {badgeText}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              Total {studentResults.length}x Tes Evaluasi
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Belum Ada Tes</span>
                        )}
                      </td>

                      {/* Col 3: Modul RISE */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200">
                          <span className="text-purple-600 font-extrabold">{countCompleted}/4</span> Modul
                        </span>
                      </td>

                      {/* Col 4: Tanggal Tes */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] font-medium">
                        {latestResult ? formatDate(latestResult.date) : '-'}
                      </td>

                      {/* Col 5: Aksi Admin */}
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleAdminResetPin(p)}
                          title="Reset PIN profil siswi"
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold rounded-xl text-xs transition-all shadow-2xs"
                        >
                          Reset PIN
                        </button>
                        <button
                          onClick={() => setSelectedStudent(p)}
                          className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-xl text-xs transition-all shadow-2xs"
                        >
                          Detail BK
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(p)}
                          title="Hapus profil siswi dan datanya"
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl text-xs transition-all shadow-2xs"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal (z-[100] floats in front of Navbar) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-16 sm:pt-20 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-6 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{selectedStudent?.name || 'Siswi'}</h3>
                  <span className="text-xs text-purple-600 font-mono font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    @{selectedStudent?.username || selectedStudent?.name.toLowerCase().replace(/\s+/g, '_')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-mono font-bold text-xs border border-purple-200">
                    PIN: •••••• (Rahasia)
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Umur: {selectedStudent?.age || '-'} tahun • ID: {selectedStudent?.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAdminResetPin(selectedStudent)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold rounded-xl text-xs transition-all"
                >
                  🔑 Reset PIN
                </button>
                <button
                  onClick={() => handleDeleteStudent(selectedStudent)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl text-xs transition-all flex items-center gap-1"
                >
                  🗑️ Hapus
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Section 1: Module Completion Checklist */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-purple-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Status Penyelesaian 4 Modul RISE:
                </h4>
                {(() => {
                  const m = getStudentModules(selectedStudent.id);
                  const count = [m.module1, m.module2, m.module3, m.module4].filter(Boolean).length;
                  return (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-extrabold text-[10px]">
                      {count} / 4 Selesai
                    </span>
                  );
                })()}
              </div>

              {(() => {
                const m = getStudentModules(selectedStudent.id);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold ${
                      m.module1 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <span>Modul 1: Psikoedukasi Batasan</span>
                      <span>{m.module1 ? '✓ Selesai' : '— Belum'}</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold ${
                      m.module2 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <span>Modul 2: Regulasi Emosi CBT</span>
                      <span>{m.module2 ? '✓ Selesai' : '— Belum'}</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold ${
                      m.module3 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <span>Modul 3: Dukungan BK &amp; Peer</span>
                      <span>{m.module3 ? '✓ Selesai' : '— Belum'}</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold ${
                      m.module4 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                      <span>Modul 4: Belajar Mikro 25m</span>
                      <span>{m.module4 ? '✓ Selesai' : '— Belum'}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Test History & Separation: Tes Cek vs Post-Test */}
            <div>
              <h4 className="font-extrabold text-slate-900 mb-3 text-sm flex items-center justify-between">
                <span>📊 Hasil Tes Cek &amp; Post-Test Resiliensi Akademik:</span>
              </h4>

              {(() => {
                const studentResults = results.filter((r) => 
                  (r?.studentName || '').toLowerCase() === selectedStudent.name.toLowerCase() ||
                  (r?.studentName || '').toLowerCase() === (selectedStudent.username || '').toLowerCase()
                );

                if (studentResults.length === 0) {
                  return <p className="text-xs text-slate-400 italic">Siswi ini belum menyelesaikan tes resiliensi.</p>;
                }

                const preTest = studentResults.find((r) => r.testType === 'pre' || !r.testType);
                const postTest = studentResults.find((r) => r.testType === 'post');

                return (
                  <div className="space-y-4">
                    {/* Ringkasan Perbandingan (Jika Ada Keduanya) */}
                    {preTest && postTest && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-rose-900 text-white shadow-sm space-y-3">
                        <div className="flex items-center justify-between text-xs font-black border-b border-white/20 pb-2">
                          <span>📈 Perbandingan Resiliensi (Baseline vs Post-Test)</span>
                          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">Pre vs Post</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                            <div className="text-[10px] text-purple-200 uppercase font-bold">1. Tes Cek (Pre)</div>
                            <div className="text-lg font-black text-amber-300">{preTest.score} <span className="text-[9px] font-normal text-white/70">/100</span></div>
                            <div className="text-[9px] text-white/70">{formatDate(preTest.date)}</div>
                          </div>
                          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                            <div className="text-[10px] text-purple-200 uppercase font-bold">2. Post-Test</div>
                            <div className="text-lg font-black text-emerald-300">{postTest.score} <span className="text-[9px] font-normal text-white/70">/100</span></div>
                            <div className="text-[9px] text-white/70">{formatDate(postTest.date)}</div>
                          </div>
                          <div className="bg-white/20 p-2.5 rounded-xl border border-white/20">
                            <div className="text-[10px] text-purple-200 uppercase font-bold">Peningkatan Gain</div>
                            <div className={`text-lg font-black ${postTest.score - preTest.score >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {postTest.score - preTest.score >= 0 ? `+${postTest.score - preTest.score}` : postTest.score - preTest.score} Poin
                            </div>
                            <div className="text-[9px] font-bold text-emerald-300">
                              {postTest.score > preTest.score ? '🚀 Resiliensi Meningkat' : '✨ Resiliensi Stabil'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pembagian Terpisah 2 Kotak: 1. Tes Cek vs 2. Post-Test */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* KOTAK 1: TES CEK (PRE-TEST) */}
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                        <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                          <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                            📋 1. Tes Cek (Pre-Test)
                          </span>
                          {preTest ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px]">
                              Skor: {preTest.score} / 100
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 italic">Belum Diisi</span>
                          )}
                        </div>

                        {preTest ? (
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-900">{getStatusLabel(preTest)}</span>
                              <span className="text-[10px] text-slate-500">{formatDate(preTest.date)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px] bg-white p-2 rounded-xl border border-amber-100">
                              <div>Confidence: <strong>{preTest.confidenceScore}%</strong></div>
                              <div>Control: <strong>{preTest.controlScore}%</strong></div>
                              <div>Composure: <strong>{preTest.composureScore}%</strong></div>
                              <div>Commitment: <strong>{preTest.commitmentScore}%</strong></div>
                            </div>
                            <p className="text-[11px] text-slate-700 font-medium">"{preTest.summary}"</p>
                          </div>
                        ) : (
                          <p className="text-xs text-amber-800/70 italic py-2">Siswi belum pernah mengisi Tes Cek Awal.</p>
                        )}
                      </div>

                      {/* KOTAK 2: POST-TEST */}
                      <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
                        <div className="flex items-center justify-between border-b border-purple-200/80 pb-2">
                          <span className="font-extrabold text-purple-950 text-xs flex items-center gap-1.5">
                            🎯 2. Post-Test (Akhir)
                          </span>
                          {postTest ? (
                            <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-extrabold text-[10px]">
                              Skor: {postTest.score} / 100
                            </span>
                          ) : (
                            <span className="text-[10px] text-purple-700 italic">Belum Diisi</span>
                          )}
                        </div>

                        {postTest ? (
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-purple-900">{getStatusLabel(postTest)}</span>
                              <span className="text-[10px] text-slate-500">{formatDate(postTest.date)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px] bg-white p-2 rounded-xl border border-purple-100">
                              <div>Confidence: <strong>{postTest.confidenceScore}%</strong></div>
                              <div>Control: <strong>{postTest.controlScore}%</strong></div>
                              <div>Composure: <strong>{postTest.composureScore}%</strong></div>
                              <div>Commitment: <strong>{postTest.commitmentScore}%</strong></div>
                            </div>
                            <p className="text-[11px] text-slate-700 font-medium">"{postTest.summary}"</p>
                          </div>
                        ) : (
                          <p className="text-xs text-purple-800/70 italic py-2">Siswi belum menyelesaikan Post-Test.</p>
                        )}
                      </div>
                    </div>

                    {/* Timeline Riwayat Lengkap (Jika Ada Riwayat Lain) */}
                    {studentResults.length > 2 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Seluruh Riwayat Evaluasi Siswi:</h5>
                        {studentResults.map((r, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                r.testType === 'post' ? 'bg-purple-600 text-white' : 'bg-amber-100 text-amber-900'
                              }`}>
                                {r.testType === 'post' ? 'Post-Test' : 'Tes Cek'}
                              </span>
                              <span className="font-extrabold text-slate-800">Skor: {r.score}</span>
                              <span className="text-slate-500">({getStatusLabel(r)})</span>
                            </div>
                            <span className="text-slate-400 text-[10px] font-medium">{formatDate(r.date)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Journal Entries */}
            <div>
              <h4 className="font-bold text-slate-800 mb-3 text-sm">Catatan CBT & Refleksi Siswi:</h4>
              {journals.filter((j) => 
                (j?.studentName || '').toLowerCase() === selectedStudent.name.toLowerCase() ||
                (j?.studentName || '').toLowerCase() === (selectedStudent.username || '').toLowerCase()
              ).length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada catatan jurnal CBT yang diisi.</p>
              ) : (
                <div className="space-y-3">
                  {journals
                    .filter((j) => 
                      (j?.studentName || '').toLowerCase() === selectedStudent.name.toLowerCase() ||
                      (j?.studentName || '').toLowerCase() === (selectedStudent.username || '').toLowerCase()
                    )
                    .map((j) => (
                      <div key={j?.id || Math.random()} className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-rose-800">
                          <span>{j?.curhatan || '-'}</span>
                          <span className="text-rose-400 font-normal">{formatDate(j?.date)}</span>
                        </div>
                        <p className="text-slate-700"><strong>Reframing Positif:</strong> {j?.saranPositif || '-'}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
