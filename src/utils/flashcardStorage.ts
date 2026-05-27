import type { KitabType } from '../types';

function getKey(kitab: KitabType, jilid: number, level: number): string {
  if (kitab === 'quran') {
    const juz = (jilid - 1) * 10 + level;
    return `mufrodat_flashcard_quran_juz${juz}`;
  }
  return `mufrodat_flashcard_${kitab}_${jilid}_level${level}`;
}

/** Get all words marked as "Belum Hafal" for a specific level */
export function getUnmemorized(kitab: KitabType, jilid: number, level: number): string[] {
  const raw = localStorage.getItem(getKey(kitab, jilid, level));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** Add a word to the "Belum Hafal" list */
export function markUnmemorized(kitab: KitabType, jilid: number, level: number, arabWord: string): void {
  const current = getUnmemorized(kitab, jilid, level);
  if (!current.includes(arabWord)) {
    current.push(arabWord);
    localStorage.setItem(getKey(kitab, jilid, level), JSON.stringify(current));
  }
}

/** Remove a word from the "Belum Hafal" list (mark as memorized) */
export function markMemorized(kitab: KitabType, jilid: number, level: number, arabWord: string): void {
  const current = getUnmemorized(kitab, jilid, level);
  const filtered = current.filter(w => w !== arabWord);
  localStorage.setItem(getKey(kitab, jilid, level), JSON.stringify(filtered));
}
