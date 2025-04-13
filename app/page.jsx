'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      {/* Main content container */}
      <div className="max-w-2xl w-full text-center">
        {/* Title */}
        <h1 
          className={`text-4xl md:text-6xl font-bold mb-16 transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Sheltr.
        </h1>

        {/* Placeholder image area with diagonal lines */}
        <div 
          className={`w-full aspect-video mb-16 rounded-2xl bg-gray-100 transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          // style={{
          //   backgroundImage: 
          // }}

        >
          <Image src="/pgae.png" alt="Shelter" fill />
        </div>

        {/* Description text */}
        <p 
          className={`text-lg md:text-xl text-gray-500 mb-10 transition-opacity duration-500 delay-200 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          When disaster strikes, seconds matter. <br />
          Our app gives real-time alerts, locates the nearest shelters, and even works offline — powered by AI to predict risk before it hits.
        </p>

        {/* CTA Button */}
        <div 
          className={`transition-opacity duration-500 delay-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link 
            href="/dashboard" 
            className="inline-block bg-black text-white py-3 px-8 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}