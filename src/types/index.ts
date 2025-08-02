export interface Question {
  id: number;
  type: 'multiple-choice' | 'short-answer' | 'creative-response';
  question: string;
  options?: string[];
}

export interface Answer {
  questionId: number;
  answer: string;
}

export interface Participant {
  name: string;
  answers: Answer[];
  completedAt: string;
}

export interface GameState {
  currentQuestion: number;
  participantName: string;
  answers: Answer[];
  isCompleted: boolean;
}

export interface AdminData {
  participants: Participant[];
  totalParticipants: number;
  completionRate: number;
}