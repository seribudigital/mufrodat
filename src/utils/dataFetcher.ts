import type { MufrodatItem, QuizQuestion } from '../types';

// Dynamically import all part JSON files from the assets folder.
const modules = import.meta.glob<{ default: any }>('../assets/data/jilid*/*.json');

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

  const levelMapJilid3: Record<number, string[]> = {
    1: ['aby_jilid_1_bab_1_4.json'],
    2: ['aby_jilid_1_bab_5_8.json'],
    3: ['aby_jilid_1_bab_9_12.json'],
    4: ['aby_jilid_1_bab_13_16.json'],
  };

  let levelMap = levelMapJilid1;
  if (jilid === 2) {
    levelMap = levelMapJilid2;
  } else if (jilid === 3) {
    levelMap = levelMapJilid3;
  }

  const allowedParts = levelMap[level] || levelMap[4];

  for (const path in modules) {
    const isTargetJilid = path.includes(`/jilid${jilid}/`);
    const fileName = path.split('/').pop() || '';
    if (isTargetJilid && allowedParts.includes(fileName)) {
      const mod = await modules[path]();
      if (jilid === 3) {
        const rawData = mod.default as Record<string, Array<{ bahasa_indonesia: string; bahasa_arab: string }>>;
        let counter = allData.length + 1;
        for (const babName in rawData) {
          const babNumber = parseInt(babName.replace(/\D/g, '')) || 1;
          const items = rawData[babName];
          for (const item of items) {
            allData.push({
              no: counter++,
              arab: item.bahasa_arab,
              indonesia: item.bahasa_indonesia,
              dars: babNumber,
              kategori_1: babName,
              kategori_2: 'mufrad',
            });
          }
        }
      } else {
        allData = allData.concat(mod.default);
      }
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
