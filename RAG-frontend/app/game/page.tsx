'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useGameStore } from '@/lib/store';
import { Easing } from 'framer-motion';

export default function GamePage() {
  const [gameName, setGameName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setGameName: setStoreGameName } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameName.trim()) {
      setError('Please enter a game name');
      return;
    }

    setStoreGameName(gameName.trim());
    router.push('/upload');
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as Easing },
    },
  };

  return (
    <Layout className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="max-w-md w-full"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎲
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enter the Board Game Name
            </h1>
            <p className="text-gray-600">
              Tell us which game you'd like to explore
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={gameName}
                onChange={(e) => {
                  setGameName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Catan, Chess, Monopoly..."
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Continue
            </motion.button>
          </motion.form>

          {/* Popular Games */}
          <motion.div variants={itemVariants} className="mt-8">
            <p className="text-sm text-gray-500 text-center mb-4">Popular games:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Catan', 'Monopoly', 'Chess', 'Scrabble', 'Risk'].map((game) => (
                <motion.button
                  key={game}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameName(game)}
                  className="px-3 py-1 text-sm bg-white text-gray-600 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors duration-200"
                >
                  {game}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Back link */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              ← Back to home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}