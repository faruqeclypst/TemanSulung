import React from 'react';

export const BackgroundDoodles: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-30">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="doodle-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Bungong Jeumpa Flower Doodle 1 */}
            <g transform="translate(30, 30)" stroke="#f43f5e" strokeWidth="1.8" fill="none">
              <circle cx="0" cy="0" r="4" fill="#fb7185" />
              <path d="M0-12 C-4-6 -4 0 0 0 C4 0 4-6 0-12 Z" />
              <path d="M0 12 C-4 6 -4 0 0 0 C4 0 4 6 0 12 Z" />
              <path d="M-12 0 C-6-4 0-4 0 0 C0 4-6 4-12 0 Z" />
              <path d="M12 0 C6-4 0-4 0 0 C0 4 6 4 12 0 Z" />
            </g>

            {/* Heart Doodle 1 */}
            <path
              d="M135 25 C135 20 140 16 145 20 C150 16 155 20 155 25 C155 33 145 40 145 40 C145 40 135 33 135 25 Z"
              fill="#fb7185"
              fillOpacity="0.3"
              stroke="#f43f5e"
              strokeWidth="1.5"
            />

            {/* Sparkle / Star Doodle 1 */}
            <path
              d="M100 30 L103 38 L111 41 L103 44 L100 52 L97 44 L89 41 L97 38 Z"
              fill="#c084fc"
              fillOpacity="0.4"
              stroke="#a855f7"
              strokeWidth="1.2"
            />

            {/* Cute Open Book Doodle */}
            <g transform="translate(140, 130)" stroke="#9333ea" strokeWidth="1.5" fill="none">
              <path d="M-12 5 C-6 2 0 5 0 5 C0 5 6 2 12 5 L12 -6 C6 -9 0 -6 0 -6 C0 -6 -6 -9 -12 -6 Z" />
              <line x1="0" y1="5" x2="0" y2="-6" />
            </g>

            {/* Graduation Cap Doodle */}
            <g transform="translate(30, 140)" stroke="#e11d48" strokeWidth="1.5" fill="none">
              <polygon points="0,-8 12,-2 0,4 -12,-2" />
              <path d="M-7,1 L-7,6 C0,9 7,9 7,6 L7,1" />
              <line x1="9" y1="-0.5" x2="9" y2="7" />
            </g>

            {/* Bungong Jeumpa Flower Doodle 2 */}
            <g transform="translate(170, 75)" stroke="#ec4899" strokeWidth="1.8" fill="none">
              <circle cx="0" cy="0" r="3.5" fill="#f472b6" />
              <path d="M0-10 C-3-5 -3 0 0 0 C3 0 3-5 0-10 Z" />
              <path d="M0 10 C-3 5 -3 0 0 0 C3 0 3 5 0 10 Z" />
              <path d="M-10 0 C-5-3 0-3 0 0 C0 3-5 3-10 0 Z" />
              <path d="M10 0 C5-3 0-3 0 0 C0 3 5 3 10 0 Z" />
            </g>

            {/* Sparkle Star Doodle 2 */}
            <path
              d="M35 85 L37 91 L43 93 L37 95 L35 101 L33 95 L27 93 L33 91 Z"
              fill="#f43f5e"
              fillOpacity="0.4"
              stroke="#e11d48"
              strokeWidth="1.2"
            />

            {/* Small Floating Circles / Petals */}
            <circle cx="85" cy="85" r="3" fill="#f43f5e" />
            <circle cx="15" cy="80" r="2.5" fill="#a855f7" />
            <circle cx="80" cy="155" r="3" fill="#ec4899" />
            <circle cx="120" cy="175" r="2.5" fill="#fb7185" />
            <circle cx="180" cy="20" r="3" fill="#c084fc" />

            {/* Cute Cloud Doodle */}
            <path
              d="M75 125 Q70 120 75 115 Q82 110 88 115 Q95 110 100 115 Q105 120 100 125 Z"
              stroke="#fb7185"
              strokeWidth="1.5"
              fill="#fff"
              fillOpacity="0.5"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#doodle-pattern)" />
      </svg>
    </div>
  );
};
