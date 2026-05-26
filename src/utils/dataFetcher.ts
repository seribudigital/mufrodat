import type { MufrodatItem, QuizQuestion, KitabType } from '../types';

// Dynamically import all part JSON files from the assets folder.
const modules = import.meta.glob<{ default: any }>('../assets/data/**/*.json');

export const loadLevelDataset = async (kitab: KitabType, jilid: number, level: number): Promise<MufrodatItem[]> => {
  let allData: MufrodatItem[] = [];
  
  // Durusul Lughah Level Maps
  const dlLevelMapJilid1: Record<number, string[]> = {
    1: ['part1.json', 'part2.json'],
    2: ['part3.json', 'part4.json'],
    3: ['part5.json', 'part6.json'],
    4: ['part7.json', 'part8.json'],
  };

  const dlLevelMapJilid2: Record<number, string[]> = {
    1: ['part1.json', 'part2.json'],
    2: ['part3.json', 'part4.json'],
    3: ['part5.json', 'part6.json'],
    4: ['part7.json', 'part8.json'],
  };

  // ABY Level Maps
  const abyLevelMapJilid1: Record<number, string[]> = {
    1: ['aby_jilid_1_unit_1_sampai_4.json'],
    2: ['aby_jilid_1_unit_1_sampai_4.json'],
    3: ['aby_jilid_1_unit_5_sampai_8.json'],
    4: ['aby_jilid_1_unit_5_sampai_8.json'],
  };

  const abyLevelMapJilid2: Record<number, string[]> = {
    1: ['aby_jilid_2_unit_1_sampai_4.json'],
    2: ['aby_jilid_2_unit_1_sampai_4.json'],
    3: ['aby_jilid_2_unit_5_sampai_8.json'],
    4: ['aby_jilid_2_unit_5_sampai_8.json'],
  };

  const abyLevelMapJilid3: Record<number, string[]> = {
    1: ['aby_jilid_3_unit_1_sampai_4.json'],
    2: ['aby_jilid_3_unit_1_sampai_4.json'],
    3: ['aby_jilid_3_unit_5_sampai_8.json'],
    4: ['aby_jilid_3_unit_5_sampai_8.json'],
  };

  const abyLevelMapJilid4: Record<number, string[]> = {
    1: ['aby_jilid_4_unit_1_sampai_4.json'],
    2: ['aby_jilid_4_unit_1_sampai_4.json'],
    3: ['aby_jilid_4_unit_5_sampai_8.json'],
    4: ['aby_jilid_4_unit_5_sampai_8.json'],
  };

  const abyAllowedUnitsMap: Record<number, Record<number, string[]>> = {
    1: {
      1: ['unit_1', 'unit_2'],
      2: ['unit_3', 'unit_4'],
      3: ['unit_5', 'unit_6'],
      4: ['unit_7', 'unit_8'],
    },
    2: {
      1: ['unit_1', 'unit_2'],
      2: ['unit_3', 'unit_4'],
      3: ['unit_5', 'unit_6'],
      4: ['unit_7', 'unit_8'],
    },
    3: {
      1: ['unit_1', 'unit_2'],
      2: ['unit_3', 'unit_4'],
      3: ['unit_5', 'unit_6'],
      4: ['unit_7', 'unit_8'],
    },
    4: {
      1: ['unit_1', 'unit_2'],
      2: ['unit_3', 'unit_4'],
      3: ['unit_5', 'unit_6'],
      4: ['unit_7', 'unit_8'],
    }
  };

  let levelMap = dlLevelMapJilid1;
  if (kitab === 'dl') {
    if (jilid === 2) {
      levelMap = dlLevelMapJilid2;
    }
  } else if (kitab === 'aby') {
    if (jilid === 1) {
      levelMap = abyLevelMapJilid1;
    } else if (jilid === 2) {
      levelMap = abyLevelMapJilid2;
    } else if (jilid === 3) {
      levelMap = abyLevelMapJilid3;
    } else if (jilid === 4) {
      levelMap = abyLevelMapJilid4;
    }
  }

  const allowedParts = levelMap[level] || levelMap[4];

  for (const path in modules) {
    const isTargetKitab = path.includes(`/${kitab}/`);
    const isTargetJilid = path.includes(`/jilid${jilid}/`);
    const fileName = path.split('/').pop() || '';
    if (isTargetKitab && isTargetJilid && allowedParts.includes(fileName)) {
      const mod = await modules[path]();
      if (kitab === 'aby') {
        const rawData = mod.default;
        const metadata = rawData.metadata || {};
        const targetUnits = abyAllowedUnitsMap[jilid]?.[level] || [];
        
        let counter = allData.length + 1;
        for (const unitKey of targetUnits) {
          if (rawData[unitKey]) {
            const items = rawData[unitKey];
            const unitDesc = metadata[unitKey] || '';
            const unitName = unitKey.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
            for (const item of items) {
              allData.push({
                no: counter++,
                arab: item.arabic,
                indonesia: item.indonesian,
                dars: parseInt(unitKey.replace(/\D/g, '')) || 1,
                kategori_1: unitKey,
                kategori_2: 'mufrad',
                unit: unitName,
                unitDescription: unitDesc
              });
            }
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
