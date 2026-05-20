import type { MufrodatItem, QuizQuestion } from '../types';

// Dynamically import all part JSON files from the assets folder.
const modules = import.meta.glob<{ default: MufrodatItem[] }>('../assets/data/jilid*/*.json');

export const loadLevelDataset = async (jilid: number, level: number): Promise<MufrodatItem[]> => {
  let allData: MufrodatItem[] = [];
  
  const levelMapJilid1: Record<number, string[]> = {
    1: ['part1.json', 'part2.json'],
    2: ['part1.json', 'part2.json', 'part3.json', 'part4.json'],
    3: ['part1.json', 'part2.json', 'part3.json', 'part4.json', 'part5.json', 'part6.json'],
    4: ['part1.json', 'part2.json', 'part3.json', 'part4.json', 'part5.json', 'part6.json', 'part7.json', 'part8.json'],
  };

  const levelMapJilid2: Record<number, string[]> = {
    1: ['part1.json', 'part2.json'],
    2: ['part3.json', 'part4.json'],
    3: ['part5.json', 'part6.json'],
    4: ['part7.json', 'part8.json'],
  };

  const levelMap = jilid === 2 ? levelMapJilid2 : levelMapJilid1;
  const allowedParts = levelMap[level] || levelMap[4];

  for (const path in modules) {
    const isTargetJilid = path.includes(`/jilid${jilid}/`);
    const fileName = path.split('/').pop() || '';
    if (isTargetJilid && allowedParts.includes(fileName)) {
      const mod = await modules[path]();
      allData = allData.concat(mod.default);
    }
  }
  
  return allData;
};

// Helper to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate options for a given dataset, selecting 3 distractors
export const generateQuestions = (dataset: MufrodatItem[], optionsCount: number = 4): QuizQuestion[] => {
  // Shuffle the list to randomize question order (crucial for Level 4)
  const randomizedDataset = shuffleArray(dataset);

  return randomizedDataset.map(item => {
    // Distractors from the same kategori_1 if possible
    let distractorsPool = dataset.filter(
      d => d.kategori_1 === item.kategori_1 && d.indonesia !== item.indonesia
    );

    // If not enough distractors in the same category, use random distractors from the whole dataset
    if (distractorsPool.length < optionsCount - 1) {
      const extraPool = dataset.filter(d => d.indonesia !== item.indonesia);
      distractorsPool = [...distractorsPool, ...extraPool];
    }

    // Unique options only
    distractorsPool = distractorsPool.filter((v, i, a) => a.findIndex(t => t.indonesia === v.indonesia) === i);

    distractorsPool = shuffleArray(distractorsPool);
    const selectedDistractors = distractorsPool.slice(0, optionsCount - 1).map(d => d.indonesia);

    const options = shuffleArray([item.indonesia, ...selectedDistractors]);

    return {
      item,
      options,
    };
  });
};
