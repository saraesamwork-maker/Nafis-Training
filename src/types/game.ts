export type StageId = 'science' | 'math' | 'reading';

export type HeroId = 'kitty' | 'bunny';

export type GameState =
  | 'CHARACTER_SELECT'
  | 'STAGE_INTRO'
  | 'PLAYING'
  | 'PAUSED'
  | 'STAGE_COMPLETE'
  | 'VICTORY'
  | 'TIME_UP';

export type GameMode = 'campaign' | 'practice';

export type MathDiagramType = 'parallel-angles' | 'number-line';

export interface Question {
  id: string;
  stage: StageId;
  q: string;
  o: string[];
  a: string;
  explanation: string;
  diagram?: MathDiagramType;
  passageId?: 'sky-book' | 'sawdust-scent' | 'screen-free-hour';
}

export interface ReadingPassage {
  id: 'sky-book' | 'sawdust-scent' | 'screen-free-hour';
  title: string;
  paragraphs: string[];
}

export interface StageConfig {
  id: StageId;
  order: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  startButtonLabel: string;
  nextStagePrompt: string;
  accentColor: string;
}

export interface StageResult {
  stage: StageId;
  correct: number;
  total: number;
  scoreEarned: number;
  monsterCatches: number;
}

export interface Coord {
  x: number;
  y: number;
}
