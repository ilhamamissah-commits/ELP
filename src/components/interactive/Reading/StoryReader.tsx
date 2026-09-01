import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowLeft, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { STORY_CURRICULUM, StoryData } from '../../../data/storyCurriculum';
import { speakWord } from '../../../services/audioEngine';

export const StoryReader: React.FC = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [mode, setMode] = useState<'reading' | 'quiz'>('reading');
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentStory: StoryData = STORY_CURRICULUM[currentStoryIndex];
  const totalPages = currentStory.pages.length;
  const isLastPage = currentPage === totalPages - 1;

  // Speak current page when it changes
  useEffect(() => {
    speakWord(currentStory.pages[currentPage], 0.8);
  }, [currentPage, currentStoryIndex]);

  const handleNextPage = () => {
    if (isLastPage) {
      setMode('quiz');
      setQuizIndex(0);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    const isCorrect = answer === currentStory.questions[quizIndex].answer;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < currentStory.questions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Move to next story
      if (currentStoryIndex < STORY_CURRICULUM.length - 1) {
        setCurrentStoryIndex(currentStoryIndex + 1);
        setCurrentPage(0);
        setMode('reading');
        setScore(0);
      } else {
        alert("You finished all 50 stories! 🎉");
      }
    }
  };

  const handleReadStory = () => {
    speakWord(currentStory.pages[currentPage], 0.8);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Story Reader
        </h3>
        <div className="flex gap-2 items-center">
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
            Level {currentStory.level}
          </span>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
            {currentStoryIndex + 1} / {STORY_CURRICULUM.length}
          </span>
        </div>
      </div>

      {/* READING MODE */}
      {mode === 'reading' && (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 min-h-[300px] flex flex-col">
          
          {/* Story Title */}
          <div className="mb-4 text-center">
            <span className="text-5xl">{currentStory.emoji}</span>
            <h2 className="text-2xl font-bold text-white mt-2">{currentStory.title}</h2>
          </div>

          {/* Story Text */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 text-center"
            >
              <p className="text-xl text-white leading-relaxed font-medium">
                {currentStory.pages[currentPage]}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Page Indicator */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Page {currentPage + 1} of {totalPages}
          </div>
        </div>
      )}

      {/* QUIZ MODE */}
      {mode === 'quiz' && (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 min-h-[300px] flex flex-col justify-center">
          <h3 className="text-lg font-bold text-white text-center mb-4">📝 Reading Quiz</h3>
          
          <p className="text-center text-white font-bold text-xl mb-4">
            {currentStory.questions[quizIndex].question}
          </p>

          <div className="flex flex-col gap-3">
            {/* Only 2 options for simplicity: Correct Answer & Wrong Answer */}
            {[currentStory.questions[quizIndex].answer, 'Something else'].map((answer, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(answer)}
                disabled={showFeedback}
                className={`p-3 rounded-xl font-bold border-2 transition-all ${
                  showFeedback && answer === currentStory.questions[quizIndex].answer
                    ? 'bg-green-600 border-green-400 text-white'
                    : showFeedback && selectedAnswer === answer
                    ? 'bg-red-600 border-red-400 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                {answer}
              </button>
            ))}
          </div>

          {showFeedback && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="mt-4 text-center">
              {selectedAnswer === currentStory.questions[quizIndex].answer ? (
                <p className="text-green-400 font-bold">🎉 Correct! +10 Points</p>
              ) : (
                <p className="text-red-400 font-bold">The correct answer was: {currentStory.questions[quizIndex].answer}</p>
              )}
              <button 
                onClick={handleNextQuestion}
                className="mt-3 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold"
              >
                {quizIndex < currentStory.questions.length - 1 ? 'Next Question ➜' : 'Next Story ➜'}
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-4 flex justify-between items-center gap-4">
        <button 
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-bold disabled:opacity-30 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button 
          onClick={handleReadStory}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" /> Read Aloud
        </button>

        <button 
          onClick={handleNextPage}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold flex items-center gap-2"
        >
          {isLastPage ? 'Take Quiz' : 'Next'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};