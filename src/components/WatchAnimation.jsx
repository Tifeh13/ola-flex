import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const prefersReducedMotion = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function WatchAnimation({ className = '' }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-6, 6]), {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const lightX = useSpring(useTransform(mouseX, [-300, 300], [-30, 30]), {
    stiffness: 80,
    damping: 25,
  });
  const lightY = useSpring(useTransform(mouseY, [-300, 300], [-30, 30]), {
    stiffness: 80,
    damping: 25,
  });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      setIsHovered(false);
    };

    const handleMouseEnter = () => setIsHovered(true);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className={`relative perspective-[1000px] ${className}`}
    >
      <motion.div
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
        }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative"
      >
        <svg
          viewBox="0 0 400 500"
          className="w-full max-w-[320px] mx-auto"
          style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.12)) drop-shadow(0 8px 20px rgba(0,0,0,0.08))' }}
        >
          {/* Band top */}
          <rect x="160" y="20" width="80" height="120" rx="6" fill="#2C2820" stroke="#3D3529" strokeWidth="1" />
          <rect x="165" y="30" width="70" height="100" rx="3" fill="#342E24" />
          <line x1="170" y1="35" x2="170" y2="125" stroke="#4A4035" strokeWidth="0.5" strokeDasharray="4 3" />
          <line x1="230" y1="35" x2="230" y2="125" stroke="#4A4035" strokeWidth="0.5" strokeDasharray="4 3" />

          {/* Band bottom */}
          <rect x="160" y="360" width="80" height="120" rx="6" fill="#2C2820" stroke="#3D3529" strokeWidth="1" />
          <rect x="165" y="370" width="70" height="100" rx="3" fill="#342E24" />
          <line x1="170" y1="375" x2="170" y2="465" stroke="#4A4035" strokeWidth="0.5" strokeDasharray="4 3" />
          <line x1="230" y1="375" x2="230" y2="465" stroke="#4A4035" strokeWidth="0.5" strokeDasharray="4 3" />

          {/* Watch case outer */}
          <circle cx="200" cy="240" r="105" fill="#F5F0E5" stroke="#D5D0C5" strokeWidth="2" />
          {/* Case ring */}
          <circle cx="200" cy="240" r="100" fill="#FFFFFF" stroke="#B8973E" strokeWidth="1.5" opacity="0.95" />
          {/* Bezel */}
          <circle cx="200" cy="240" r="95" fill="#FAFAF7" stroke="#E8E4DB" strokeWidth="1" />
          {/* Dial */}
          <circle cx="200" cy="240" r="85" fill="#FFFFFF" />

          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const inner = i % 3 === 0 ? 68 : 73;
            const outer = 80;
            return (
              <line
                key={i}
                x1={200 + inner * Math.cos(angle)}
                y1={240 + inner * Math.sin(angle)}
                x2={200 + outer * Math.cos(angle)}
                y2={240 + outer * Math.sin(angle)}
                stroke={i % 3 === 0 ? '#B8973E' : '#C5C0B5'}
                strokeWidth={i % 3 === 0 ? '2.5' : '1'}
                strokeLinecap="round"
              />
            );
          })}

          {/* Minute ticks */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 === 0) return null;
            const angle = (i * 6 - 90) * (Math.PI / 180);
            return (
              <line
                key={`t${i}`}
                x1={200 + 77 * Math.cos(angle)}
                y1={240 + 77 * Math.sin(angle)}
                x2={200 + 80 * Math.cos(angle)}
                y2={240 + 80 * Math.sin(angle)}
                stroke="#DDD8CC"
                strokeWidth="0.5"
              />
            );
          })}

          {/* OLAFLEX text on dial */}
          <text x="200" y="205" textAnchor="middle" fill="#1A1A1A" fontSize="7" fontFamily="serif" letterSpacing="3" fontWeight="600">
            OLAFLEX
          </text>
          <text x="200" y="215" textAnchor="middle" fill="#8A8A8A" fontSize="4.5" fontFamily="sans-serif" letterSpacing="1.5">
            AUTOMATIC
          </text>

          {/* Date window */}
          <rect x="252" y="234" width="22" height="14" rx="2" fill="#F5F3EE" stroke="#E8E4DB" strokeWidth="0.5" />
          <text x="263" y="244" textAnchor="middle" fill="#1A1A1A" fontSize="9" fontFamily="sans-serif">
            26
          </text>

          {/* Hour hand */}
          <line x1="200" y1="240" x2="200" y2="185" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" />
          {/* Minute hand */}
          <line x1="200" y1="240" x2="228" y2="200" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          {/* Second hand */}
          <line x1="200" y1="255" x2="195" y2="178" stroke="#B8973E" strokeWidth="0.8" strokeLinecap="round" />
          {/* Center cap */}
          <circle cx="200" cy="240" r="4" fill="#B8973E" />
          <circle cx="200" cy="240" r="2" fill="#FFFFFF" />

          {/* Crown */}
          <rect x="302" y="233" width="14" height="14" rx="3" fill="#E8E4DB" stroke="#B8973E" strokeWidth="1" />
          <line x1="305" y1="237" x2="313" y2="237" stroke="#B8973E" strokeWidth="0.5" opacity="0.5" />
          <line x1="305" y1="240" x2="313" y2="240" stroke="#B8973E" strokeWidth="0.5" opacity="0.5" />
          <line x1="305" y1="243" x2="313" y2="243" stroke="#B8973E" strokeWidth="0.5" opacity="0.5" />

          {/* Glass reflection */}
          <ellipse
            cx="180"
            cy="200"
            rx="50"
            ry="35"
            fill="url(#glassReflection)"
            opacity="0.12"
            transform="rotate(-20 180 200)"
          />

          <defs>
            <radialGradient id="glassReflection">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Light reflection overlay */}
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : lightX,
            y: prefersReducedMotion ? 0 : lightY,
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute top-1/4 left-1/3 w-1/3 h-1/3 rounded-full opacity-[0.06]"
            style={{
              background: 'radial-gradient(circle, white 0%, transparent 70%)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Soft ambient shadow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/5 h-8 bg-ink/[0.04] rounded-full blur-xl" />
    </div>
  );
}
