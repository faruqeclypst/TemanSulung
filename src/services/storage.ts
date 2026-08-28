import { SimpleResult, CBTJournalEntry, ModuleProgress, UserProfile } from '../types';
import { onlineDb } from './onlineDb';

const STORAGE_KEYS = {
  ACTIVE_USER: 'rise_active_user',
  CHAT_MESSAGES_PREFIX: 'rise_chat_messages_',
};

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

// Background sync on load & on demand
export const syncWithOnlineDb = async (): Promise<void> => {
  try {
    const isOnline = await onlineDb.checkConnection();
    if (!isOnline) return;

    const remoteProfiles = await onlineDb.fetchProfiles();

    // If active user is no longer in online profiles (and not admin), clear active session
    const active = getActiveUserProfile();
    if (active && active.id !== 'admin_bk' && active.username !== 'admin') {
      const stillExists = remoteProfiles.some(
        (p) => p.id === active.id || (p.username && p.username.toLowerCase() === (active.username || '').toLowerCase())
      );
      if (!stillExists) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
      }
    }

    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn('Sync with online database skipped:', err);
  }
};

// Fire sync on startup
syncWithOnlineDb();

// --- PROFILES DIRECT MANAGEMENT ---
export const getUserProfiles = async (): Promise<UserProfile[]> => {
  return await onlineDb.fetchProfiles();
};

export const getActiveUserProfile = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setActiveUserProfile = (profile: UserProfile | null): void => {
  try {
    if (!profile) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(profile));
    }
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn(e);
  }
};

export const saveUserProfile = async (name: string, age: number, pin?: string, username?: string): Promise<UserProfile> => {
  const current = await onlineDb.fetchProfiles();
  const cleanName = name.trim();
  const cleanUsername = (username || cleanName).toLowerCase().replace(/\s+/g, '_');

  const existing = current.find((p) =>
    (p.username && p.username.toLowerCase() === cleanUsername) ||
    p.name.toLowerCase() === cleanName.toLowerCase()
  );

  let updatedProfile: UserProfile;
  const pinToUse = pin || existing?.pin || '1234';

  if (existing) {
    updatedProfile = { ...existing, name: cleanName, username: cleanUsername, age, pin: pinToUse };
  } else {
    updatedProfile = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      username: cleanUsername,
      age,
      pin: pinToUse,
    };
  }

  await onlineDb.saveProfile(updatedProfile);
  setActiveUserProfile(updatedProfile);
  return updatedProfile;
};

export const resetStudentPin = async (profileId: string, newPin: string): Promise<UserProfile[]> => {
  const current = await onlineDb.fetchProfiles();
  const existing = current.find((p) => p.id === profileId);
  if (!existing) return current;

  const updatedProfile = { ...existing, pin: newPin };
  await onlineDb.saveProfile(updatedProfile);

  const active = getActiveUserProfile();
  if (active && active.id === profileId) {
    setActiveUserProfile(updatedProfile);
  }

  return await onlineDb.fetchProfiles();
};

export const fetchOnlineProfilesList = async (): Promise<UserProfile[]> => {
  return await onlineDb.fetchProfiles();
};

export const deleteUserProfile = async (profileId: string): Promise<UserProfile[]> => {
  const active = getActiveUserProfile();
  if (active && active.id === profileId) {
    setActiveUserProfile(null);
  }

  await onlineDb.deleteProfile(profileId);
  window.dispatchEvent(new Event('storage'));
  return await onlineDb.fetchProfiles();
};

// --- TEST RESULTS DIRECT MANAGEMENT ---
export const getSavedResults = async (filterName?: string): Promise<SimpleResult[]> => {
  const allResults = await onlineDb.fetchResults();
  if (filterName) {
    return allResults.filter(
      (r) => r.studentName.toLowerCase() === filterName.toLowerCase()
    );
  }
  return allResults;
};

export const getStudentLatestPreTest = async (studentNameOrUsername?: string): Promise<SimpleResult | null> => {
  if (!studentNameOrUsername) return null;
  const results = await getSavedResults(studentNameOrUsername);
  const preTests = results.filter((r) => r.testType === 'pre' || !r.testType);
  return preTests.length > 0 ? preTests[0] : null;
};

