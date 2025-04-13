"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="h-16 shadow-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="text-3xl font-bold  drop-shadow-lg">
              Sheltr
            </Link>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href="/login"
                className="px-4 py-2 transition-colors pointer-events-auto border-2 border-white rounded-md hover:bg-white/10"
              >
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href="signup"
                className="px-4 py-2 bg-[#93AEC5] text-white rounded-md transition-colors font-medium"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
