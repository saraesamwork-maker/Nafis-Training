import type { Coord, StageConfig, StageId } from '../types/game';

// 12x12 Maze Grid: 0 = Path, 1 = Wall, 2 = Exit Door
export const MAZE_LAYOUT: number[][] = [
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2],
];

// 41 ordered coordinates from start (0,0) to exit door (11,11)
export const PATH_COORDS: Coord[] = [
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
  { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 }, { x: 10, y: 2 },
  { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 9, y: 4 }, { x: 8, y: 4 }, { x: 7, y: 4 }, { x: 6, y: 4 }, { x: 5, y: 4 },
  { x: 4, y: 4 }, { x: 3, y: 4 }, { x: 2, y: 4 }, { x: 1, y: 4 },
  { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 },
  { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 }, { x: 10, y: 9 },
  { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 11 },
];

export const INITIAL_PLAYER_STEP = 3; // Gives player a fair 3-step head start ahead of the monster at step 0
export const INITIAL_MONSTER_STEP = 0;

export const STAGE_ORDER: StageId[] = ['science', 'math', 'reading'];

export const STAGES: Record<StageId, StageConfig> = {
  science: {
    id: 'science',
    order: 1,
    title: 'المرحلة الأولى: متاهة العلوم',
    shortTitle: 'العلوم',
    subtitle: 'اختبر مهاراتك العلمية في الوراثة، الفيزياء، الكيمياء، وعلوم الأرض للوصول إلى بوابة الخروج.',
    startButtonLabel: 'ابدأ متاهة العلوم',
    nextStagePrompt: 'أجبت عن أسئلة العلوم بنجاح! استعد للانتقال إلى مرحلة الرياضيات.',
    accentColor: '#38bdf8',
  },
  math: {
    id: 'math',
    order: 2,
    title: 'المرحلة الثانية: متاهة الرياضيات',
    shortTitle: 'الرياضيات',
    subtitle: 'حل مسائل الهندسة، الاحتمالات، المتتابعات، والصيغة العلمية مع الرسوم التوضيحية.',
    startButtonLabel: 'ابدأ متاهة الرياضيات',
    nextStagePrompt: 'إنجاز رائع في الرياضيات! المحطة الأخيرة هي متاهة الفهم القرائي.',
    accentColor: '#fbbf24',
  },
  reading: {
    id: 'reading',
    order: 3,
    title: 'المرحلة الثالثة: متاهة القراءة',
    shortTitle: 'القراءة',
    subtitle: 'اقرأ النصوص الأدبية والمقالات بعناية واستنتج المعاني والأفكار الرئيسة لعبور خط النهاية.',
    startButtonLabel: 'ابدأ متاهة القراءة',
    nextStagePrompt: 'أكملت جميع متاهات نافس بنجاح!',
    accentColor: '#34d399',
  },
};

export const HEROES = [
  {
    id: 'kitty' as const,
    name: 'سُكّر المستكشفة',
    role: 'ذكية وسريعة البديهة',
    accent: '#f472b6',
  },
  {
    id: 'bunny' as const,
    name: 'لوز المغامرة',
    role: 'دقيقة الملاحظة وشجاعة',
    accent: '#fb7185',
  },
];

export const TOTAL_GAME_SECONDS = 90 * 60; // 90 minutes total
