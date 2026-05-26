import type { KitabType, StreakData, MasteryStats } from '../types';

// Total kosakata per kitab/jilid — hardcoded from dataset analysis
const TOTAL_VOCAB: Record<string, number> = {
  'dl_1': 467,
  'dl_2': 1208,
  'aby_1': 305,
  'aby_2': 483,
  'aby_3': 371,
  'aby_4': 428,
};

const STREAK_KEY = 'mufrodat_streak';

function getMasteryKey(kitab: KitabType, jilid: number): string {
  return `mufrodat_mastery_${kitab}_${jilid}`;
}

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Check if dateB is exactly 1 calendar day after dateA (YYYY-MM-DD strings) */
function isNextDay(dateA: string, dateB: string): boolean {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  const diffMs = b.getTime() - a.getTime();
  return diffMs === 86400000; // exactly 24h in ms
}

// ──── STREAK ────

export function getStreak(): StreakData {
  const raw = localStorage.getItem(STREAK_KEY);
  if (!raw) return { count: 0, lastDate: '' };

  try {
    const data: StreakData = JSON.parse(raw);
    const today = getTodayStr();

    if (data.lastDate === today) {
      // Already studied today — streak is current
      return data;
    }

    if (isNextDay(data.lastDate, today)) {
      // Yesterday was the last study day — streak is still alive but not yet incremented
      return data;
    }

    // More than 1 day gap — streak is broken
    return { count: 0, lastDate: '' };
  } catch {
    return { count: 0, lastDate: '' };
  }
}

/**
 * Called after a quiz (Latihan or Ujian) is completed.
 * Updates the daily streak and (for Ujian) records mastered words.
 */
export function recordQuizCompletion(
  kitab: KitabType,
  jilid: number,
  _level: number,
  correctArabWords: string[],
  isUjian: boolean
): void {
  // ── Update streak ──
  const today = getTodayStr();
  const current = getStreak();

  let newCount: number;

  if (current.lastDate === today) {
    // Already studied today — don't increment again
    newCount = current.count;
  } else if (current.lastDate === '' || isNextDay(current.lastDate, today)) {
    // New streak or consecutive day
    newCount = current.count + 1;
  } else {
    // Streak broken — start fresh
    newCount = 1;
  }

  const newStreak: StreakData = { count: newCount, lastDate: today };
  localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));

  // ── Update mastery (only for Ujian) ──
  if (isUjian && correctArabWords.length > 0) {
    const key = getMasteryKey(kitab, jilid);
    const raw = localStorage.getItem(key);
    let mastered: string[] = [];
    if (raw) {
      try { mastered = JSON.parse(raw); } catch { mastered = []; }
    }

    const set = new Set(mastered);
    for (const word of correctArabWords) {
      set.add(word);
    }

    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  }
}

// ──── MASTERY STATS ────

export function getMasteryStats(kitab: KitabType, jilid: number): MasteryStats {
  const key = getMasteryKey(kitab, jilid);
  const totalKey = `${kitab}_${jilid}`;
  const total = TOTAL_VOCAB[totalKey] || 0;

  const raw = localStorage.getItem(key);
  if (!raw) return { mastered: 0, total };

  try {
    const mastered: string[] = JSON.parse(raw);
    return { mastered: mastered.length, total };
  } catch {
    return { mastered: 0, total };
  }
}

export function getTotalMasteryStats(): MasteryStats {
  let totalMastered = 0;
  let totalVocab = 0;

  for (const [key, total] of Object.entries(TOTAL_VOCAB)) {
    totalVocab += total;
    const [kitab, jilidStr] = key.split('_');
    const raw = localStorage.getItem(getMasteryKey(kitab as KitabType, parseInt(jilidStr)));
    if (raw) {
      try {
        const mastered: string[] = JSON.parse(raw);
        totalMastered += mastered.length;
      } catch { /* skip */ }
    }
  }

  return { mastered: totalMastered, total: totalVocab };
}

/** Check if user has completed any quiz today */
export function hasStudiedToday(): boolean {
  const streak = getStreak();
  return streak.lastDate === getTodayStr();
}
