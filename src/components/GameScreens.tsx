import { Award, BookOpen, Calculator, FlaskConical, Play, RotateCcw, Trophy } from 'lucide-react';
import { HEROES, STAGE_ORDER, STAGES } from '../data/maze';
import { QUESTIONS_BY_STAGE } from '../data/questions';
import type { GameMode, HeroId, StageId, StageResult } from '../types/game';
import { HeroSprite } from './Sprites';

interface CharacterSelectViewProps {
  selectedHero: HeroId;
  bestScore: number;
  onSelectHero: (heroId: HeroId) => void;
  onStartGame: (mode: GameMode, initialStage: StageId) => void;
}

const STAGE_ICONS: Record<StageId, typeof FlaskConical> = {
  science: FlaskConical,
  math: Calculator,
  reading: BookOpen,
};

export function CharacterSelectView({
  selectedHero,
  bestScore,
  onSelectHero,
  onStartGame,
}: CharacterSelectViewProps) {
  return (
    <div className="max-w-[960px] mx-auto px-4 py-8 sm:py-12 flex flex-col gap-10">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <h1
          className="font-display text-3xl sm:text-4xl font-extrabold text-slate-50 leading-tight"
          style={{ textWrap: 'balance' }}
        >
          اختر شخصيتك وابدأ تحدي متاهة نافس
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          أجب عن أسئلة العلوم والرياضيات والفهم القرائي لتشق طريقك نحو بوابة الخروج قبل أن يلحق بك وحش المتاهة.
        </p>
        {bestScore > 0 && (
          <p className="text-xs sm:text-sm text-amber-400 font-medium font-mono-num">
            أعلى نتيجة مسجلة: {bestScore} نقطة
          </p>
        )}
      </div>

      {/* Step 1: Hero Selection */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-bold text-slate-100 text-center">
          ١. اختر بطلك المفضل
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
          {HEROES.map((hero) => {
            const isSelected = selectedHero === hero.id;
            return (
              <button
                key={hero.id}
                type="button"
                onClick={() => onSelectHero(hero.id)}
                className={`group rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col items-center gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.18)]'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-28 h-28 rounded-2xl bg-slate-50 p-3 flex items-center justify-center shadow-inner transition-transform duration-200 group-hover:scale-105">
                  <HeroSprite heroId={hero.id} className="w-full h-full" />
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-base text-slate-50">{hero.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{hero.role}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Launch Options (Full Campaign or Direct Stage Practice) */}
      <div className="flex flex-col gap-5">
        <h2 className="font-display text-lg font-bold text-slate-100 text-center">
          ٢. اختر مسار اللعب
        </h2>

        {/* Primary CTA: Full 3-Stage Campaign */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onStartGame('campaign', 'science')}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-extrabold text-base sm:text-lg transition-colors cursor-pointer whitespace-nowrap shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <Play className="w-5 h-5 fill-current" aria-hidden="true" />
            <span>ابدأ الرحلة المتكاملة (العلوم ← الرياضيات ← القراءة)</span>
          </button>
        </div>

        {/* Direct Practice by Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto w-full pt-2">
          {STAGE_ORDER.map((stageId) => {
            const stage = STAGES[stageId];
            const Icon = STAGE_ICONS[stageId];
            const count = QUESTIONS_BY_STAGE[stageId].length;
            return (
              <button
                key={stageId}
                type="button"
                onClick={() => onStartGame('practice', stageId)}
                className="rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800/90 hover:border-slate-600 p-4 text-right transition-colors flex flex-col gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-slate-100 text-sm sm:text-base">
                    تدريب: {stage.shortTitle}
                  </span>
                  <Icon className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
                </div>
                <span className="text-xs text-slate-400 font-mono-num">{count} سؤالاً · مرحلة مستقلة</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Game Rules */}
      <div className="max-w-3xl mx-auto w-full border-t border-slate-800/80 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-400">
        <div>
          <strong className="text-slate-200 block mb-1">نظام النقاط</strong>
          الإجابة الصحيحة من المرة الأولى تمنحك ٣ نقاط (و٥ في أول سؤالين)، وتُخفّض إلى نقطة واحدة عند الإعادة.
        </div>
        <div>
          <strong className="text-slate-200 block mb-1">إعادة السؤال أو تخطيه</strong>
          عند الخطأ يتقدم الوحش، ويمكنك إعادة السؤال بنقاط مخفّضة؛ أما الانتقال لسؤال آخر دون إجابة فيخصم نقطتين.
        </div>
        <div>
          <strong className="text-slate-200 block mb-1">المؤثرات والشرح</strong>
          مؤثرات صوتية تفاعلية مع توضيح تعليمي لكل سؤال لتعزيز الفهم قبل المتابعة.
        </div>
      </div>
    </div>
  );
}

interface StageIntroViewProps {
  stageId: StageId;
  heroId: HeroId;
  questionCount: number;
  onBeginStage: () => void;
}

export function StageIntroView({ stageId, heroId, questionCount, onBeginStage }: StageIntroViewProps) {
  const stage = STAGES[stageId];
  return (
    <div className="max-w-lg mx-auto px-4 py-14 text-center flex flex-col items-center gap-6">
      <div className="w-24 h-24 rounded-2xl bg-slate-50 p-3 flex items-center justify-center border-2 border-amber-400">
        <HeroSprite heroId={heroId} className="w-full h-full animate-bob" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs sm:text-sm font-mono-num text-amber-400 font-bold">
          {questionCount} سؤالاً · متاهة من ٤١ خطوة
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-50">
          {stage.title}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{stage.subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onBeginStage}
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-base transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-amber-200"
      >
        <Play className="w-5 h-5 fill-current" aria-hidden="true" />
        <span>{stage.startButtonLabel}</span>
      </button>
    </div>
  );
}

interface StageCompleteViewProps {
  completedStageId: StageId;
  nextStageId: StageId;
  result: StageResult;
  onContinueNextStage: () => void;
}

export function StageCompleteView({
  completedStageId,
  nextStageId,
  result,
  onContinueNextStage,
}: StageCompleteViewProps) {
  const completedStage = STAGES[completedStageId];
  const nextStage = STAGES[nextStageId];
  const accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
        <Award className="w-9 h-9" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-50">
          أحسنت! أتممت مرحلة {completedStage.shortTitle}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">{completedStage.nextStagePrompt}</p>
      </div>

      <div className="w-full grid grid-cols-3 gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="text-xs text-slate-400">الإجابات الصحيحة</div>
          <div className="font-mono-num text-lg font-bold text-emerald-400 mt-1">
            {result.correct} / {result.total}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400">الدقة</div>
          <div className="font-mono-num text-lg font-bold text-slate-100 mt-1">{accuracy}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">نقاط المرحلة</div>
          <div className="font-mono-num text-lg font-bold text-amber-400 mt-1">+{result.scoreEarned}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinueNextStage}
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-base transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-amber-200"
      >
        <Play className="w-5 h-5 fill-current" aria-hidden="true" />
        <span>{nextStage.startButtonLabel}</span>
      </button>
    </div>
  );
}

interface SummaryViewProps {
  isTimeUp?: boolean;
  heroId: HeroId;
  totalScore: number;
  bestScore: number;
  remainingSeconds: number;
  results: StageResult[];
  onPlayAgain: () => void;
}

export function SummaryView({
  isTimeUp = false,
  heroId,
  totalScore,
  bestScore,
  remainingSeconds,
  results,
  onPlayAgain,
}: SummaryViewProps) {
  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const minsLeft = Math.floor(remainingSeconds / 60);
  const secsLeft = remainingSeconds % 60;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-6 text-center">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-slate-50 p-2.5 flex items-center justify-center border-2 border-amber-400">
          <HeroSprite heroId={heroId} className="w-full h-full" />
        </div>
        <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/50 flex items-center justify-center text-amber-400">
          <Trophy className="w-9 h-9" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-50">
          {isTimeUp ? 'انتهى الوقت المخصص للتحدي!' : 'مبارك لك الفوز وإتمام التحدي!'}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          {isTimeUp
            ? 'أبليت بلاءً حسناً خلال الوقت المتاح. إليك ملخص أدائك في المراحل التي خضتها:'
            : 'وصلت إلى بوابة الخروج بنجاح وأتممت رحلة المراجعة لاختبارات نافس.'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div>
          <div className="text-xs text-slate-400">مجموع النقاط</div>
          <div className="font-mono-num text-xl font-extrabold text-amber-400 mt-1">{totalScore}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">أعلى نتيجة</div>
          <div className="font-mono-num text-xl font-extrabold text-slate-100 mt-1">{bestScore}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">نسبة الدقة</div>
          <div className="font-mono-num text-xl font-extrabold text-emerald-400 mt-1">{overallAccuracy}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">الوقت المتبقي</div>
          <div className="font-mono-num text-xl font-extrabold text-sky-400 mt-1">
            {String(minsLeft).padStart(2, '0')}:{String(secsLeft).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Breakdown by Stage */}
      {results.length > 0 && (
        <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl divide-y divide-slate-800 text-right">
          {results.map((r) => {
            const st = STAGES[r.stage];
            const acc = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
            return (
              <div key={r.stage} className="px-4 py-3 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-slate-100">{st.shortTitle}</span>
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 font-mono-num">
                  <span>
                    {r.correct}/{r.total} ({acc}%)
                  </span>
                  <span className="text-amber-400 font-bold">+{r.scoreEarned} نقطة</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onPlayAgain}
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-base transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-amber-200"
      >
        <RotateCcw className="w-5 h-5" aria-hidden="true" />
        <span>العب مرة أخرى</span>
      </button>
    </div>
  );
}
