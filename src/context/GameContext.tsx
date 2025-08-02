import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { collection, addDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GameState, Answer, Participant } from '@/types';

interface GameContextType {
  gameState: GameState;
  setParticipantName: (name: string) => void;
  saveAnswer: (questionId: number, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeGame: () => Promise<void>;
  resetGame: () => void;
  getParticipants: () => Promise<Participant[]>;
  subscribeToParticipants: (callback: (participants: Participant[]) => void) => () => void;
}

type GameAction =
  | { type: 'SET_PARTICIPANT_NAME'; payload: string }
  | { type: 'SAVE_ANSWER'; payload: { questionId: number; answer: string } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  currentQuestion: 0,
  participantName: '',
  answers: [],
  isCompleted: false
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PARTICIPANT_NAME':
      return { ...state, participantName: action.payload };
    case 'SAVE_ANSWER':
      const existingAnswerIndex = state.answers.findIndex(
        a => a.questionId === action.payload.questionId
      );
      const newAnswers = [...state.answers];
      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = action.payload;
      } else {
        newAnswers.push(action.payload);
      }
      return { ...state, answers: newAnswers };
    case 'NEXT_QUESTION':
      return { ...state, currentQuestion: state.currentQuestion + 1 };
    case 'PREVIOUS_QUESTION':
      return { ...state, currentQuestion: Math.max(0, state.currentQuestion - 1) };
    case 'COMPLETE_GAME':
      return { ...state, isCompleted: true };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const setParticipantName = (name: string) => {
    dispatch({ type: 'SET_PARTICIPANT_NAME', payload: name });
  };

  const saveAnswer = (questionId: number, answer: string) => {
    dispatch({ type: 'SAVE_ANSWER', payload: { questionId, answer } });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const previousQuestion = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const completeGame = async () => {
    try {
      const participant: Participant = {
        name: gameState.participantName,
        answers: gameState.answers,
        completedAt: new Date().toISOString()
      };
      
      console.log('Attempting to save participant to Firebase:', participant);
      const docRef = await addDoc(collection(db, 'participants'), participant);
      console.log('Successfully saved participant to Firebase with ID:', docRef.id);
      dispatch({ type: 'COMPLETE_GAME' });
    } catch (error) {
      console.error('Error saving participant data to Firebase:', error);
      console.log('Falling back to localStorage');
      // Fallback to localStorage if Firebase fails
      const existingParticipants = JSON.parse(localStorage.getItem('farewell-game-participants') || '[]');
      const updatedParticipants = [...existingParticipants, {
        name: gameState.participantName,
        answers: gameState.answers,
        completedAt: new Date().toISOString()
      }];
      localStorage.setItem('farewell-game-participants', JSON.stringify(updatedParticipants));
      dispatch({ type: 'COMPLETE_GAME' });
    }
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const getParticipants = async (): Promise<Participant[]> => {
    try {
      const q = query(collection(db, 'participants'), orderBy('completedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const participants: Participant[] = [];
      querySnapshot.forEach((doc) => {
        participants.push(doc.data() as Participant);
      });
      return participants;
    } catch (error) {
      console.error('Error fetching participants from Firebase:', error);
      // Fallback to localStorage only if Firebase fails
      return JSON.parse(localStorage.getItem('farewell-game-participants') || '[]');
    }
  };

  const subscribeToParticipants = (callback: (participants: Participant[]) => void) => {
    console.log('Setting up Firebase subscription for participants');
    const q = query(collection(db, 'participants'), orderBy('completedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Firebase subscription triggered, documents count:', querySnapshot.size);
      const participants: Participant[] = [];
      querySnapshot.forEach((doc) => {
        console.log('Document data:', doc.data());
        participants.push(doc.data() as Participant);
      });
      console.log('Calling callback with participants:', participants.length);
      callback(participants);
    }, (error) => {
      console.error('Error in Firebase subscription:', error);
      console.log('Falling back to localStorage for subscription');
      // Fallback to localStorage on error
      const localParticipants = JSON.parse(localStorage.getItem('farewell-game-participants') || '[]');
      callback(localParticipants);
    });
    
    return unsubscribe;
  };

  return (
    <GameContext.Provider value={{
      gameState,
      setParticipantName,
      saveAnswer,
      nextQuestion,
      previousQuestion,
      completeGame,
      resetGame,
      getParticipants,
      subscribeToParticipants
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}