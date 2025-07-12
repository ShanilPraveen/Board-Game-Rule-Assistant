/**
 * Simple state management for the Board Game Assistant
 * Handles game name, session ID, and chat messages
 */

import { create } from 'zustand';
import { ChatMessage } from './api';

interface GameState {
  gameName: string;
  sessionId: string;
  messages: ChatMessage[];
  isLoading: boolean;
  setGameName: (name: string) => void;
  setSessionId: (id: string) => void;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameName: '',
  sessionId: '',
  messages: [],
  isLoading: false,
  setGameName: (name) => set({ gameName: name }),
  setSessionId: (id) => set({ sessionId: id }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({ 
    gameName: '', 
    sessionId: '', 
    messages: [], 
    isLoading: false 
  }),
}));