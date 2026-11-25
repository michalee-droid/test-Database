tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'float-xp': 'floatXP 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spinSlow 8s linear infinite',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        floatXP: {
          '0%':   { opacity: '0', transform: 'translateY(10px) scale(0.8)' },
          '20%':  { opacity: '1', transform: 'translateY(-15px) scale(1.15)' },
          '80%':  { opacity: '0.9', transform: 'translateY(-45px) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-65px) scale(0.85)' },
        },
        pulseGlow: { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '0.8' } },
        spinSlow: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-12px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
};
