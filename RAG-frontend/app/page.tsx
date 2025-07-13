'use client';

import { Easing, motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function HomePage() {
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

  const imageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' as Easing },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as Easing,
      },
    },
  };

  return (
    <Layout className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24"
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <motion.div variants={itemVariants} className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    🎲 Ask Me Anything About{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Board Games
                    </span>
                  </h1>
                  <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed">
                    Upload any board game rulebook and start chatting instantly.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6">
                  <p className="text-lg text-gray-500 max-w-2xl mx-auto lg:mx-0">
                    Never get stuck on complicated rules again. Our AI assistant reads your rulebook 
                    and answers questions instantly with precise references.
                  </p>
                  
                  <Link href="/game">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      Start Exploring Rules
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-2"
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Features */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                  {[
                    { icon: '📚', title: 'Any Rulebook', desc: 'Upload PDFs of any board game' },
                    { icon: '💬', title: 'Instant Answers', desc: 'Get responses in seconds' },
                    { icon: '🎯', title: 'Precise Sources', desc: 'References with page numbers' },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm"
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right Column - Game Images */}
              <motion.div variants={imageVariants} className="relative">
                <div className="grid grid-cols-2 gap-6">
                  {/* Chess */}
                  <motion.div variants={floatingVariants} animate="animate" className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="w-16 h-16 mx-auto mb-4 text-4xl flex items-center justify-center">♔</div>
                      <h3 className="font-semibold text-center">Chess</h3>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="w-16 h-16 mx-auto mb-4 text-4xl flex items-center justify-center">🎯</div>
                      <h3 className="font-semibold text-center">Checkers</h3>
                    </div>
                  </motion.div>

                  {/* Catan & Dice */}
                  <motion.div 
                    variants={floatingVariants} 
                    animate="animate"
                    style={{ animationDelay: '1s' }}
                    className="space-y-4 mt-8"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="w-16 h-16 mx-auto mb-4 text-4xl flex items-center justify-center">🏝️</div>
                      <h3 className="font-semibold text-center">Catan</h3>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="w-16 h-16 mx-auto mb-4 text-4xl flex items-center justify-center">🎲</div>
                      <h3 className="font-semibold text-center">Dice Games</h3>
                    </div>
                  </motion.div>
                </div>

                {/* Floating Meeples */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' as Easing }}
                  className="absolute -top-4 -right-4 w-12 h-12 text-2xl flex items-center justify-center bg-yellow-400 rounded-full shadow-lg"
                >
                  🧩
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' as Easing }}
                  className="absolute -bottom-4 -left-4 w-10 h-10 text-xl flex items-center justify-center bg-green-400 rounded-full shadow-lg"
                >
                  🎪
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="py-8 text-center text-gray-500 text-sm"
        >
          <p>Powered by AI • Support for all PDF rulebooks • No registration required</p>
        </motion.footer>
      </div>
    </Layout>
  );
}