import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import type { Question, StageConfig } from '../types/game';
import { READING_PASSAGES } from '../data/questions';
import { soundFx } from '../utils/sound';
import { MathDiagram } from './MathDiagram';

interface QuizPanelProps {
  stage: StageConfig;
  question: Question;
  shuffledOptions: string[];
  questionIndex: number;
  totalQuestions: number;
  selectedOption: string | null;
  isCorrect: boolean | null;
  pointsChange: number | null;
  isPreviouslyWrong: boolean;
  streak: number;
  onSelectOption: (option: string) => void;
  onRetryQuestion: () => void;
  onNextQuestion: () => void;
}

const ARABIC_INDEX = ['١', '٢', '٣', '٤'];

export function QuizPanel({
  stage,
  question,
  shuffledOptions,
  questionIndex,
  totalQuestions,
  selectedOption,
  isCorrect,
  pointsChange,
  isPreviouslyWrong,
  streak,
  onSelectOption,
  onRetryQuestion,
  onNextQuestion,
}: QuizPanelProps) {
  const [passageOpen, setPassageOpen] = useState(true);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const hasAnswered = selectedOption !== null;
  const shouldShowSolution = (hasAnswered && isCorrect === true) || answerRevealed;
  const passage = question.passageId ? READING_PASSAGES[question.passageId] : null;

  // Reset reveal state when question or attempt resets
  useEffect(() => {
    setAnswerRevealed(false);
  }, [question.id, selectedOption]);

  // Automatically open passage when switching to a new passage
  useEffect(() => {
    if (question.passageId) {
      setPassageOpen(true);
    }
  }, [question.passageId]);

  // Keyboard shortcuts: 1-4 to select option; Enter/Space to advance after correct/revealed; R to retry on wrong
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!hasAnswered) {
        const idx = ['1', '2', '3', '4'].indexOf(e.key);
        if (idx !== -1 && shuffledOptions[idx]) {
          e.preventDefault();
          onSelectOption(shuffledOptions[idx]);
        }
      } else if (isCorrect === true || answerRevealed) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNextQuestion();
        }
      } else if (isCorrect === false && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        onRetryQuestion();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    hasAnswered,
    isCorrect,
    answerRevealed,
    shuffledOptions,
    onSelectOption,
    onRetryQuestion,
    onNextQuestion,
  ]);

  const handleRevealAnswer = () => {
    soundFx.playReveal();
    setAnswerRevealed(true);
  };

  return (
    <section
      aria-label="لوحة الأسئلة"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5"
    >
      <div className="flex flex-col gap-4">
        {/* Clean Unboxed Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs sm:text-sm text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-100">{stage.shortTitle}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">
              السؤال {questionIndex + 1} من {totalQuestions}
            </span>
            {isPreviouslyWrong && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-semibold">
                  محاولة إعادة (نقاط مخفّضة: +١)
                </span>
              </>
            )}
          </div>

          {streak >= 2 && (
            <span className="font-mono-num font-bold text-amber-400">
              سلسلة إجابات صحيحة: {streak}
            </span>
          )}
        </div>

        {/* Reading Passage Drawer (only in Reading stage) */}
        {passage && (
          <div className="rounded-xl border border-emerald-800/60 bg-slate-950/70 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setPassageOpen((prev) => !prev);
              }}
              className="w-full px-4 py-3 flex items-center justify-between gap-2 text-right text-sm font-bold text-emerald-300 hover:bg-slate-900/70 transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{passage.title}</span>
              </span>
              {passageOpen ? (
                <ChevronUp className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
            </button>

            {passageOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-2.5 text-sm leading-relaxed text-slate-200 max-h-48 overflow-y-auto">
                {passage.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Question Prompt */}
        <h2 className="font-display text-lg sm:text-xl font-bold text-slate-50 leading-relaxed text-right">
          {question.q}
        </h2>

        {/* Optional SVG Diagram for Geometry / Number Line Math Questions */}
        {question.diagram && <MathDiagram type={question.diagram} />}

        {/* 4 Option Buttons */}
        <div className="grid grid-cols-1 gap-2.5" role="group" aria-label="خيارات الإجابة">
          {shuffledOptions.map((option, idx) => {
            const isChosen = selectedOption === option;
            const isRightOption = option === question.a;

            let optionClass =
              'bg-slate-950/60 border-slate-700/80 text-slate-100 hover:bg-slate-800 hover:border-sky-400/70';

            if (hasAnswered) {
              if (shouldShowSolution && isRightOption) {
                optionClass = 'bg-emerald-950/70 border-emerald-500 text-emerald-100 font-bold';
              } else if (isChosen && !isRightOption) {
                optionClass = 'bg-rose-950/70 border-rose-500 text-rose-100';
              } else {
                optionClass = 'bg-slate-950/40 border-slate-800 text-slate-500';
              }
            }

            return (
              <button
                key={option}
                type="button"
                disabled={hasAnswered}
                onClick={() => onSelectOption(option)}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl border text-right text-sm sm:text-base transition-colors duration-150 flex items-center justify-between gap-3 focus-visible:outline-2 focus-visible:outline-amber-400 ${optionClass} ${
                  hasAnswered ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono-num font-bold shrink-0 border ${
                      hasAnswered && shouldShowSolution && isRightOption
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : hasAnswered && isChosen && !isRightOption
                          ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {ARABIC_INDEX[idx]}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                {hasAnswered && shouldShowSolution && isRightOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-label="الإجابة الصحيحة" />
                )}
                {hasAnswered && isChosen && !isRightOption && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" aria-label="إجابة خاطئة" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Actions Area */}
      {hasAnswered ? (
        <div
          className={`rounded-xl border p-4 flex flex-col gap-3 ${
            isCorrect
              ? 'bg-emerald-950/40 border-emerald-700/70'
              : 'bg-rose-950/40 border-rose-700/70'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="text-emerald-300">
                    {isPreviouslyWrong
                      ? `إجابة صحيحة بعد محاولة سابقة! +${pointsChange ?? 1} نقطة (نقاط مخفّضة)`
                      : `إجابة صحيحة! +${pointsChange ?? 3} نقاط`}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />
                  <span className="text-rose-300">إجابة خاطئة — الوحش يتقدم نحوك!</span>
                </>
              )}
            </div>
          </div>

          {shouldShowSolution ? (
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{question.explanation}</p>
          ) : (
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              يمكنك إعادة محاولة السؤال الآن (+١ نقطة عند الصواب)، أو الانتقال إلى سؤال آخر دون إجابة (خصم ٢ نقطة).
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
            {isCorrect === false && !answerRevealed && (
              <>
                <button
                  type="button"
                  onClick={handleRevealAnswer}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  <span>عرض الإجابة والشرح</span>
                </button>

                <button
                  type="button"
                  onClick={onRetryQuestion}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-sky-200"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>إعادة السؤال</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onNextQuestion}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-200 ${
                isCorrect === false
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              <span>
                {isCorrect === true
                  ? questionIndex + 1 === totalQuestions
                    ? 'إنهاء المرحلة'
                    : 'السؤال التالي'
                  : questionIndex + 1 === totalQuestions
                    ? 'إنهاء المرحلة (-٢ نقطة)'
                    : 'الانتقال إلى سؤال آخر (-٢ نقطة)'}
              </span>
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/70">
          <p className="text-xs text-slate-500 text-right">
            تلميح: استخدم مفاتيح الأرقام ١–٤ للاختيار السريع.
          </p>
          <button
            type="button"
            onClick={onNextQuestion}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <span>
              {questionIndex + 1 === totalQuestions
                ? 'إنهاء المرحلة (-٢ نقطة)'
                : 'الانتقال إلى سؤال آخر (-٢ نقطة)'}
            </span>
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
