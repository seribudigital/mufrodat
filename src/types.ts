export interface MufrodatItem {
  no: number;
  arab: string;
  indonesia: string;
  dars: number;
  kategori_1: string;
  kategori_2: string;
}

export interface QuizQuestion {
  item: MufrodatItem;
  options: string[]; // 2 or 4 options in Indonesian
}

export type PhaseType = 'materi' | 'latihan' | 'ujian' | null;

export interface HistoryEntry {
  id: string;
  date: string; // ISO string
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
