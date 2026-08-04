import { SimpleResult, CBTJournalEntry, ModuleProgress, UserProfile } from '../types';
import { onlineDb } from './onlineDb';

const STORAGE_KEYS = {
  RESULTS: 'rise_simple_results',
  JOURNALS: 'rise_simple_journals',
  MODULE_PROGRESS: 'rise_simple_module_progress',
  PROFILES: 'rise_user_profiles',
  ACTIVE_USER: 'rise_active_user',
  CHAT_MESSAGES_PREFIX: 'rise_chat_messages_',
};

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

// Background sync on load
export const syncWithOnlineDb = async (): Promise<void> => {
  try {
    const isOnline = await onlineDb.checkConnection();
    if (!isOnline) return;

    // Sync profiles
    const remoteProfiles = await onlineDb.fetchProfiles();
    const localProfiles = getUserProfiles();
    
    // Merge unique profiles by id or name
    const mergedProfiles = [...remoteProfiles];
    for (const localP of localProfiles) {
      if (!mergedProfiles.some(p => p.id === localP.id || p.name.toLowerCase() === localP.name.toLowerCase())) {
        mergedProfiles.push(localP);
        // Upload local profile to online DB
        await onlineDb.saveProfile(localP);
      }
    }
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(mergedProfiles));

    // Sync results
    const remoteResults = await onlineDb.fetchResults();
    const localResults = getSavedResults();
    const mergedResults = [...remoteResults];
    for (const localR of localResults) {
      if (!mergedResults.some(r => r.date === localR.date && r.studentName.toLowerCase() === localR.studentName.toLowerCase())) {
        mergedResults.push(localR);
        await onlineDb.saveResult(localR);
      }
    }
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(mergedResults));

    // Sync journals
    const remoteJournals = await onlineDb.fetchJournals();
    const localJournals = getSavedJournals();
    const mergedJournals = [...remoteJournals];
    for (const localJ of localJournals) {
      if (!mergedJournals.some(j => j.id === localJ.id)) {
        mergedJournals.push(localJ);
        await onlineDb.saveJournal(localJ);
      }
    }
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(mergedJournals));

  } catch (err) {
    console.warn('Sync with online database skipped:', err);
  }
};

// Fire sync asynchronously
syncWithOnlineDb();

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

export const saveUserProfile = (name: string, age: number, pin?: string, username?: string): UserProfile => {
  const current = getUserProfiles();
  const cleanName = name.trim();
  const cleanUsername = (username || cleanName).toLowerCase().replace(/\s+/g, '_');

  const existing = current.find((p) =>
    (p.username && p.username.toLowerCase() === cleanUsername) ||
    p.name.toLowerCase() === cleanName.toLowerCase()
  );

  let updatedProfile: UserProfile;
  let updatedList: UserProfile[];

  const pinToUse = pin || existing?.pin || '1234';

  if (existing) {
    updatedProfile = { ...existing, name: cleanName, username: cleanUsername, age, pin: pinToUse };
    updatedList = current.map((p) => (p.id === existing.id ? updatedProfile : p));
  } else {
    updatedProfile = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      username: cleanUsername,
      age,
      pin: pinToUse,
    };
    updatedList = [updatedProfile, ...current];
  }

  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updatedList));
  setActiveUserProfile(updatedProfile);

  // Async push to Online Database (Firebase)
  onlineDb.saveProfile(updatedProfile).catch(err => console.warn('Failed async profile save to online DB', err));

  return updatedProfile;
};

export const resetStudentPin = async (profileId: string, newPin: string): Promise<UserProfile[]> => {
  const current = getUserProfiles();
  const existing = current.find((p) => p.id === profileId);
  if (!existing) return current;

  const updatedProfile = { ...existing, pin: newPin };
  const updatedList = current.map((p) => (p.id === profileId ? updatedProfile : p));

  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updatedList));
  const active = getActiveUserProfile();
  if (active && active.id === profileId) {
    setActiveUserProfile(updatedProfile);
  }

  await onlineDb.saveProfile(updatedProfile);
  return updatedList;
};

export const fetchOnlineProfilesList = async (): Promise<UserProfile[]> => {
  await syncWithOnlineDb();
  return getUserProfiles();
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

  // Clean up stored chat messages for deleted profile
  if (profileToDelete) {
    const chatKey = `${STORAGE_KEYS.CHAT_MESSAGES_PREFIX}${profileToDelete.name.toLowerCase()}`;
    localStorage.removeItem(chatKey);
    // Delete from online DB
    onlineDb.deleteProfile(profileId).catch(err => console.warn('Failed async profile delete online', err));
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

export const getStudentLatestPreTest = (studentNameOrUsername?: string): SimpleResult | null => {
  if (!studentNameOrUsername) return null;
  const results = getSavedResults(studentNameOrUsername);
  const preTests = results.filter((r) => r.testType === 'pre' || !r.testType);
  return preTests.length > 0 ? preTests[0] : null;
};

export const getStudentLatestPostTest = (studentNameOrUsername?: string): SimpleResult | null => {
  if (!studentNameOrUsername) return null;
  const results = getSavedResults(studentNameOrUsername);
  const postTests = results.filter((r) => r.testType === 'post');
  return postTests.length > 0 ? postTests[0] : null;
};

export const saveSimpleResult = (res: SimpleResult): SimpleResult[] => {
  // Automatically create/set active user profile
  saveUserProfile(res.studentName, res.studentAge);

  const resToSave: SimpleResult = {
    ...res,
    testType: res.testType || 'pre'
  };

  const current = getSavedResults();
  const updated = [resToSave, ...current];
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));

  // Async push to Online Database (Firebase)
  onlineDb.saveResult(resToSave).catch(err => console.warn('Failed async result save to online DB', err));

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

  // Async push to Online Database (Firebase)
  onlineDb.saveJournal(entryWithUser).catch(err => console.warn('Failed async journal save online', err));

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

  const activeUser = getActiveUserProfile();
  if (activeUser) {
    onlineDb.saveModuleProgress(activeUser.id, updated).catch(err => console.warn('Failed async module progress online', err));
  }

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

export const clearAllStorageData = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEYS.RESULTS);
  localStorage.removeItem(STORAGE_KEYS.JOURNALS);
  localStorage.removeItem(STORAGE_KEYS.MODULE_PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.PROFILES);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  localStorage.removeItem('temansulung_user_profiles');
  localStorage.removeItem('temansulung_active_user');
  localStorage.removeItem('temansulung_simple_results');

  await onlineDb.clearAllData();
};
