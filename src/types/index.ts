export interface UserProfile {
  id: string;
  name: string; // Nama Lengkap Siswi
  username?: string; // Username / NISN Unik Siswi
  age: number;
  pin?: string; // 4-digit PIN
}

export interface SimpleResult {
  id: string;
  date: string;
  testType?: 'pre' | 'post'; // 'pre' = Tes Awal, 'post' = Post-Test
  studentName: string;
  studentUsername?: string;
  studentAge: number;
  domesticHours: number;
  siblingCount: number;
  confidenceScore: number;
  controlScore: number;
  composureScore: number;
  commitmentScore: number;
  score: number; // Overall Resilience Score (0-100)
  statusText: string;
  statusBadge: string;
  summary: string;
  primaryStressors: string[];
  tips: string[];
}

export interface CBTJournalEntry {
  id: string;
  date: string;
  studentName?: string;
  curhatan: string;
  saranPositif: string;
}

export interface ModuleProgress {
  module1: boolean;
  module2: boolean;
  module3: boolean;
  module4: boolean;
}
