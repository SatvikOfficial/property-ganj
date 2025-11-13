"use client";

import React from 'react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black">
      {/* PROPERTY */}
      <div className="flex flex-col gap-6 items-center">
        <div className="flex gap-1">
          {/* P */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="b1">
                <stop stopColor="#973BED"></stop>
                <stop stopColor="#007CFF" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#b1)" 
              d="M 8,4 V 60 M 8,4 h 20 c 11,0 20,9 20,20 s -9,20 -20,20 H 8" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>

          {/* R */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="c1">
                <stop stopColor="#FFC800"></stop>
                <stop stopColor="#F0F" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#c1)" 
              d="M 8,4 V 60 M 8,4 h 20 c 11,0 20,9 20,20 s -9,20 -20,20 H 8 M 28,44 L 48,60" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>

          {/* O */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="d1">
                <stop stopColor="#00E0ED"></stop>
                <stop stopColor="#00DA72" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="10" 
              stroke="url(#d1)" 
              d="M 32 32 m 0 -27 a 27 27 0 1 1 0 54 a 27 27 0 1 1 0 -54" 
              className="animate-spin" 
              pathLength="360"
            ></path>
          </svg>

          {/* P */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="b1b">
                <stop stopColor="#973BED"></stop>
                <stop stopColor="#007CFF" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#b1b)" 
              d="M 8,4 V 60 M 8,4 h 20 c 11,0 20,9 20,20 s -9,20 -20,20 H 8" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>

          {/* E */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="c1b">
                <stop stopColor="#FFC800"></stop>
                <stop stopColor="#F0F" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#c1b)" 
              d="M 8,4 V 60 M 8,4 H 48 M 8,32 H 40 M 8,60 H 48" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>

          {/* R */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="d1b">
                <stop stopColor="#00E0ED"></stop>
                <stop stopColor="#00DA72" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#d1b)" 
              d="M 8,4 V 60 M 8,4 h 20 c 11,0 20,9 20,20 s -9,20 -20,20 H 8 M 28,44 L 48,60" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>

          {/* T */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="b1c">
                <stop stopColor="#973BED"></stop>
                <stop stopColor="#007CFF" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#b1c)" 
              d="M 4,4 H 60 M 32,4 V 60" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>

          {/* Y */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="c1c">
                <stop stopColor="#FFC800"></stop>
                <stop stopColor="#F0F" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#c1c)" 
              d="M 4,4 L 32,32 L 60,4 M 32,32 V 60" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>
        </div>

        {/* GANJ */}
        <div className="flex gap-1">
          {/* G */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="b2">
                <stop stopColor="#973BED"></stop>
                <stop stopColor="#007CFF" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#b2)" 
              d="M 54,8 C 47,4 39,4 32,4 C 16,4 4,16 4,32 C 4,48 16,60 32,60 C 48,60 60,48 60,32 V 32 H 36 V 40 H 52 C 50,50 42,56 32,56 C 20,56 10,46 10,32 C 10,20 20,10 32,10 C 38,10 43,12 47,16" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>

          {/* A */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="c2">
                <stop stopColor="#FFC800"></stop>
                <stop stopColor="#F0F" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#c2)" 
              d="M 8,60 L 32,4 L 56,60 M 16,42 H 48" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>

          {/* N */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="d2">
                <stop stopColor="#00E0ED"></stop>
                <stop stopColor="#00DA72" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#d2)" 
              d="M 8,60 V 4 L 56,60 V 4" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>

          {/* J */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="b2b">
                <stop stopColor="#973BED"></stop>
                <stop stopColor="#007CFF" offset="1"></stop>
              </linearGradient>
            </defs>
            <path 
              strokeLinejoin="round" 
              strokeLinecap="round" 
              strokeWidth="8" 
              stroke="url(#b2b)" 
              d="M 48,4 V 44 C 48,54 40,60 32,60 C 24,60 16,54 16,44 V 36" 
              className="animate-dash" 
              pathLength="360"
            ></path>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes dashArray {
          0% { stroke-dasharray: 0 1 359 0; }
          50% { stroke-dasharray: 0 359 1 0; }
          100% { stroke-dasharray: 359 1 0 0; }
        }

        @keyframes spinDashArray {
          0% { stroke-dasharray: 270 90; }
          50% { stroke-dasharray: 0 360; }
          100% { stroke-dasharray: 270 90; }
        }

        @keyframes dashOffset {
          0% { stroke-dashoffset: 365; }
          100% { stroke-dashoffset: 5; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          12.5%, 25% { transform: rotate(270deg); }
          37.5%, 50% { transform: rotate(540deg); }
          62.5%, 75% { transform: rotate(810deg); }
          87.5%, 100% { transform: rotate(1080deg); }
        }

        .animate-dash {
          animation: dashArray 2s ease-in-out infinite, dashOffset 2s linear infinite;
        }

        .animate-spin {
          animation: spinDashArray 2s ease-in-out infinite, spin 8s ease-in-out infinite, dashOffset 2s linear infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
};

export default Preloader;