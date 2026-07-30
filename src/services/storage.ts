import { SimpleResult, CBTJournalEntry, ModuleProgress, UserProfile } from '../types';

const STORAGE_KEYS = {
  RESULTS: 'rise_simple_results',
  JOURNALS: 'rise_simple_journals',
  MODULE_PROGRESS: 'rise_simple_module_progress',
  PROFILES: 'temansulung_user_profiles',
  ACTIVE_USER: 'temansulung_active_user',
  CHAT_MESSAGES_PREFIX: 'temansulung_chat_messages_',
};

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

// --- PROFILES MANAGEMENT ---
export const getUserProfiles = (): UserProfile[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
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
  } catch (e) {
    console.warn(e);
  }
};

export const saveUserProfile = (name: string, age: number): UserProfile => {
  const current = getUserProfiles();
  const existing = current.find((p) => p.name.toLowerCase() === name.toLowerCase());

  if (existing) {
    const updatedProfile = { ...existing, age };
    const updatedList = current.map((p) => (p.id === existing.id ? updatedProfile : p));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updatedList));
    setActiveUserProfile(updatedProfile);
    return updatedProfile;
  }

  const newProfile: UserProfile = {
    id: `usr_${Date.now()}`,
    name,
    age,
  };

  const updatedList = [newProfile, ...current];
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updatedList));
  setActiveUserProfile(newProfile);
  return newProfile;
};

export const deleteUserProfile = (profileId: string): UserProfile[] => {
  const current = getUserProfiles();
  const profileToDelete = current.find((p) => p.id === profileId);
  const updatedList = current.filter((p) => p.id !== profileId);
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updatedList));

  // If deleted profile was active user, switch to next or null
  const active = getActiveUserProfile();
  if (active && active.id === profileId) {
    const nextActive = updatedList.length > 0 ? updatedList[0] : null;
    setActiveUserProfile(nextActive);
  }

  // Also clean up stored chat messages for that deleted profile
  if (profileToDelete) {
    const chatKey = `${STORAGE_KEYS.CHAT_MESSAGES_PREFIX}${profileToDelete.name.toLowerCase()}`;
    localStorage.removeItem(chatKey);
  }

  return updatedList;
};

// --- TEST RESULTS ---
export const getSavedResults = (filterName?: string): SimpleResult[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
    const allResults: SimpleResult[] = data ? JSON.parse(data) : [];
    if (filterName) {
      return allResults.filter(
        (r) => r.studentName.toLowerCase() === filterName.toLowerCase()
      );
    }
    return allResults;
  } catch {
    return [];
  }
};

export const saveSimpleResult = (res: SimpleResult): SimpleResult[] => {
  // Automatically create/set active user profile
  saveUserProfile(res.studentName, res.studentAge);

  const current = getSavedResults();
  const updated = [res, ...current];
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));
  return updated;
};

// --- JOURNALS ---
export const getSavedJournals = (filterName?: string): CBTJournalEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    const allJournals: CBTJournalEntry[] = data ? JSON.parse(data) : [];
    if (filterName) {
      return allJournals.filter(
        (j) => j.studentName && j.studentName.toLowerCase() === filterName.toLowerCase()
      );
    }
    return allJournals;
  } catch {
    return [];
  }
};

export const saveJournalEntry = (entry: CBTJournalEntry): CBTJournalEntry[] => {
  const activeUser = getActiveUserProfile();
  const entryWithUser = {
    ...entry,
    studentName: activeUser ? activeUser.name : 'Profil',
  };

  const current = getSavedJournals();
  const updated = [entryWithUser, ...current];
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
  return updated;
};

// --- MODULE PROGRESS ---
export const getModuleProgress = (): ModuleProgress => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MODULE_PROGRESS);
    return data
      ? JSON.parse(data)
      : { module1: false, module2: false, module3: false, module4: false };
  } catch {
    return { module1: false, module2: false, module3: false, module4: false };
  }
};

export const updateModuleProgress = (partial: Partial<ModuleProgress>): ModuleProgress => {
  const current = getModuleProgress();
  const updated = { ...current, ...partial };
  localStorage.setItem(STORAGE_KEYS.MODULE_PROGRESS, JSON.stringify(updated));
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
    ? `Peue haba ${activeUser.name} Kakak Sulung 🌸! Aku Si Jeumpa, maskot pendampingmu di TemanSulung. Ada hal yang ingin kamu curhatkan hari ini?`
    : 'Peue haba Kakak Sulung 🌸! Aku Si Jeumpa, maskot pendampingmu di TemanSulung. Ada hal yang ingin kamu curhatkan hari ini?';

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
