import React, { useState, useEffect } from 'react';
import { IconUser, IconCheckCircle } from './CustomIcons';
import { 
  getActiveUserProfile, 
  getUserProfiles, 
  setActiveUserProfile, 
  saveUserProfile, 
  fetchOnlineProfilesList 
} from '../services/storage';
import { UserProfile } from '../types';

interface UserProfileBarProps {
  onProfileChanged?: (profile: UserProfile | null) => void;
  onNavigateTab?: (tab: 'home' | 'test' | 'guide' | 'history' | 'about' | 'admin') => void;
}

export const UserProfileBar: React.FC<UserProfileBarProps> = ({ onProfileChanged, onNavigateTab }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loadingOnline, setLoadingOnline] = useState<boolean>(false);

  // New Student Profile Form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [newAge, setNewAge] = useState<number>(16);
  const [newPin, setNewPin] = useState<string>('');

  // PIN Verification Modal / Prompt
  const [verifyingProfile, setVerifyingProfile] = useState<UserProfile | null>(null);
  const [inputPin, setInputPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Admin Login Modal Form inside Profile Bar
  const [showAdminForm, setShowAdminForm] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  useEffect(() => {
    refreshProfiles();
  }, []);

  const refreshProfiles = async () => {
    const list = getUserProfiles();
    const active = getActiveUserProfile();
    setProfiles(list);
    setActiveUser(active);

    setLoadingOnline(true);
    try {
      const updatedList = await fetchOnlineProfilesList();
      setProfiles(updatedList);
      const updatedActive = getActiveUserProfile();
      setActiveUser(updatedActive);
    } catch (err) {
      console.warn('Online sync profile error:', err);
    } finally {
      setLoadingOnline(false);
    }
  };

  const handleSelectProfile = (p: UserProfile) => {
    if (activeUser?.id === p.id) {
      setIsOpen(false);
      return;
    }

    if (p.pin) {
      setVerifyingProfile(p);
      setInputPin('');
      setPinError(false);
    } else {
      setActiveUserProfile(p);
      setActiveUser(p);
      setIsOpen(false);
      if (onProfileChanged) onProfileChanged(p);
    }
  };

  const handleLogout = () => {
    setActiveUserProfile(null);
    setActiveUser(null);
    setIsOpen(false);
    setVerifyingProfile(null);
    setShowAdminForm(false);
    setShowAddForm(false);
    if (onProfileChanged) onProfileChanged(null);
  };

  const handleVerifyPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingProfile) return;

    const targetPin = verifyingProfile.pin || '1234';
    if (inputPin === targetPin) {
      setActiveUserProfile(verifyingProfile);
      setActiveUser(verifyingProfile);
      setVerifyingProfile(null);
      setInputPin('');
      setPinError(false);
      setIsOpen(false);
      if (onProfileChanged) onProfileChanged(verifyingProfile);
    } else {
      setPinError(true);
    }
  };

  const handleSaveOrLoginProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanUsername = (newUsername.trim() || cleanName).toLowerCase().replace(/\s+/g, '_');
    if (!cleanName && !cleanUsername) return;

    const existing = profiles.find(
      (p) => (p.username && p.username.toLowerCase() === cleanUsername) || p.name.toLowerCase() === (cleanName || cleanUsername).toLowerCase()
    );
    
    let p: UserProfile;
    if (existing) {
      if (existing.pin && inputPin && inputPin !== existing.pin) {
        setPinError(true);
        return;
      }
      setActiveUserProfile(existing);
      p = existing;
    } else {
      p = saveUserProfile(cleanName || cleanUsername, newAge, newPin.trim() || '1234', cleanUsername);
    }

    refreshProfiles();
    setShowAddForm(false);
    setFullName('');
    setNewUsername('');
    setNewPin('1234');
    setIsOpen(false);
    if (onProfileChanged) onProfileChanged(p);
  };

  // Handle Admin Login submission from profile modal
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
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
      setActiveUser(adminProf);
      setShowAdminForm(false);
      setAdminUsername('');
      setAdminPassword('');
      setAdminAuthError(null);
      setIsOpen(false);

      if (onNavigateTab) onNavigateTab('admin');
      if (onProfileChanged) onProfileChanged(adminProf);
    } else {
      setAdminAuthError('Username atau Password Admin salah! Masukkan admin@gmail.com / sudahlupa');
    }
  };

  const isAdminActive = activeUser?.id === 'admin_bk' || activeUser?.username === 'admin';

  return (
    <div className="relative z-50">
      {/* Active User / Admin Badge Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) refreshProfiles();
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-extrabold transition-all shadow-2xs ${
          isAdminActive 
            ? 'bg-purple-100 border-purple-300 text-purple-800' 
            : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
        }`}
      >
        <div className={`w-5.5 h-5.5 rounded-full text-white flex items-center justify-center text-[10px] font-black shadow-2xs flex-shrink-0 ${
          isAdminActive ? 'bg-purple-600' : 'bg-rose-500'
        }`}>
          {isAdminActive ? '🛡️' : activeUser ? activeUser.name.charAt(0).toUpperCase() : <IconUser className="w-3 h-3 text-white" />}
        </div>
        <span>{isAdminActive ? '🛡️ Admin' : activeUser ? `${activeUser.name} (@${activeUser.username || activeUser.name.toLowerCase().replace(/\s+/g, '_')})` : 'Login Profil Siswi'}</span>
        <span className={`text-[10px] ${isAdminActive ? 'text-purple-400' : 'text-rose-400'}`}>▼</span>
      </button>

      {/* Profile Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl border border-rose-200 shadow-2xl z-[100] p-4.5 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900">
              <IconUser className="w-4 h-4 text-rose-500" />
              <span>{isAdminActive ? 'Sesi Admin' : activeUser ? 'Sesi Profil Aktif' : 'Login & Sesi Profil Siswi'}</span>
              {loadingOnline && (
                <span className="text-[9px] text-rose-500 font-normal animate-pulse">Syncing...</span>
              )}
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setVerifyingProfile(null);
                setShowAdminForm(false);
              }}
              className="text-slate-400 hover:text-slate-600 font-bold text-xs"
            >
              ✕
            </button>
          </div>

          {/* Skenario A: AKUN SEDANG LOGGED IN */}
          {activeUser ? (
            isAdminActive ? (
              /* Super Clean Admin Active View with Buka Dashboard button */
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">
                      🛡️
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Admin</div>
                      <div className="text-[10px] text-purple-700 font-bold">
                        Sesi Admin Aktif
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black border border-emerald-300">
                    ✓ Active
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {onNavigateTab && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onNavigateTab('admin');
                      }}
                      className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span>📊 Buka Dashboard Admin</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Keluar / Logout Admin</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Clean Student Active View */
              <div className="space-y-2.5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center shadow-2xs">
                        {activeUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{activeUser.name}</div>
                        <div className="text-[10px] text-slate-600 font-mono font-bold">
                          @{activeUser.username || activeUser.name.toLowerCase().replace(/\s+/g, '_')}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black border border-emerald-300">
                      ✓ Sesi Aktif
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>Keluar / Logout Sesi</span>
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 font-medium text-center">
                  Klik Keluar untuk berpindah ke akun lain.
                </p>
              </div>
            )
          ) : (
            /* Skenario B: AKUN SEDANG LOGOUT (Bisa pilih profil, buat profil baru, atau login Admin) */
            <>
              {showAdminForm ? (
                /* Form Admin Login */
                <form onSubmit={handleAdminLoginSubmit} className="space-y-3 bg-purple-50/80 p-4 rounded-2xl border border-purple-200 animate-fade-in">
                  <div className="text-center space-y-0.5">
                    <h4 className="text-xs font-black text-purple-900">Login Mode Admin</h4>
                    <p className="text-[10px] text-slate-500">Khusus Admin RISE</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-purple-950 block">Username / Email Admin</label>
                    <input
                      type="text"
                      placeholder="admin@gmail.com"
                      value={adminUsername}
                      onChange={(e) => {
                        setAdminUsername(e.target.value);
                        setAdminAuthError(null);
                      }}
                      className="w-full p-2.5 rounded-xl border border-purple-200 text-xs font-bold bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-2xs"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-purple-950 block">Password Admin</label>
                    <input
                      type="password"
                      placeholder="Password Admin"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setAdminAuthError(null);
                      }}
                      className="w-full p-2.5 rounded-xl border border-purple-200 text-xs font-bold bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-2xs"
                    />
                  </div>

                  {adminAuthError && (
                    <p className="text-[10px] text-rose-500 font-bold text-center">
                      ⚠️ {adminAuthError}
                    </p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAdminForm(false)}
                      className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!adminUsername.trim() || !adminPassword.trim()}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-2xs disabled:opacity-50"
                    >
                      Masuk Panel Admin
                    </button>
                  </div>
                </form>
              ) : verifyingProfile ? (
                /* PIN Verification Prompt */
                <form onSubmit={handleVerifyPinSubmit} className="space-y-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100 animate-fade-in">
                  <div className="text-center space-y-1">
                    <h4 className="text-xs font-black text-purple-900">Verifikasi PIN Akun</h4>
                    <p className="text-[11px] text-slate-600">Masukkan PIN 6-digit untuk <strong>{verifyingProfile.name}</strong> (@{verifyingProfile.username || verifyingProfile.name}):</p>
                  </div>

                  <div>
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="PIN 6 Digit"
                      value={inputPin}
                      onChange={(e) => setInputPin(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-purple-200 text-xs text-center font-black tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white shadow-2xs"
                      autoFocus
                    />
                    {pinError && (
                      <p className="text-[10px] text-rose-500 font-bold text-center mt-1.5">
                        PIN Salah! Hubungi Admin jika lupa PIN.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setVerifyingProfile(null)}
                      className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!inputPin.trim()}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-2xs disabled:opacity-50"
                    >
                      Masuk Akun
                    </button>
                  </div>
                </form>
              ) : !showAddForm ? (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Pilih atau buat profil baru dengan Nama Lengkap &amp; Username Unik:
                  </p>

                  {profiles.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-center space-y-1">
                      <p className="text-xs font-bold text-rose-800">Belum Ada Profil Terdaftar</p>
                      <p className="text-[11px] text-slate-500">Klik tombol di bawah untuk membuat profil baru.</p>
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-0.5">
                      {profiles.map((p) => {
                        const displayUsername = p.username || p.name.toLowerCase().replace(/\s+/g, '_');
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProfile(p)}
                            className="w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] bg-rose-500 text-white">
                                {p.name.charAt(0).toUpperCase()}
                              </span>
                              <div>
                                <div className="font-extrabold">{p.name}</div>
                                <div className="text-[9px] text-slate-400">
                                  @{displayUsername} • {p.age} Th • 🔒 PIN
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-black shadow-2xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>+ Buat / Login Profil Siswi</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowAdminForm(true);
                        setAdminAuthError(null);
                      }}
                      className="w-full py-2 px-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>🔐 Mode Admin</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Add / Login Form */
                <form onSubmit={handleSaveOrLoginProfile} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Nama Lengkap Siswi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="cth: Dinara Amalia"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-rose-500 bg-slate-50 shadow-2xs"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Username / NISN Unik Siswi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      placeholder="cth: dinara123 / zalfa_01"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-rose-500 bg-slate-50 shadow-2xs"
                    />
                    <p className="text-[9px] text-slate-400">Username mencegah data duplikat dengan siswi lain.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Usia Siswi
                    </label>
                    <select
                      value={newAge}
                      onChange={(e) => setNewAge(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500 bg-slate-50 shadow-2xs"
                    >
                      {[14, 15, 16, 17, 18, 19].map((a) => (
                        <option key={a} value={a}>{a} Tahun</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      PIN Profil 6 Digit (Privasi Kamu)
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Masukkan 6 digit PIN (cth: 123456)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold text-center tracking-widest focus:outline-none focus:border-rose-500 bg-slate-50 shadow-2xs"
                    />
                    <p className="text-[9px] text-slate-400">PIN 6 digit bersifat rahasia (disamarkan).</p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!fullName.trim() && !newUsername.trim()}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-2xs disabled:opacity-50"
                    >
                      Simpan &amp; Pakai
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
