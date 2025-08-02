import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { questions } from '@/data/questions';
import QuestionCard from '@/components/QuestionCard';
import ProgressIndicator from '@/components/ProgressIndicator';

export default function Game() {
  const navigate = useNavigate();
  const { gameState, saveAnswer, nextQuestion, previousQuestion, completeGame } = useGame();
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[gameState.currentQuestion];
  const isLastQuestion = gameState.currentQuestion === questions.length - 1;
  const canGoNext = currentAnswer.trim() !== '';
  const canGoPrevious = gameState.currentQuestion > 0;

  // Redirect if no participant name
  useEffect(() => {
    if (!gameState.participantName) {
      navigate('/');
    }
  }, [gameState.participantName, navigate]);

  // Load existing answer when question changes
  useEffect(() => {
    const existingAnswer = gameState.answers.find(
      a => a.questionId === currentQuestion?.id
    );
    setCurrentAnswer(existingAnswer?.answer || '');
  }, [gameState.currentQuestion, gameState.answers, currentQuestion]);

  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer);
    if (currentQuestion) {
      saveAnswer(currentQuestion.id, answer);
    }
  };

  const handleNext = () => {
    if (!canGoNext) return;
    
    if (isLastQuestion) {
      handleSubmit();
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      previousQuestion();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Save to Firebase
      await completeGame();
      navigate('/thank-you');
    } catch (error) {
      console.error('Error completing game:', error);
      // Still navigate even if there's an error (fallback was handled in completeGame)
      navigate('/thank-you');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gold-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gold-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Farewell Game
            </h1>
            <p className="text-gray-600">
              Welcome, {gameState.participantName}!
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ProgressIndicator 
              current={gameState.currentQuestion + 1} 
              total={questions.length} 
            />
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <QuestionCard
                question={currentQuestion}
                initialAnswer={currentAnswer}
                onAnswerChange={handleAnswerChange}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-between items-center"
          >
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">
                {gameState.answers.length} of {questions.length} answered
              </p>
              <div className="flex space-x-1">
                {questions.map((_, index) => {
                  const isAnswered = gameState.answers.some(a => a.questionId === questions[index].id);
                  const isCurrent = index === gameState.currentQuestion;
                  
                  return (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        isAnswered 
                          ? 'bg-green-500' 
                          : isCurrent 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!canGoNext || isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-gold-500 text-white rounded-lg hover:from-blue-700 hover:to-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : isLastQuestion ? (
                <>
                  <Check size={20} />
                  <span>Complete</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </motion.div>

          {/* Answer Status */}
          {currentAnswer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                <Check size={16} />
                <span className="text-sm font-medium">Answer saved automatically</span>
              </div>
            </motion.div>
          )}

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500">
              Your answers are saved automatically. You can go back to previous questions anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}