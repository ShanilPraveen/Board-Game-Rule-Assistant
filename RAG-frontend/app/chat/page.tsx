'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ChatBubble from '@/components/ChatBubble';
import LoadingDots from '@/components/LoadingDots';
import { useGameStore } from '@/lib/store';
import { askQuestion, endSession, generateMessageId, ChatMessage } from '@/lib/api';
import { set } from 'date-fns';

export default function ChatPage() {
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { gameName, sessionId, messages, addMessage, setLoading, reset } = useGameStore();
  const [hasWelcomed, setHasWelcomed] = useState(false);

  // Redirect if no session
  // if (!gameName || !sessionId) {
  //   router.push('/game');
  //   return null;
  // }
  useEffect(() => {
  if (!gameName || !sessionId) {
    router.push('/game');
  }
  }, [gameName, sessionId]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message if no messages exist
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: `Hello! I've read the ${gameName} rulebook and I'm ready to answer your questions. What would you like to know?`,
        timestamp: new Date(),
      };
      addMessage(welcomeMessage);
      setHasWelcomed(true);
    }
  }, [messages.length, gameName, addMessage,hasWelcomed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || isAsking) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'user',
      content: question.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setQuestion('');
    setIsAsking(true);

    try {
      const response = await askQuestion(sessionId, question.trim());
      
      const aiMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: response.answer,
        sources: response.sources?.map((source) => ({
          source: source.source,
          page: source.page,
        })),
        timestamp: new Date(),
      };

      addMessage(aiMessage);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsAsking(false);
      inputRef.current?.focus();
    }
  };

  const handleEndSession = async () => {
    try {
      await endSession(sessionId);
    } catch (error) {
      console.error('Error ending session:', error);
    } finally {
      reset();
      router.push('/');
    }
  };

  const suggestedQuestions = [
    'How do I set up the game?',
    'What are the winning conditions?',
    'How does trading work?',
    'What happens when I roll a 7?',
  ];

  return (
    <Layout className="bg-gray-50">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white shadow-sm border-b px-4 py-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              🎲
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{gameName}</h1>
              <p className="text-sm text-gray-500">Rule Assistant</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEndSession}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            End Session
          </motion.button>
        </motion.header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                />
              ))}
            </AnimatePresence>

            {/* Thinking indicator */}
            {isAsking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm">
                    🎲
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <LoadingDots text="Thinking" size="sm" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Questions (only show if no user messages yet) */}
        {messages.filter(m => m.type === 'user').length === 0 && !isAsking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-4"
          >
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-gray-500 mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuestion(suggestion)}
                    className="px-3 py-2 text-sm bg-white text-gray-600 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors duration-200"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Input Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-t px-4 py-4"
        >
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about trading rules in Catan..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={isAsking}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  💬
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: isAsking ? 1 : 1.05 }}
                whileTap={{ scale: isAsking ? 1 : 0.95 }}
                type="submit"
                disabled={!question.trim() || isAsking}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAsking ? '...' : 'Send'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}