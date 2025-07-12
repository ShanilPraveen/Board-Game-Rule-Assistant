/**
 * API helper functions for Board Game Rule Assistant
 * Handles all backend communication with FastAPI server
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UploadResponse {
  session_id: string;
  message?: string;
}

export interface AskResponse {
  answer: string;
  sources?: Array<{
    file: string;
    page: number;
  }>;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  sources?: Array<{
    file: string;
    page: number;
  }>;
  timestamp: Date;
}

/**
 * Upload a PDF rulebook file to the backend
 * @param file - PDF file to upload
 * @param gameName - Name of the board game
 * @returns Promise<UploadResponse> - Contains session_id for future requests
 */
export async function uploadRulebook(file: File, gameName: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('game_name', gameName);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Ask a question about the uploaded rulebook
 * @param sessionId - Session ID from upload response
 * @param question - User's question about the game rules
 * @returns Promise<AskResponse> - AI answer with sources
 */
export async function askQuestion(sessionId: string, question: string): Promise<AskResponse> {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      question: question,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ask failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * End the current chat session
 * @param sessionId - Session ID to terminate
 * @returns Promise<void>
 */
export async function endSession(sessionId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/end`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`End session failed: ${response.statusText}`);
  }
}

/**
 * Generate a unique message ID for chat messages
 * @returns string - Unique identifier
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format sources for display in chat bubbles
 * @param sources - Array of source references
 * @returns string - Formatted source text
 */
export function formatSources(sources?: Array<{ file: string; page: number }>): string {
  if (!sources || sources.length === 0) return '';
  
  return sources
    .map(source => `[Source: ${source.file} | Page: ${source.page}]`)
    .join(' ');
}