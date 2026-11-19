import { RotateCcw } from 'lucide-react';
import type { GameState, StageId } from '../types/game';
import { STAGE_ORDER, STAGES } from '../data/maze';

interface TopHeaderProps {
  gameState: GameState;
  currentStage: StageId;
  onResetToMenu: () => void;
}

export function TopHeader({ gameState, currentStage, onResetToMenu }: TopHeaderProps) {
  const showStages = gameState !== 'CHARACTER_SELECT';

  return (
    <header className="w-full border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center shrink-0">
          <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-slate-50 whitespace-nowrap">
            متاهة نافس المتكاملة
          </span>
        </div>

        {/* Zone 2: Stage Progression Links (quiet text with active underline) */}
        <nav aria-label="مراحل اللعبة" className="hidden md:flex items-center gap-6 text-sm font-medium">
          {showStages ? (
            STAGE_ORDER.map((stageId) => {
              const stage = STAGES[stageId];
              const isActive = stageId === currentStage;
              return (
                <span
                  key={stageId}
                  className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
                    isActive
                      ? 'text-amber-400 border-amber-400 font-bold'
                      : 'text-slate-400 border-transparent'
                  }`}
                >
                  {stage.order}. {stage.shortTitle}
                </span>
              );
            })
          ) : (
            <span className="text-slate-400 whitespace-nowrap shrink-0">
              تدريب تفاعلي لاختبارات نافس · العلوم · الرياضيات · القراءة
            </span>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          {gameState !== 'CHARACTER_SELECT' ? (
            <button
              type="button"
              onClick={onResetToMenu}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>القائمة الرئيسية</span>
            </button>
          ) : (
            <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap shrink-0">
              الصف الثالث المتوسط
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
