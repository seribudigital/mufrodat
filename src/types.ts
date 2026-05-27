export interface MufrodatItem {
  no: number;
  arab: string;
  indonesia: string;
  dars: number;
  kategori_1: string;
  kategori_2: string;
  unit?: string;
  unitDescription?: string;
}

export interface QuizQuestion {
  item: MufrodatItem;
  options: string[]; // 2 or 4 options in Indonesian
}

export interface WrongAnswer {
  arab: string;
  indonesia: string;     // jawaban benar
  userAnswer: string;     // jawaban yang dipilih siswa (kosong jika waktu habis)
}

export type PhaseType = 'materi' | 'latihan' | 'ujian' | 'flashcard' | null;

export type KitabType = 'dl' | 'aby' | 'quran';

export interface HistoryEntry {
  id: string;
  date: string; // ISO string
  kitab?: KitabType;
  jilid?: number;
  level: number;
  score: number;
  correct: number;
  wrong: number;
}

export interface UserIdentity {
  name: string;
  studentClass: string;
}

export interface StreakData {
  count: number;
  lastDate: string; // "YYYY-MM-DD"
}

export interface MasteryStats {
  mastered: number;
  total: number;
}
