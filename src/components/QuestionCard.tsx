import { useState, useEffect } from 'react';
import { Question } from '@/types';
import { CIRCUIT_OVERSEER_NAME } from '@/data/questions';

interface QuestionCardProps {
  question: Question;
  initialAnswer?: string;
  onAnswerChange: (answer: string) => void;
}

export default function QuestionCard({ question, initialAnswer = '', onAnswerChange }: QuestionCardProps) {
  const [answer, setAnswer] = useState(initialAnswer);

  useEffect(() => {
    setAnswer(initialAnswer);
  }, [initialAnswer, question.id]);

  const handleAnswerChange = (newAnswer: string) => {
    setAnswer(newAnswer);
    onAnswerChange(newAnswer);
  };

  const displayQuestion = question.question.replace('[Name]', CIRCUIT_OVERSEER_NAME);

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 flex-1">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'short-answer':
        return (
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-colors"
            rows={4}
          />
        );

      case 'creative-response':
        return (
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Be creative with your response..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-colors"
            rows={5}
          />
        );

      default:
        return null;
    }
  };

  const getQuestionTypeLabel = () => {
    switch (question.type) {
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'short-answer':
        return 'Short Answer';
      case 'creative-response':
        return 'Creative Response';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {getQuestionTypeLabel()}
          </span>
          <span className="text-sm text-gray-500">Question {question.id}</span>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {displayQuestion}
        </h2>
      </div>

      <div className="mt-6">
        {renderQuestionInput()}
      </div>

      {answer && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">✓ Answer saved</p>
        </div>
      )}
    </div>
  );
}