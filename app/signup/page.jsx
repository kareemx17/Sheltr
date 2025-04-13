'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className="w-screen h-screen bg-[#D8E3EB] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-[#93AEC5] p-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-white text-center"
          >
            Sign Up
          </motion.h2>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700 font-medium block">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-700 font-medium block">
              Password
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#93AEC5] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Sign Up
          </motion.button>

          <div className="text-center space-y-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#"
              className="text-[#93AEC5] text-sm block"
            >
              Forgot your password?
            </motion.a>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-sm"
            >
              Already have an account?{' '}
              <Link href="/login" className="text-[#93AEC5] font-medium">
                Sign in
              </Link>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default SignUp;