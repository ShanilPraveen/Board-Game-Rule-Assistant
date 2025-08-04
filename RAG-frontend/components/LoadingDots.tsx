/**
 * Animated loading dots component
 */

'use client';

import { motion } from 'framer-motion';

interface LoadingDotsProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingDots({ text = 'Thinking', size = 'md' }: LoadingDotsProps) {
  const dotSize = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-4, 0, -4],
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-gray-600 ${textSize[size]}`}>{text}</span>
      <motion.div
        className="flex space-x-1"
        variants={containerVariants}
        animate="animate"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${dotSize[size]} bg-blue-500 rounded-full`}
            variants={dotVariants}
          />
        ))}
      </motion.div>
    </div>
  );
}