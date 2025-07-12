/**
 * Chat message bubble component for user and AI messages
 */

'use client';

import { motion } from 'framer-motion';
import { ChatMessage, formatSources } from '@/lib/api';

interface ChatBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
}

export default function ChatBubble({ message, isLast = false }: ChatBubbleProps) {
  const isUser = message.type === 'user';
  
  const bubbleVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
        {/* Avatar */}
        <div className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
            isUser ? 'bg-blue-500' : 'bg-gray-600'
          }`}>
            {isUser ? 'U' : '🎲'}
          </div>
          
          {/* Message bubble */}
          <div className={`relative px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            
            {/* Sources for AI messages */}
            {!isUser && message.sources && message.sources.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {formatSources(message.sources)}
                </p>
              </div>
            )}
            
            {/* Timestamp */}
            <div className={`mt-1 text-xs ${
              isUser ? 'text-blue-200' : 'text-gray-400'
            }`}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}