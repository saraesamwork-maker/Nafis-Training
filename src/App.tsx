import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clock, Layers, Play, Star } from 'lucide-react';
import {
  INITIAL_MONSTER_STEP,
  INITIAL_PLAYER_STEP,
  PATH_COORDS,
  STAGE_ORDER,
  STAGES,
  TOTAL_GAME_SECONDS,
} from './data/maze';
import { QUESTIONS_BY_STAGE } from './data/questions';
import type { GameMode, GameState, HeroId, Question, StageId, StageResult } from './types/game';
import { soundFx } from './utils/sound';
import { TopHeader } from './components/TopHeader';
import { MazeBoard } from './components/MazeBoard';
import { QuizPanel } from './components/QuizPanel';
import {
  CharacterSelectView,
  StageCompleteView,
  StageIntroView,
  SummaryView,
} from './components/GameScreens';

const BEST_SCORE_KEY = 'nafs_maze_best_score_v1';

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTimer(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('CHARACTER_SELECT');
  const [gameMode, setGameMode] = useState<GameMode>('campaign');
  const [selectedHero, setSelectedHero] = useState<HeroId>('kitty');
  const [currentStage, setCurrentStage] = useState<StageId>('science');

  const [stageQuestions, setStageQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const [playerStep, setPlayerStep] = useState(INITIAL_PLAYER_STEP);
  const [monsterStep, setMonsterStep] = useState(INITIAL_MONSTER_STEP);

  const [score, setScore] = useState(0);
  const [stageScoreEarned, setStageScoreEarned] = useState(0);
  const [stageCorrectCount, setStageCorrectCount] = useState(0);
  const [stageMonsterCatches, setStageMonsterCatches] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<StageResult[]>([]);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pointsChange, setPointsChange] = useState<number | null>(null);
  const [monsterAlert, setMonsterAlert] = useState<string | null>(null);
  const [failedQuestionIds, setFailedQuestionIds] = useState<Set<string>>(() => new Set());
  const [solvedQuestionIds, setSolvedQuestionIds] = useState<Set<string>>(() => new Set());

  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_GAME_SECONDS);
  const [isMuted, setIsMuted] = useState(false);

  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(BEST_SCORE_KEY);
      return saved ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Update personal best score whenever score increases
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      try {
        localStorage.setItem(BEST_SCORE_KEY, String(score));
      } catch {
        // ignore storage quota errors
      }
    }
  }, [score, bestScore]);

  // Countdown timer active only during PLAYING
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setGameState('TIME_UP');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [gameState]);

  const prepareStage = useCallback((stageId: StageId) => {
    const rawQuestions = QUESTIONS_BY_STAGE[stageId];
    // Preserve reading passage grouping order? Shuffling within or keeping reading passages grouped is even nicer,
    // while shuffling Science and Math questions freely!
    const prepared =
      stageId === 'reading'
        ? [
            ...shuffleArray(rawQuestions.filter((q) => q.passageId === 'sky-book')),
            ...shuffleArray(rawQuestions.filter((q) => q.passageId === 'sawdust-scent')),
            ...shuffleArray(rawQuestions.filter((q) => q.passageId === 'screen-free-hour')),
          ]
        : shuffleArray(rawQuestions);

    setCurrentStage(stageId);
    setStageQuestions(prepared);
    setQuestionIndex(0);
    setShuffledOptions(shuffleArray(prepared[0].o));
    setPlayerStep(INITIAL_PLAYER_STEP);
    setMonsterStep(INITIAL_MONSTER_STEP);
    setStageScoreEarned(0);
    setStageCorrectCount(0);
    setStageMonsterCatches(0);
    setStreak(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setPointsChange(null);
    setMonsterAlert(null);
    setFailedQuestionIds(new Set());
    setSolvedQuestionIds(new Set());
  }, []);

  const handleStartGame = (mode: GameMode, initialStage: StageId) => {
    soundFx.playStart();
    setGameMode(mode);
    setScore(0);
    setResults([]);
    setRemainingSeconds(TOTAL_GAME_SECONDS);
    prepareStage(initialStage);
    setGameState('STAGE_INTRO');
  };

  const handleBeginStage = () => {
    soundFx.playStart();
    setGameState('PLAYING');
  };

  const handleResetToMenu = () => {
    soundFx.playClick();
    setGameState('CHARACTER_SELECT');
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) {
      soundFx.playClick();
    }
  };

  const handleTogglePause = () => {
    soundFx.playClick();
    setGameState((prev) => (prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev));
  };

  const currentQuestion = stageQuestions[questionIndex];

  const handleSelectOption = useCallback(
    (choice: string) => {
      if (!currentQuestion || selectedOption !== null || gameState !== 'PLAYING') return;

      setSelectedOption(choice);
      const correct = choice === currentQuestion.a;
      setIsCorrect(correct);

      const lastPathIndex = PATH_COORDS.length - 1;
      const wasPreviouslyWrong = failedQuestionIds.has(currentQuestion.id);

      if (correct) {
        soundFx.playCorrect(wasPreviouslyWrong);
        // Reduce points to +1 if this question was previously answered wrongly; otherwise 5 for first 2, 3 for others
        const earned = wasPreviouslyWrong
          ? 1
          : questionIndex === 0 || questionIndex === 1
            ? 5
            : 3;
        setScore((s) => s + earned);
        setStageScoreEarned((s) => s + earned);
        if (!solvedQuestionIds.has(currentQuestion.id)) {
          setStageCorrectCount((c) => c + 1);
          setSolvedQuestionIds((prev) => {
            const next = new Set(prev);
            next.add(currentQuestion.id);
            return next;
          });
        }
        setStreak((st) => (wasPreviouslyWrong ? 0 : st + 1));
        setPointsChange(earned);
        setMonsterAlert(null);

        // Dynamic proportional step advance so finishing the stage lands squarely at the Exit Door
        const remainingQuestions = Math.max(1, stageQuestions.length - questionIndex);
        const remainingPath = Math.max(0, lastPathIndex - playerStep);
        const stepAdvance = Math.max(1, Math.ceil(remainingPath / remainingQuestions));
        setPlayerStep((prev) => Math.min(lastPathIndex, prev + stepAdvance));
      } else {
        soundFx.playWrong();
        setStreak(0);
        setPointsChange(0);
        setFailedQuestionIds((prev) => {
          const next = new Set(prev);
          next.add(currentQuestion.id);
          return next;
        });

        const nextMonster = monsterStep + 2;
        if (nextMonster >= playerStep) {
          soundFx.playCaught();
          setMonsterStep(INITIAL_MONSTER_STEP);
          setScore((s) => s - 3);
          setStageScoreEarned((s) => s - 3);
          setStageMonsterCatches((c) => c + 1);
          setMonsterAlert('أمسك بك الوحش! عاد إلى نقطة البداية وتم خصم ٣ نقاط.');
        } else {
          setMonsterStep(nextMonster);
          setMonsterAlert(null);
        }
      }
    },
    [
      currentQuestion,
      selectedOption,
      gameState,
      failedQuestionIds,
      solvedQuestionIds,
      questionIndex,
      stageQuestions.length,
      playerStep,
      monsterStep,
    ]
  );

  const handleRetryQuestion = useCallback(() => {
    if (!currentQuestion || gameState !== 'PLAYING') return;
    soundFx.playRetry();
    setSelectedOption(null);
    setIsCorrect(null);
    setPointsChange(null);
  }, [currentQuestion, gameState]);

  const handleNextQuestion = useCallback(() => {
    const skippedWithoutCorrect = isCorrect !== true;
    const skipPenalty = skippedWithoutCorrect ? 2 : 0;

    if (skippedWithoutCorrect) {
      soundFx.playSkipPenalty();
      setScore((s) => s - skipPenalty);
      setStageScoreEarned((s) => s - skipPenalty);
      setStreak(0);
      setMonsterAlert('تم الانتقال إلى سؤال آخر دون إجابة صحيحة — تم خصم نقطتين.');
    } else {
      soundFx.playClick();
      setMonsterAlert(null);
    }

    const nextIdx = questionIndex + 1;
    if (nextIdx < stageQuestions.length) {
      setQuestionIndex(nextIdx);
      setShuffledOptions(shuffleArray(stageQuestions[nextIdx].o));
      setSelectedOption(null);
      setIsCorrect(null);
      setPointsChange(null);
      return;
    }

    // Completed current stage
    const stageSummary: StageResult = {
      stage: currentStage,
      correct: stageCorrectCount,
      total: stageQuestions.length,
      scoreEarned: stageScoreEarned - skipPenalty,
      monsterCatches: stageMonsterCatches,
    };

    setResults((prev) => [...prev, stageSummary]);
    soundFx.playStageWin();

    if (gameMode === 'practice') {
      setGameState('VICTORY');
      return;
    }

    const currentOrderIdx = STAGE_ORDER.indexOf(currentStage);
    if (currentOrderIdx < STAGE_ORDER.length - 1) {
      setGameState('STAGE_COMPLETE');
    } else {
      setGameState('VICTORY');
    }
  }, [
    isCorrect,
    questionIndex,
    stageQuestions,
    currentStage,
    stageCorrectCount,
    stageScoreEarned,
    stageMonsterCatches,
    gameMode,
  ]);

  const nextStageId = useMemo(() => {
    const idx = STAGE_ORDER.indexOf(currentStage);
    return STAGE_ORDER[Math.min(idx + 1, STAGE_ORDER.length - 1)];
  }, [currentStage]);

  const handleContinueNextStage = () => {
    prepareStage(nextStageId);
    setGameState('PLAYING');
  };

  const activeStageConfig = STAGES[currentStage];
  const showActiveHud = gameState === 'PLAYING' || gameState === 'PAUSED';

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col">
      <TopHeader
        gameState={gameState}
        currentStage={currentStage}
        onResetToMenu={handleResetToMenu}
      />

      {/* Live Game HUD Strip during active play */}
      {showActiveHud && (
        <div className="w-full border-b border-slate-800/80 bg-slate-900/60">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400/20 shrink-0" aria-hidden="true" />
              <span>النقاط:</span>
              <span className="font-mono-num text-base">{score}</span>
            </div>

            <div className="flex items-center gap-2 text-sky-300 font-bold">
              <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>المرحلة:</span>
              <span>{activeStageConfig.shortTitle}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>الوقت المتبقي:</span>
              <span className="font-mono-num text-base">{formatTimer(remainingSeconds)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <main className="flex-1 w-full">
        {gameState === 'CHARACTER_SELECT' && (
          <CharacterSelectView
            selectedHero={selectedHero}
            bestScore={bestScore}
            onSelectHero={setSelectedHero}
            onStartGame={handleStartGame}
          />
        )}

        {gameState === 'STAGE_INTRO' && (
          <StageIntroView
            stageId={currentStage}
            heroId={selectedHero}
            questionCount={stageQuestions.length}
            onBeginStage={handleBeginStage}
          />
        )}

        {(gameState === 'PLAYING' || gameState === 'PAUSED') && currentQuestion && (
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Maze Stage (5 columns on desktop) */}
              <div className="lg:col-span-5">
                <MazeBoard
                  heroId={selectedHero}
                  playerStep={playerStep}
                  monsterStep={monsterStep}
                  isMuted={isMuted}
                  isPaused={gameState === 'PAUSED'}
                  monsterAlert={monsterAlert}
                  onToggleMute={handleToggleMute}
                  onTogglePause={handleTogglePause}
                />
              </div>

              {/* Quiz & Reading Panel (7 columns on desktop) */}
              <div className="lg:col-span-7">
                <QuizPanel
                  stage={activeStageConfig}
                  question={currentQuestion}
                  shuffledOptions={shuffledOptions}
                  questionIndex={questionIndex}
                  totalQuestions={stageQuestions.length}
                  selectedOption={selectedOption}
                  isCorrect={isCorrect}
                  pointsChange={pointsChange}
                  isPreviouslyWrong={failedQuestionIds.has(currentQuestion.id)}
                  streak={streak}
                  onSelectOption={handleSelectOption}
                  onRetryQuestion={handleRetryQuestion}
                  onNextQuestion={handleNextQuestion}
                />
              </div>
            </div>

            {/* Pause Overlay */}
            {gameState === 'PAUSED' && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="اللعبة متوقفة مؤقتاً"
                className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center flex flex-col items-center gap-4 shadow-2xl">
                  <h2 className="font-display text-2xl font-extrabold text-slate-50">
                    تم إيقاف اللعبة مؤقتاً
                  </h2>
                  <p className="text-sm text-slate-300">
                    تم إيقاف المؤقت. يمكنك استئناف رحلتك في أي وقت.
                  </p>
                  <button
                    type="button"
                    onClick={handleTogglePause}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-base transition-colors cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                    <span>استئناف اللعب</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {gameState === 'STAGE_COMPLETE' && results.length > 0 && (
          <StageCompleteView
            completedStageId={currentStage}
            nextStageId={nextStageId}
            result={results[results.length - 1]}
            onContinueNextStage={handleContinueNextStage}
          />
        )}

        {(gameState === 'VICTORY' || gameState === 'TIME_UP') && (
          <SummaryView
            isTimeUp={gameState === 'TIME_UP'}
            heroId={selectedHero}
            totalScore={score}
            bestScore={bestScore}
            remainingSeconds={remainingSeconds}
            results={results}
            onPlayAgain={() => setGameState('CHARACTER_SELECT')}
          />
        )}
      </main>
    </div>
  );
}
