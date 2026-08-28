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
      
      // Convert object map to array and filter out nulls/falsy
      if (typeof data === 'object') {
        return Object.values(data).filter(Boolean) as UserProfile[];
      }
      return Array.isArray(data) ? data.filter(Boolean) : [];
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
      // Also clean up module progress online
      await fetch(`${getDbUrl()}/module_progress/${profileId}.json`, {
        method: 'DELETE',
      }).catch(() => {});
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
        return Object.values(data).filter(Boolean) as SimpleResult[];
      }
      return Array.isArray(data) ? data.filter(Boolean) : [];
    } catch (err) {
      console.warn('Error fetching online results:', err);
      return [];
    }
  },

  async saveResult(result: SimpleResult): Promise<boolean> {
    try {
      const resultId = result.id || `res_${Date.now()}`;
      const payload = { ...result, id: resultId };
      const res = await fetch(`${getDbUrl()}/results/${resultId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (err) {
      console.warn('Error saving result online:', err);
      return false;
    }
  },

  async deleteResult(resultId: string): Promise<boolean> {
    try {
      const res = await fetch(`${getDbUrl()}/results/${resultId}.json`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.warn('Error deleting result online:', err);
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
        return Object.values(data).filter(Boolean) as CBTJournalEntry[];
      }
      return Array.isArray(data) ? data.filter(Boolean) : [];
    } catch (err) {
      console.warn('Error fetching online journals:', err);
      return [];
    }
  },

  async saveJournal(entry: CBTJournalEntry): Promise<boolean> {
    try {
      const journalId = entry.id || `jnl_${Date.now()}`;
      const payload = { ...entry, id: journalId };
      const res = await fetch(`${getDbUrl()}/journals/${journalId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (err) {
      console.warn('Error saving journal online:', err);
      return false;
    }
  },

  async deleteJournal(journalId: string): Promise<boolean> {
    try {
      const res = await fetch(`${getDbUrl()}/journals/${journalId}.json`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.warn('Error deleting journal online:', err);
      return false;
    }
  },

  // --- MODULE PROGRESS ONLINE ---
  async fetchAllModuleProgress(): Promise<Record<string, ModuleProgress>> {
    try {
      const res = await fetch(`${getDbUrl()}/module_progress.json`);
      if (!res.ok) return {};
      const data = await res.json();
      return (data && typeof data === 'object') ? data : {};
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

  // --- CLEAR / RESET ALL DATABASE ONLINE ---
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
