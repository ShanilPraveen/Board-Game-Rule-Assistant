'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import LoadingDots from '@/components/LoadingDots';
import { useGameStore } from '@/lib/store';
import { uploadRulebook } from '@/lib/api';
import { Easing } from 'framer-motion';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { gameName, setSessionId } = useGameStore();

  // Redirect if no game name
  if (!gameName) {
    router.push('/game');
    return null;
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) { 
      setError('File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const response = await uploadRulebook(file, gameName);
      setSessionId(response.session_id);
      router.push('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
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
          className="max-w-lg w-full"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              📚
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upload the Rulebook PDF
            </h1>
            <p className="text-gray-600 mb-4">
              The assistant will read and understand it instantly
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              📘 {gameName}
            </div>
          </motion.div>

          {/* Upload Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Upload Area */}
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: file ? 1 : 1.02 }}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : file
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
              }`}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />

              {file ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="text-4xl">✅</div>
                  <div>
                    <p className="font-semibold text-green-700">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <p className="text-sm text-green-600">Click to change file</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl"
                  >
                    📄
                  </motion.div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      Drop your PDF here
                    </p>
                    <p className="text-gray-500">or click to browse files</p>
                  </div>
                  <p className="text-sm text-gray-400">PDF files only, max 50MB</p>
                </div>
              )}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: isUploading ? 1 : 1.02 }}
              whileTap={{ scale: isUploading ? 1 : 0.98 }}
              type="submit"
              disabled={!file || isUploading}
              className="w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <LoadingDots text="Uploading" size="md" />
              ) : (
                'Start Chatting'
              )}
            </motion.button>
          </motion.form>

          {/* Navigation */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <button
              onClick={() => router.push('/game')}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              disabled={isUploading}
            >
              ← Change game name
            </button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}