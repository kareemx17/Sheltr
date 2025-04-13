'use client';

import Link from 'next/link'
import { motion } from 'framer-motion'

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 h-16 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                   
                    <motion.div 
                        className="flex-shrink-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <h1 className="text-2xl font-bold text-white drop-shadow-lg">Sheltr</h1>
                    </motion.div>
                    
                    <div className="flex items-center space-x-4">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Link href="/login" className="px-4 py-2 text-white hover:text-yellow-200 transition-colors pointer-events-auto border-2 border-white rounded-md hover:bg-white/10">
                                Login
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Link href="signup" className="px-4 py-2 bg-white text-orange-600 rounded-md hover:bg-yellow-100 transition-colors font-medium">
                                Sign Up
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;