import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  STORY_CURRICULUM,
  StoryData,
} from '../../../data/storyCurriculum';
import { speakWord } from '../../../services/audioEngine';
import { useProgressStore } from '../../../store/useProgressStore';

type ReaderMode = 'reading' | 'quiz';

interface StoryReaderProps {
  onComplete?: (score: number) => void;
}

const STORY_READER_SKILLS = [
  'reading-reading-fluency',
  'reading-reading-comprehension',
  'reading-story-sequencing',
  'reading-vocabulary-in-context',
  'reading-question-answering',
  'reading-listening-comprehension',
] as const;

const STORY_ACTIVITY_PREFIX = 'reading-story-';

export const StoryReader: React.FC<StoryReaderProps> = ({
  onComplete,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [mode, setMode] = useState<ReaderMode>('reading');

  const [quizIndex, setQuizIndex] = useState(0);

  const [storyScore, setStoryScore] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    null,
  );

  const [showFeedback, setShowFeedback] = useState(false);
  const [completedStories, setCompletedStories] = useState<string[]>(
    [],
  );
  const [lessonComplete, setLessonComplete] = useState(false);

  const timerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const completeActivity = useProgressStore(
    (state) => state.completeActivity,
  );

  const currentStory: StoryData =
    STORY_CURRICULUM[currentStoryIndex];

  const totalPages = currentStory.pages.length;

  const isLastPage = currentPage === totalPages - 1;

  const currentQuestion =
    currentStory.questions[quizIndex];

  const clearTimers = useCallback(() => {
    timerIdsRef.current.forEach((timerId) => {
      clearTimeout(timerId);
    });

    timerIdsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearTimers]);

  /*
   * Speak a story page whenever the learner moves to a new page.
   */
  useEffect(() => {
    if (mode !== 'reading') {
      return;
    }

    clearTimers();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    speakWord(currentStory.pages[currentPage].text, {
      rate: 0.8,
    });
  }, [
    clearTimers,
    currentPage,
    currentStory.pages,
    mode,
  ]);

  const handleReadCurrentPage = useCallback(() => {
  const page = currentStory.pages[currentPage];

  if (!page) {
    return;
  }

  speakWord(page.text, {
    rate: 0.8,
  });
}, [currentPage, currentStory.pages]);

  const handleNextPage = useCallback(() => {
    if (!isLastPage) {
      setCurrentPage((previousPage) => previousPage + 1);
      return;
    }

    clearTimers();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setMode('quiz');
    setQuizIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [clearTimers, isLastPage]);

  const handlePreviousPage = useCallback(() => {
    if (mode === 'quiz') {
      setMode('reading');
      setSelectedAnswer(null);
      setShowFeedback(false);
      return;
    }

    if (currentPage > 0) {
      setCurrentPage((previousPage) => previousPage - 1);
    }
  }, [currentPage, mode]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showFeedback || !currentQuestion) {
        return;
      }

      setSelectedAnswer(answer);
      setShowFeedback(true);

      const isCorrect =
        answer === currentQuestion.answer;

      if (isCorrect) {
        setStoryScore((previousScore) => previousScore + 10);
        setSessionScore((previousScore) => previousScore + 10);
      }
    },
    [currentQuestion, showFeedback],
  );

  const finishCurrentStory = useCallback(() => {
    const storyId =
      `${STORY_ACTIVITY_PREFIX}${currentStory.id}`;

    const questionCount = currentStory.questions.length;

    const normalizedStoryScore =
      questionCount > 0
        ? Math.round(
            (storyScore / (questionCount * 10)) * 100,
          )
        : 100;

    completeActivity({
      id: storyId,
      score: normalizedStoryScore,
      academyId: 'language',
      domain: 'literacy',
      skillIds: STORY_READER_SKILLS,
    });

    setCompletedStories((previous) => {
      if (previous.includes(currentStory.id)) {
        return previous;
      }

      return [...previous, currentStory.id];
    });
  }, [
    completeActivity,
    currentStory.id,
    currentStory.questions.length,
    storyScore,
  ]);

  const handleNextQuestion = useCallback(() => {
    if (!showFeedback) {
      return;
    }

    if (
      quizIndex <
      currentStory.questions.length - 1
    ) {
      setQuizIndex((previousIndex) => previousIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      return;
    }

    /*
     * The final question has been answered.
     * Record this story as completed before moving on.
     */
    finishCurrentStory();

    const isFinalStory =
      currentStoryIndex ===
      STORY_CURRICULUM.length - 1;

    if (isFinalStory) {
      setLessonComplete(true);

      /*
       * sessionScore does not yet include the final answer
       * because React state updates are asynchronous.
       */
      const finalSessionScore =
        sessionScore +
        (selectedAnswer === currentQuestion.answer ? 10 : 0);

      onComplete?.(finalSessionScore);
      return;
    }

    setCurrentStoryIndex(
      (previousIndex) => previousIndex + 1,
    );

    setCurrentPage(0);
    setMode('reading');
    setQuizIndex(0);
    setStoryScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [
    currentQuestion,
    currentStory.questions.length,
    currentStoryIndex,
    finishCurrentStory,
    onComplete,
    quizIndex,
    selectedAnswer,
    sessionScore,
    showFeedback,
  ]);

  const handleRestart = useCallback(() => {
    clearTimers();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setCurrentStoryIndex(0);
    setCurrentPage(0);
    setMode('reading');
    setQuizIndex(0);
    setStoryScore(0);
    setSessionScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCompletedStories([]);
    setLessonComplete(false);
  }, [clearTimers]);

  /*
   * Keep the question options simple while the curriculum
   * currently provides only the correct answer.
   */
  const questionOptions = useMemo(
    () => [
      currentQuestion.answer,
      'Something else',
    ],
    [currentQuestion.answer],
  );

  const storyProgress =
    STORY_CURRICULUM.length > 0
      ? Math.round(
          ((currentStoryIndex +
            (mode === 'quiz' ? 1 : 0)) /
            STORY_CURRICULUM.length) *
            100,
        )
      : 0;

  const pageProgress =
    totalPages > 0
      ? Math.round(
          ((currentPage + 1) / totalPages) * 100,
        )
      : 0;

  if (lessonComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto w-full max-w-xl rounded-2xl border border-app-border bg-app-card p-8 text-center shadow-xl"
      >
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-12 w-12 text-green-400" />
        </div>

        <div className="mb-2 flex items-center justify-center gap-2 text-emerald-300">
          <Sparkles className="h-5 w-5" />

          <span className="text-sm font-semibold uppercase tracking-wider">
            Reading Practice Complete
          </span>

          <Sparkles className="h-5 w-5" />
        </div>

        <h3 className="text-2xl font-bold text-white">
          Excellent Reading!
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
          You read through the story collection and
          practised understanding what you read by
          answering comprehension questions.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-app-border bg-black/20 p-4">
            <div className="text-2xl font-bold text-white">
              {completedStories.length}
            </div>

            <div className="mt-1 text-xs text-gray-500">
              Stories completed
            </div>
          </div>

          <div className="rounded-xl border border-app-border bg-black/20 p-4">
            <div className="text-2xl font-bold text-white">
              {sessionScore}
            </div>

            <div className="mt-1 text-xs text-gray-500">
              Session points
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-500"
        >
          <RotateCcw className="h-4 w-4" />
          Read Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-app-border bg-app-card p-6 shadow-xl">
      {/* HEADER */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Reading • Stories
            </p>

            <h3 className="mt-1 flex items-center gap-2 text-xl font-bold text-white">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              Story Reader
            </h3>
          </div>

          <span className="shrink-0 rounded-full bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-300">
            Level {currentStory.level}
          </span>
        </div>

        {/* Overall Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">
              Story progression
            </span>

            <span className="font-semibold text-gray-300">
              {storyProgress}%
            </span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-gray-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={storyProgress}
            aria-label="Story progression"
          >
            <motion.div
              className="h-full rounded-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{
                width: `${storyProgress}%`,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Story Counter */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Story {currentStoryIndex + 1} of{' '}
            {STORY_CURRICULUM.length}
          </span>

          <span className="font-semibold text-yellow-400">
            ⭐ {sessionScore}
          </span>
        </div>
      </div>

      {/* READING MODE */}
      {mode === 'reading' && (
        <motion.div
          key={`reading-${currentStoryIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-6"
        >
          {/* Story Title */}
          <div className="mb-6 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-5xl"
            >
              {currentStory.emoji}
            </motion.div>

            <h2 className="mt-3 text-2xl font-bold text-white">
              {currentStory.title}
            </h2>
          </div>

          {/* Story Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStoryIndex}-${currentPage}`}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -18,
              }}
              transition={{ duration: 0.25 }}
              className="min-h-[170px] text-center"
            >
              <p className="text-xl font-medium leading-relaxed text-white">
                {currentStory.pages[currentPage].text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Page Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Page {currentPage + 1} of {totalPages}
              </span>

              <span className="text-gray-500">
                {pageProgress}%
              </span>
            </div>

            <div
              className="h-1.5 overflow-hidden rounded-full bg-gray-800"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pageProgress}
              aria-label="Story page progress"
            >
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${pageProgress}%`,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* QUIZ MODE */}
      {mode === 'quiz' && (
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-gray-800 bg-[#1a1a1a] p-6"
        >
          <div className="mb-5 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Reading Comprehension
            </span>

            <h3 className="mt-2 text-xl font-bold text-white">
              Question {quizIndex + 1} of{' '}
              {currentStory.questions.length}
            </h3>
          </div>

          <div className="mb-5 rounded-xl border border-gray-800 bg-black/20 p-4">
            <p className="text-center text-lg font-bold leading-relaxed text-white">
              {currentQuestion.question}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {questionOptions.map((answer) => {
              const isCorrectAnswer =
                answer === currentQuestion.answer;

              const isSelected =
                selectedAnswer === answer;

              let answerClass =
                'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500';

              if (showFeedback && isCorrectAnswer) {
                answerClass =
                  'border-green-400 bg-green-600 text-white';
              } else if (
                showFeedback &&
                isSelected &&
                !isCorrectAnswer
              ) {
                answerClass =
                  'border-red-400 bg-red-600 text-white';
              }

              return (
                <button
                  key={answer}
                  type="button"
                  onClick={() => handleAnswer(answer)}
                  disabled={showFeedback}
                  className={`rounded-xl border-2 p-3 font-bold transition-all ${answerClass}`}
                >
                  {answer}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-5 text-center"
              >
                {selectedAnswer ===
                currentQuestion.answer ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 font-bold text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      Correct! +10 points
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Great reading comprehension.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-red-400">
                      Not quite.
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Correct answer:{' '}
                      <span className="font-semibold text-white">
                        {currentQuestion.answer}
                      </span>
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white transition hover:bg-indigo-500"
                >
                  {quizIndex <
                  currentStory.questions.length - 1
                    ? 'Next Question'
                    : currentStoryIndex <
                        STORY_CURRICULUM.length - 1
                      ? 'Next Story'
                      : 'Finish Reading'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ACTIONS */}
      <div className="mt-5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handlePreviousPage}
          disabled={
            mode === 'reading' && currentPage === 0
          }
          className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2.5 font-bold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {mode === 'reading' && (
          <>
            <button
              type="button"
              onClick={handleReadCurrentPage}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-white transition hover:bg-indigo-500"
            >
              <Volume2 className="h-4 w-4" />
              Read Aloud
            </button>

            <button
              type="button"
              onClick={handleNextPage}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 font-bold text-white transition hover:bg-green-500"
            >
              {isLastPage ? 'Take Quiz' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Story Progress Indicators */}
      <div className="mt-6 flex justify-center gap-1.5">
        {STORY_CURRICULUM.slice(
          Math.max(0, currentStoryIndex - 4),
          Math.min(
            STORY_CURRICULUM.length,
            currentStoryIndex + 5,
          ),
        ).map((story, index) => {
          const actualIndex =
            Math.max(0, currentStoryIndex - 4) + index;

          return (
            <div
              key={story.id}
              className={`h-1.5 rounded-full transition-all ${
                actualIndex < currentStoryIndex
                  ? 'w-5 bg-green-500'
                  : actualIndex === currentStoryIndex
                    ? 'w-7 bg-indigo-500'
                    : 'w-2 bg-gray-700'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};