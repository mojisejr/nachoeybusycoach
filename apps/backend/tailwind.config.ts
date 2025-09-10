import type { Config } from 'tailwindcss'

// Backend-specific Tailwind configuration
const config: Config & {
  daisyui?: {
    themes: string[]
    base: boolean
    utils: boolean
    logs: boolean
    rtl: boolean
  }
} = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        thai: ['Sarabun', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          primary: '#FF1616',
          secondary: '#990D0D',
          accent: '#FF4444'
        }
      }
    }
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('daisyui'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography')
  ],
  daisyui: {
    themes: ['nachoeybusycoach'],
    base: true,
    utils: true,
    logs: false,
    rtl: false
  }
}

export default config