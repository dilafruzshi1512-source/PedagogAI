/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          primary:   '#0c1222',
          secondary: '#111b2e',
          tertiary:  '#162033',
          card:      'rgba(22, 36, 62, 0.55)',
          elevated:  'rgba(28, 45, 78, 0.65)',
          surface:   'rgba(18, 28, 48, 0.4)',
        },
        brand: {
          purple: '#818cf8',
          'purple-light': '#a5b4fc',
          'purple-faint': '#c7d2fe',
          cyan:   '#22d3ee',
          'cyan-light': '#67e8f9',
          'cyan-faint': '#a5f3fc',
          indigo: '#6366f1',
          green:  '#34d399',
          'green-light': '#6ee7b7',
          amber:  '#fbbf24',
          'amber-light': '#fcd34d',
          red:    '#fb7185',
          'red-light': '#fda4af',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          hover:   'rgba(255, 255, 255, 0.06)',
          border:  'rgba(148, 163, 184, 0.12)',
          border2: 'rgba(148, 163, 184, 0.18)',
        },
        content: {
          primary:   '#f1f5f9',
          secondary: '#94a3b8',
          muted:     '#64748b',
          inverse:   '#ffffff',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)',
        'gradient-brand-soft': 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(34,211,238,0.12) 100%)',
        'gradient-mesh': 'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(99,102,241,0.18), transparent 50%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(34,211,238,0.12), transparent 45%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(99,102,241,0.08), transparent 50%), linear-gradient(180deg, #0c1222 0%, #111b2e 45%, #0f172a 100%)',
        'gradient-purple': 'linear-gradient(135deg, #6366f1, #818cf8)',
        'gradient-green': 'linear-gradient(135deg, #10b981, #34d399)',
        'gradient-amber': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        'gradient-red': 'linear-gradient(135deg, #f43f5e, #fb7185)',
        'gradient-card-purple': 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(34,211,238,0.08))',
        'gradient-text': 'linear-gradient(135deg, #e2e8f0 0%, #a5b4fc 50%, #67e8f9 100%)',
      },
      borderRadius: {
        card: '14px',
        card_sm: '10px',
        xl: '12px',
        '2xl': '16px',
      },
      backdropBlur: {
        card: '16px',
        sidebar: '24px',
        header: '12px',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(0, 0, 0, 0.12)',
        'soft-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'glow-purple': '0 4px 20px rgba(99, 102, 241, 0.25)',
        'glow-cyan': '0 4px 20px rgba(34, 211, 238, 0.2)',
        'glow-green': '0 4px 20px rgba(52, 211, 153, 0.2)',
        'card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.15)',
        'card-hover': '0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 40px rgba(0,0,0,0.2)',
        'inner-soft': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        drift: 'drift 24s ease-in-out infinite',
        drift2: 'drift 24s ease-in-out infinite -10s',
        drift3: 'drift 24s ease-in-out infinite -18s',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(24px, -16px) scale(1.05)' },
          '66%': { transform: 'translate(-16px, 20px) scale(0.98)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
