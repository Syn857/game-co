import { Question } from '@/types';

export const questions: Question[] = [
  // ===== Brother Desmond Questions =====
  {
    id: 1,
    type: 'multiple-choice',
    question: "What's Brother Desmond's favorite way to start his talks?",
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
    question: "What's the most memorable piece of advice Brother Desmond has shared with our congregation?"
  },
  {
    id: 3,
    type: 'creative-response',
    question: "If Brother Desmond were a Bible character, who would he be and why?"
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: "What's Brother Desmond's go-to scripture for encouragement?",
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
    question: "What's your favorite memory from one of Brother Desmond's visits?"
  },

  // ===== Sister Mana Questions =====
  {
    id: 6,
    type: 'multiple-choice',
    question: "What's Sister Mana's favorite way to encourage the sisters?",
    options: [
      'Sharing a comforting scripture',
      'Giving a warm hug',
      'Offering practical help',
      'Listening patiently'
    ]
  },
  {
    id: 7,
    type: 'short-answer',
    question: "What's the most memorable example of hospitality Sister Mana has shown?"
  },
  {
    id: 8,
    type: 'creative-response',
    question: "If Sister Mana were a Bible character, who would she be and why?"
  },
  {
    id: 9,
    type: 'multiple-choice',
    question: "Which scripture does Sister Mana often quote for encouragement?",
    options: [
      'Proverbs 3:5,6',
      'Psalm 34:8',
      'Philippians 4:6,7',
      'Isaiah 40:31'
    ]
  },
  {
    id: 10,
    type: 'short-answer',
    question: "What's your favorite memory involving Sister Mana during their circuit visits?"
  }
];

export const CIRCUIT_OVERSEER_NAME = 'Brother Desmond & Sister Mana'; // This can be customized
export const ADMIN_PASSWORD = 'farewell2024'; // This should be changed for production
