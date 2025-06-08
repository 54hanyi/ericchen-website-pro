import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#d1d5db', // gray-300
            a: { color: '#22d3ee', textDecoration: 'none' }, // cyan-400
            strong: { color: '#f3f4f6' }, // gray-100
            h1: { color: '#f3f4f6' },
            h2: { color: '#f3f4f6' },
            h3: { color: '#f3f4f6' },
            code: {
              backgroundColor: '#1f2937', // gray-800
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: '#111827', // gray-900
              padding: '1em',
              borderRadius: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
