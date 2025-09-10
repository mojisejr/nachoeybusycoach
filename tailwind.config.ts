import type { Config } from 'tailwindcss'

// Base Tailwind configuration for the monorepo
const config: Config & {
  daisyui?: {
    themes: any[]
    base: boolean
    utils: boolean
    logs: boolean
    rtl: boolean
  }
} = {
  content: [
    './apps/*/src/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/ui/**/*.{js,ts,jsx,tsx}',
    './packages/*/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        thai: ['Sarabun', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
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
    require('daisyui'),
    require('@tailwindcss/typography')
  ],
  daisyui: {
    themes: [
      {
        nachoeybusycoach: {
          // Primary colors
          "primary": "#FF1616",
          "primary-focus": "#E60000", 
          "primary-content": "#FFFFFF",
          
          // Secondary colors
          "secondary": "#990D0D",
          "secondary-focus": "#7A0A0A",
          "secondary-content": "#FFFFFF",
          
          // Accent colors
          "accent": "#FF4444",
          "accent-focus": "#FF2222",
          "accent-content": "#FFFFFF",
          
          // Neutral colors
          "neutral": "#2A2A2A",
          "neutral-focus": "#1F1F1F",
          "neutral-content": "#FFFFFF",
          
          // Base colors
          "base-100": "#FFFFFF",
          "base-200": "#F8F8F8",
          "base-300": "#E8E8E8",
          "base-content": "#1F1F1F",
          
          // State colors
          "info": "#3ABFF8",
          "info-content": "#002B3D",
          
          "success": "#36D399",
          "success-content": "#003320",
          
          "warning": "#FBBD23",
          "warning-content": "#382800",
          
          "error": "#F87272",
          "error-content": "#470000",
        },
      },
    ],
    base: true,
    utils: true,
    logs: false,
    rtl: false
  }
}

export default config