export const getStudentLatestPostTest = async (studentNameOrUsername?: string): Promise<SimpleResult | null> => {
  if (!studentNameOrUsername) return null;
  const results = await getSavedResults(studentNameOrUsername);
  const postTests = results.filter((r) => r.testType === 'post');
  return postTests.length > 0 ? postTests[0] : null;
};

export const saveSimpleResult = async (res: SimpleResult): Promise<boolean> => {
  const resToSave: SimpleResult = {
    ...res,
    id: res.id || `res_${Date.now()}`,
    testType: res.testType || 'pre'
  };

  return await onlineDb.saveResult(resToSave);
};

// --- JOURNALS DIRECT MANAGEMENT ---
export const getSavedJournals = async (filterName?: string): Promise<CBTJournalEntry[]> => {
  const allJournals = await onlineDb.fetchJournals();
  if (filterName) {
    return allJournals.filter(
      (j) => j.studentName && j.studentName.toLowerCase() === filterName.toLowerCase()
    );
  }
  return allJournals;
};

export const saveJournalEntry = async (entry: CBTJournalEntry): Promise<boolean> => {
  const activeUser = getActiveUserProfile();
  const entryWithUser: CBTJournalEntry = {
    ...entry,
    id: entry.id || `jnl_${Date.now()}`,
    studentName: activeUser ? activeUser.name : 'Profil',
  };

  return await onlineDb.saveJournal(entryWithUser);
};

// --- MODULE PROGRESS DIRECT MANAGEMENT ---
export const getModuleProgress = async (profileId?: string): Promise<ModuleProgress> => {
  const activeUser = getActiveUserProfile();
  const idToUse = profileId || activeUser?.id;
  if (!idToUse) {
    return { module1: false, module2: false, module3: false, module4: false };
  }
  const prog = await onlineDb.fetchModuleProgress(idToUse);
  return prog || { module1: false, module2: false, module3: false, module4: false };
};

export const updateModuleProgress = async (partial: Partial<ModuleProgress>): Promise<ModuleProgress> => {
  const activeUser = getActiveUserProfile();
  if (!activeUser) {
    return { module1: false, module2: false, module3: false, module4: false };
  }
  const current = await getModuleProgress(activeUser.id);
  const updated = { ...current, ...partial };
  await onlineDb.saveModuleProgress(activeUser.id, updated);
  return updated;
};

// --- CHAT MESSAGES PER USER ---
export const getSavedChatMessages = (profileName?: string): ChatMessage[] => {
  const activeUser = getActiveUserProfile();
  const nameToUse = profileName || (activeUser ? activeUser.name : 'default');
  const key = `${STORAGE_KEYS.CHAT_MESSAGES_PREFIX}${nameToUse.toLowerCase()}`;

  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn(e);
  }

  const welcomeText = activeUser
    ? `Peue haba ${activeUser.name} Kakak Sulung 🌸! Aku Si Jeumpa, maskot pendampingmu di aplikasi RISE. Ada hal yang ingin kamu curhatkan hari ini?`
    : 'Peue haba Kakak Sulung 🌸! Aku Si Jeumpa, maskot pendampingmu di aplikasi RISE. Ada hal yang ingin kamu curhatkan hari ini?';

  return [
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: welcomeText,
    },
  ];
};

export const saveChatMessages = (msgs: ChatMessage[], profileName?: string): ChatMessage[] => {
  const activeUser = getActiveUserProfile();
  const nameToUse = profileName || (activeUser ? activeUser.name : 'default');
  const key = `${STORAGE_KEYS.CHAT_MESSAGES_PREFIX}${nameToUse.toLowerCase()}`;

  try {
    localStorage.setItem(key, JSON.stringify(msgs));
  } catch (e) {
    console.warn(e);
  }
  return msgs;
};

// --- CLEAR ALL DATA DIRECTLY ---
export const clearAllStorageData = async (): Promise<void> => {
  localStorage.clear();
  await onlineDb.clearAllData();
  window.dispatchEvent(new Event('storage'));
};
