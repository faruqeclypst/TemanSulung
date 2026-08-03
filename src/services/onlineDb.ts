import { UserProfile, SimpleResult, CBTJournalEntry, ModuleProgress } from '../types';

const DEFAULT_FIREBASE_URL = 'https://flash-mosa-default-rtdb.asia-southeast1.firebasedatabase.app';

const getDbUrl = (): string => {
  const envUrl = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const baseUrl = envUrl || DEFAULT_FIREBASE_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

export const onlineDb = {
  // Check connection status
  async checkConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${getDbUrl()}/.json?shallow=true`, { method: 'GET' });
      return res.ok;
    } catch (err) {
      console.warn('Firebase DB connection check failed:', err);
      return false;
    }
  },

  // --- PROFILES ONLINE ---
  async fetchProfiles(): Promise<UserProfile[]> {
    try {
      const res = await fetch(`${getDbUrl()}/profiles.json`);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data) return [];
      
      // Convert object map to array
      if (typeof data === 'object') {
        return Object.values(data) as UserProfile[];
      }
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Error fetching online profiles:', err);
      return [];
    }
  },

  async saveProfile(profile: UserProfile): Promise<boolean> {
    try {
      const res = await fetch(`${getDbUrl()}/profiles/${profile.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      return res.ok;
    } catch (err) {
      console.warn('Error saving profile online:', err);
      return false;
    }
  },

  async deleteProfile(profileId: string): Promise<boolean> {
    try {
      const res = await fetch(`${getDbUrl()}/profiles/${profileId}.json`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.warn('Error deleting profile online:', err);
      return false;
    }
  },

  // --- TEST RESULTS ONLINE ---
  async fetchResults(): Promise<SimpleResult[]> {
    try {
      const res = await fetch(`${getDbUrl()}/results.json`);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data) return [];

      if (typeof data === 'object') {
        return Object.values(data) as SimpleResult[];
      }
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Error fetching online results:', err);
      return [];
    }
  },

  async saveResult(result: SimpleResult): Promise<boolean> {
    try {
      const res = await fetch(`${getDbUrl()}/results.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      return res.ok;
    } catch (err) {
      console.warn('Error saving result online:', err);
      return false;
    }
  },

  // --- CBT JOURNALS ONLINE ---
  async fetchJournals(): Promise<CBTJournalEntry[]> {
    try {
      const res = await fetch(`${getDbUrl()}/journals.json`);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data) return [];

      if (typeof data === 'object') {
        return Object.values(data) as CBTJournalEntry[];
      }
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Error fetching online journals:', err);
      return [];
    }
  },

  async saveJournal(entry: CBTJournalEntry): Promise<boolean> {
    try {
      const res = await fetch(`${getDbUrl()}/journals.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      return res.ok;
    } catch (err) {
      console.warn('Error saving journal online:', err);
      return false;
    }
  },

  // --- MODULE PROGRESS ONLINE ---
  async fetchAllModuleProgress(): Promise<Record<string, ModuleProgress>> {
    try {
      const res = await fetch(`${getDbUrl()}/module_progress.json`);
      if (!res.ok) return {};
      const data = await res.json();
      return data || {};
    } catch (err) {
      console.warn('Error fetching all module progress online:', err);
      return {};
    }
  },

  async fetchModuleProgress(profileId: string): Promise<ModuleProgress | null> {
    try {
      const res = await fetch(`${getDbUrl()}/module_progress/${profileId}.json`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Error fetching module progress online:', err);
      return null;
    }
  },

  async saveModuleProgress(profileId: string, progress: ModuleProgress): Promise<boolean> {
    try {
      const res = await fetch(`${getDbUrl()}/module_progress/${profileId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress),
      });
      return res.ok;
    } catch (err) {
      console.warn('Error saving module progress online:', err);
      return false;
    }
  },

  async clearAllData(): Promise<boolean> {
    try {
      const res = await fetch(`${getDbUrl()}/.json`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.warn('Error clearing online database:', err);
      return false;
    }
  },
};
