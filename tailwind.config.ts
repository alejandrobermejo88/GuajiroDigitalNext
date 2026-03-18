import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F7F4EE',
        surface: '#F0EDE6',
        paper: '#FEFCF8',
        ink: '#151515',
        'ink-soft': '#383838',
        muted: '#767676',
        line: '#E0D9CC',
        'line-strong': '#C8BFB0',
        accent: '#6B1F1F',
        'accent-mid': '#8B3232',
        'accent-faint': '#F3EFE6',
        'dark-bg': '#141414',
        'dark-surface': '#1C1C1C',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'headline': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'subheadline': ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'caption': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'label': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.12em' }],
      },
      maxWidth: {
        'prose-narrow': '34rem',
        'prose-standard': '42rem',
        'editorial': '1100px',
        'wide': '1280px',
      },
      borderColor: {
        DEFAULT: '#E0D9CC',
      },
    },
  },
  plugins: [],
}

export default config
