'use client'

import styles from './welcome.module.css';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';


const Welcome = () => {
  // const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [lightningActive, setLightningActive] = useState(false);
  const containerRef = useRef(null);
   // Check if device is mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
   
    // Check on initial load
    checkMobile();
   
    // Add resize listener
    window.addEventListener('resize', checkMobile);
   
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
 
 
  // Handle animations on initial load
  useEffect(() => {
    // Trigger animations sequence
    setLoaded(true);
   
    // Show CTA after delay
    const ctaTimer = setTimeout(() => {
      setShowCta(true);
    }, 1800);
   
    // Random lightning effect
    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of lightning
        setLightningActive(true);
        setTimeout(() => setLightningActive(false), 200);
      }
    }, 5000);
   
    return () => {
      clearTimeout(ctaTimer);
      clearInterval(lightningInterval);
    };
  }, []);
 
 
  // Handle mouse movement for dynamic particle effect
  useEffect(() => {
    if (isMobile) return; // Skip on mobile devices
   
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
     
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
     
      setMousePosition({ x, y });
    };
 
 
    window.addEventListener('mousemove', handleMouseMove);
   
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);
 
 
  // Generate particles with dynamic properties
  const renderParticles = () => {
    // Fewer particles on mobile
    const particleCount = isMobile ? 15 : 30;
    const particles = [];
   
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * (isMobile ? 10 : 15) + 3;
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.5 + 0.1;
     
      particles.push(
        <div
          key={i}
          className={styles.particle}
          style={{
            top: `${initialY}%`,
            left: `${initialX}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            transform: loaded ? 'scale(1)' : 'scale(0)'
          }}
        />
      );
    }
   
    return particles;
  };
 
 
  // Generate raindrops
  const renderRain = () => {
    if (isMobile) return null; // Skip rain on mobile for performance
   
    const dropCount = 50;
    const raindrops = [];
   
    for (let i = 0; i < dropCount; i++) {
      const initialX = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const height = Math.random() * 15 + 5;
      const duration = Math.random() * 1.5 + 0.5;
      const delay = Math.random() * 5;
     
      raindrops.push(
        <div
          key={i}
          className={styles.rainDrop}
          style={{
            left: `${initialX}%`,
            width: `${size}px`,
            height: `${height}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`
          }}
        />
      );
    }
   
    return raindrops;
  };
 
 
  // Generate wind gusts
  const renderWindGusts = () => {
    if (isMobile) return null; // Skip on mobile for performance
   
    const gustCount = 10;
    const gusts = [];
   
    for (let i = 0; i < gustCount; i++) {
      const posY = Math.random() * 100;
      const width = Math.random() * 30 + 20;
      const height = Math.random() * 3 + 1;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 10;
     
      gusts.push(
        <div
          key={i}
          className={styles.windGust}
          style={{
            top: `${posY}%`,
            width: `${width}%`,
            height: `${height}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`
          }}
        />
      );
    }
   
    return gusts;
  };
 
 
  // Create interactive particle that follows mouse (desktop only)
  const getInteractiveParticleStyle = () => {
    if (isMobile || !mousePosition.x || !mousePosition.y) return { display: 'none' };
   
    return {
      left: `${mousePosition.x}px`,
      top: `${mousePosition.y}px`,
      transition: 'transform 0.1s, opacity 0.3s',
      transform: 'translate(-50%, -50%)',
      opacity: 0.7
    };
  };
 
 
  // // Handle the dashboard navigation
  // const navigateToDashboard = () => {
  //   router.push('/dashboard');
  // };
 
 
  return (
    <div
      ref={containerRef}
      className={`min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden ${styles.container}`}
    >
      {/* Hurricane overlay effect */}
      <div className={styles.hurricaneOverlay}></div>
     
      {/* Lightning effect */}
      <div className={styles.lightning} style={{ opacity: lightningActive ? 0.8 : 0 }}></div>
     
      {/* Background particles, rain and wind */}
      <div className="absolute inset-0 overflow-hidden">
        {renderParticles()}
        {renderRain()}
        {renderWindGusts()}
       
        {/* Interactive particle that follows cursor (desktop only) */}
        <div
          className={`${styles.particle} absolute w-20 h-20 pointer-events-none`}
          style={{
            ...getInteractiveParticleStyle(),
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(16, 85, 210, 0.3) 70%, transparent 100%)',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
            zIndex: 1
          }}
        />
      </div>
 
 
      {/* Animated hurricane logo */}
      <div className={`relative mb-10 md:mb-16 ${styles.logo}`}>
        <div className={`relative w-56 h-56 md:w-72 md:h-72 rounded-full flex items-center justify-center ${styles.spinBand}`}>
          <div className="absolute w-full h-full rounded-full border-4 border-blue-500/30 border-t-blue-400"></div>
          <div className="absolute w-[90%] h-[90%] rounded-full border-4 border-blue-400/40 border-t-blue-300 animate-[spin_25s_linear_infinite]"></div>
          <div className="absolute w-[80%] h-[80%] rounded-full border-4 border-blue-300/50 border-t-blue-200 animate-[spin_20s_linear_infinite_reverse]"></div>
          <div className="absolute w-[70%] h-[70%] rounded-full border-4 border-blue-200/60 border-t-blue-100 animate-[spin_15s_linear_infinite]"></div>
          <div className="absolute w-[60%] h-[60%] rounded-full border-4 border-blue-100/70 border-t-white animate-[spin_10s_linear_infinite_reverse]"></div>
          <div className={`absolute w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-900/80 to-indigo-900/80 backdrop-blur-sm
                         flex items-center justify-center shadow-2xl ${styles.hurricaneEye}`}>
            <div className={`text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white
                           transition-all duration-1000 ${loaded ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              S
            </div>
          </div>
        </div>
       
        {/* Additional animated spiral bands */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/10 border-dashed animate-[spin_40s_linear_infinite]"></div>
        <div className="absolute inset-5 rounded-full border-2 border-blue-400/10 border-dashed animate-[spin_35s_linear_infinite_reverse]"></div>
      </div>
 
 
      {/* Text content with animations */}
      <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto">
        <h1 className={`text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 ${styles.heroTitle} transition-all duration-1000
                       ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">Sheltr</span>
        </h1>
       
        <p className={`text-lg sm:text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto mb-8 md:mb-12 ${styles.heroText} transition-all duration-1000 delay-500
                     ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Your safeguard against hurricanes and natural disasters - find shelter, stay informed, and connect with emergency services when every second counts.
        </p>
       
        <div className={`transition-all duration-1000 delay-1000
                       ${showCta ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
          <Link href="/dashboard" className="inline-block relative group">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></span>
            <button
              onClick={( )=>{}}
              className={`relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-lg md:text-xl font-semibold
                       transition-all duration-300 group-hover:shadow-[0_0_15px_5px_rgba(59,130,246,0.5)] active:scale-95 ${styles.actionButton}`}
            >
              Find Shelter Now
            </button>
          </Link>
        </div>
      </div>
 
 
      {/* Animated waves at bottom to represent storm surge */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className={styles.wave}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="rgba(96, 165, 250, 0.2)" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full -mt-16">
          <path fill="rgba(59, 130, 246, 0.3)" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,149.3C384,160,480,160,576,138.7C672,117,768,75,864,80C960,85,1056,139,1152,160C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full -mt-12 animate-[wave_7s_infinite_ease-in-out]">
          <path fill="rgba(59, 130, 246, 0.4)" fillOpacity="1" d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,80C672,96,768,160,864,176C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
 };
 
 
 export default Welcome;