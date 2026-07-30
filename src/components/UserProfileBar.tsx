import React, { useState, useEffect } from 'react';
import { IconUser, IconCheckCircle, IconTrash } from './CustomIcons';
import { 
  getActiveUserProfile, 
  getUserProfiles, 
  setActiveUserProfile, 
  saveUserProfile, 
  deleteUserProfile 
} from '../services/storage';
import { UserProfile } from '../types';

interface UserProfileBarProps {
  onProfileChanged?: (profile: UserProfile | null) => void;
}

export const UserProfileBar: React.FC<UserProfileBarProps> = ({ onProfileChanged }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // New Profile Form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newAge, setNewAge] = useState<number>(16);

  useEffect(() => {
    refreshProfiles();
  }, []);

  const refreshProfiles = () => {
    const list = getUserProfiles();
    const active = getActiveUserProfile();
    setProfiles(list);
    setActiveUser(active);
  };

  const handleSelectProfile = (p: UserProfile) => {
    setActiveUserProfile(p);
    setActiveUser(p);
    setIsOpen(false);
    if (onProfileChanged) onProfileChanged(p);
  };

  const handleDeleteProfile = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    const remaining = deleteUserProfile(profileId);
    const active = getActiveUserProfile();
    setProfiles(remaining);
    setActiveUser(active);
    if (onProfileChanged) onProfileChanged(active);
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const p = saveUserProfile(newName.trim(), newAge);
    refreshProfiles();
    setShowAddForm(false);
    setNewName('');
    setIsOpen(false);
    if (onProfileChanged) onProfileChanged(p);
  };

  return (
    <div className="relative z-50">
      {/* Active User Badge Button - Clean Short Label "Profil" & White Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-extrabold transition-all shadow-2xs"
      >
        <div className="w-5.5 h-5.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black shadow-2xs flex-shrink-0">
          {activeUser ? (
            activeUser.name.charAt(0).toUpperCase()
          ) : (
            <IconUser className="w-3 h-3 text-white" />
          )}
        </div>
        <span>{activeUser ? `${activeUser.name} (${activeUser.age}Th)` : 'Profil'}</span>
        <span className="text-[10px] text-rose-400">▼</span>
      </button>

      {/* Profile Switcher Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl border border-rose-200 shadow-2xl z-[100] p-4 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
              <IconUser className="w-4 h-4 text-rose-500" />
              <span>Ganti Profil</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 font-bold text-xs"
            >
              ✕
            </button>
          </div>

          {!showAddForm ? (
            <div className="space-y-2">
              {profiles.length === 0 ? (
                <p className="text-[11px] text-slate-500 font-medium italic text-center py-2">
                  Belum ada profil tersimpan. Mulai tes atau tambah di bawah!
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1.5 no-scrollbar">
                  {profiles.map((p) => {
                    const isSelected = activeUser?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProfile(p)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${
                            isSelected ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
                          }`}>
                            {p.name.charAt(0).toUpperCase()}
                          </span>
                          <span>{p.name} ({p.age} Tahun)</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isSelected && <IconCheckCircle className="w-4 h-4 text-white" />}
                          <button
                            onClick={(e) => handleDeleteProfile(e, p.id)}
                            title="Hapus Profil"
                            className={`p-1.5 rounded-xl transition-colors ${
                              isSelected
                                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                : 'bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-600'
                            }`}
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-2.5 px-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-extrabold transition-all flex items-center justify-center gap-1"
              >
                <span>+ Tambah Profil Baru</span>
              </button>
            </div>
          ) : (
            /* Add Profile Form */
            <form onSubmit={handleAddProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Nama Profil
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Misal: Dinara / Zalfa"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500 bg-slate-50"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Usia
                </label>
                <select
                  value={newAge}
                  onChange={(e) => setNewAge(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-rose-500 bg-slate-50"
                >
                  {[14, 15, 16, 17, 18, 19].map((a) => (
                    <option key={a} value={a}>{a} Tahun</option>
                  ))}
                </select>
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
                  disabled={!newName.trim()}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-2xs disabled:opacity-50"
                >
                  Simpan &amp; Pakai
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
