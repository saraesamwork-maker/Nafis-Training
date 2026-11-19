import { AlertTriangle, DoorOpen, Footprints, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { MAZE_LAYOUT, PATH_COORDS } from '../data/maze';
import type { HeroId } from '../types/game';
import { HeroSprite, MonsterSprite } from './Sprites';

interface MazeBoardProps {
  heroId: HeroId;
  playerStep: number;
  monsterStep: number;
  isMuted: boolean;
  isPaused: boolean;
  monsterAlert: string | null;
  onToggleMute: () => void;
  onTogglePause: () => void;
}

export function MazeBoard({
  heroId,
  playerStep,
  monsterStep,
  isMuted,
  isPaused,
  monsterAlert,
  onToggleMute,
  onTogglePause,
}: MazeBoardProps) {
  const safePlayerStep = Math.min(Math.max(0, playerStep), PATH_COORDS.length - 1);
  const safeMonsterStep = Math.min(Math.max(0, monsterStep), PATH_COORDS.length - 1);

  const playerPos = PATH_COORDS[safePlayerStep];
  const monsterPos = PATH_COORDS[safeMonsterStep];
  const distance = Math.max(0, safePlayerStep - safeMonsterStep);
  const progressPercent = Math.round((safePlayerStep / (PATH_COORDS.length - 1)) * 100);

  // Build quick lookup of visited path cells
  const visitedSet = new Set<string>();
  for (let i = 0; i < safePlayerStep; i++) {
    const coord = PATH_COORDS[i];
    visitedSet.add(`${coord.y}-${coord.x}`);
  }

  return (
    <section
      aria-label="لوحة المتاهة"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-4"
    >
      {/* Maze Toolbar */}
      <div className="w-full flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Footprints className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
          <span>التقدم نحو المخرج:</span>
          <span className="font-mono-num font-bold text-slate-50">{progressPercent}%</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>صامت</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-sky-400" aria-hidden="true" />
                <span>الصوت</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onTogglePause}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>استئناف</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>إيقاف مؤقت</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 12x12 Grid (explicitly LTR so x/y coordinates map directly to columns/rows) */}
      <div
        dir="ltr"
        className="relative w-full max-w-[456px] aspect-square bg-slate-950 rounded-xl border-2 border-slate-700 overflow-hidden shadow-lg"
      >
        <div className="grid grid-cols-12 grid-rows-12 w-full h-full">
          {MAZE_LAYOUT.map((row, r) =>
            row.map((cellType, c) => {
              const isWall = cellType === 1;
              const isExit = cellType === 2;
              const isPlayerCell = playerPos.y === r && playerPos.x === c;
              const isVisited = visitedSet.has(`${r}-${c}`);

              return (
                <div
                  key={`${r}-${c}`}
                  className={`relative flex items-center justify-center border-[0.5px] border-slate-900/40 transition-colors duration-200 ${
                    isWall
                      ? 'bg-slate-800/95 shadow-[inset_0_0_8px_rgba(2,6,23,0.85)]'
                      : isExit
                        ? 'bg-amber-400/25 border-amber-400/60'
                        : isPlayerCell
                          ? 'bg-slate-100'
                          : 'bg-slate-900/60'
                  }`}
                >
                  {isExit && !isPlayerCell && (
                    <DoorOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" aria-label="باب الخروج" />
                  )}
                  {!isWall && !isExit && !isPlayerCell && isVisited && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400/45" aria-hidden="true" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Monster Layer (smooth compositor transform) */}
        <div
          className="absolute top-0 left-0 w-[8.333333%] h-[8.333333%] p-0.5 pointer-events-none transition-transform duration-300 ease-out z-10 flex items-center justify-center"
          style={{
            transform: `translate(${monsterPos.x * 100}%, ${monsterPos.y * 100}%)`,
          }}
        >
          <MonsterSprite className="w-full h-full drop-shadow-[0_2px_6px_rgba(225,29,72,0.55)]" />
        </div>

        {/* Player Hero Layer (smooth compositor transform) */}
        <div
          className="absolute top-0 left-0 w-[8.333333%] h-[8.333333%] p-0.5 pointer-events-none transition-transform duration-300 ease-out z-20 flex items-center justify-center"
          style={{
            transform: `translate(${playerPos.x * 100}%, ${playerPos.y * 100}%)`,
          }}
        >
          <HeroSprite heroId={heroId} className="w-full h-full drop-shadow-[0_2px_4px_rgba(15,23,42,0.45)]" />
        </div>
      </div>

      {/* Monster Proximity / Catch Alert Footer */}
      <div className="w-full flex flex-col gap-2">
        <div
          className={`w-full rounded-xl px-3.5 py-2.5 border text-xs sm:text-sm flex items-center justify-between gap-2 ${
            distance <= 2
              ? 'bg-rose-950/50 border-rose-700/70 text-rose-200'
              : 'bg-slate-950/70 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={`w-4 h-4 shrink-0 ${distance <= 2 ? 'text-rose-400' : 'text-amber-400'}`}
              aria-hidden="true"
            />
            <span>المسافة بينك وبين الوحش</span>
          </div>
          <span className="font-mono-num font-bold whitespace-nowrap">
            {distance} {distance === 1 ? 'خطوة' : distance === 2 ? 'خطوتان' : distance <= 10 ? 'خطوات' : 'خطوة'}
          </span>
        </div>

        {monsterAlert && (
          <div
            role="status"
            className="w-full rounded-xl px-3.5 py-2.5 bg-rose-950/70 border border-rose-600/70 text-rose-100 text-xs sm:text-sm font-medium text-right"
          >
            {monsterAlert}
          </div>
        )}
      </div>
    </section>
  );
}
