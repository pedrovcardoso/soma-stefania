module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
    './src/views/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'accent-100': 'var(--color-accent-100)',
        'accent-soft': 'var(--color-accent-soft)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        elevated: 'var(--color-elevated)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        sans: ['var(--font-primary)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

