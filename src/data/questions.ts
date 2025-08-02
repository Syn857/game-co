import { Question } from '@/types';

export const questions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: "What's [Name]'s favorite way to start his talks?",
    options: [
      'With a warm smile and greeting',
      'With an interesting illustration',
      'With a scripture reading',
      'With a personal experience'
    ]
  },
  {
    id: 2,
    type: 'short-answer',
    question: "What's the most memorable piece of advice [Name] has shared with our congregation?"
  },
  {
    id: 3,
    type: 'creative-response',
    question: "If [Name] were a Bible character, who would he be and why?"
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: "What's [Name]'s go-to scripture for encouragement?",
    options: [
      'Philippians 4:13',
      'Isaiah 41:10',
      'Romans 8:28',
      'Jeremiah 29:11'
    ]
  },
  {
    id: 5,
    type: 'short-answer',
    question: "What's your favorite memory from one of [Name]'s visits?"
  },
  {
    id: 6,
    type: 'multiple-choice',
    question: "How would you describe [Name]'s speaking style?",
    options: [
      'Gentle and encouraging',
      'Enthusiastic and energetic',
      'Practical and down-to-earth',
      'Thoughtful and deep'
    ]
  },
  {
    id: 7,
    type: 'creative-response',
    question: "Complete this sentence: '[Name] always reminds us that...'"
  },
  {
    id: 8,
    type: 'short-answer',
    question: "What quality of [Name] would you most like to develop in yourself?"
  },
  {
    id: 9,
    type: 'multiple-choice',
    question: "What's [Name]'s favorite part of circuit work?",
    options: [
      'Meeting new friends',
      'Encouraging the brothers and sisters',
      'Sharing in the ministry',
      'Building up congregations'
    ]
  },
  {
    id: 10,
    type: 'creative-response',
    question: "What message would you like to leave for [Name] as he moves to his new assignment?"
  }
];

export const CIRCUIT_OVERSEER_NAME = 'Brother Desmond'; // This can be customized
export const ADMIN_PASSWORD = 'farewell2024'; // This should be changed for production
