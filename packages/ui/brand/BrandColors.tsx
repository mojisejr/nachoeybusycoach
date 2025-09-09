import React from 'react';
import { cn } from '../utils/cn';

// Brand colors from COLOR.md
const brandColors = {
  primary: {
    name: 'Primary',
    colors: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main primary
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    }
  },
  secondary: {
    name: 'Secondary',
    colors: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef', // Main secondary
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75'
    }
  },
  accent: {
    name: 'Accent',
    colors: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Main accent
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12'
    }
  },
  neutral: {
    name: 'Neutral',
    colors: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    }
  },
  success: {
    name: 'Success',
    colors: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main success
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    }
  },
  warning: {
    name: 'Warning',
    colors: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    }
  },
  error: {
    name: 'Error',
    colors: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main error
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    }
  }
};

interface ColorSwatchProps {
  name: string;
  value: string;
  shade: string;
  isMain?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, value, shade, isMain }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div
      className={cn(
        'group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200',
        'hover:scale-105 hover:shadow-lg',
        isMain && 'ring-2 ring-offset-2 ring-primary'
      )}
      onClick={copyToClipboard}
      title={`Click to copy ${value}`}
    >
      <div
        className="h-16 w-full"
        style={{ backgroundColor: value }}
      />
      <div className="p-2 bg-white">
        <div className="text-xs font-medium text-gray-900">
          {shade}
          {isMain && <span className="ml-1 text-primary">●</span>}
        </div>
        <div className="text-xs text-gray-500 font-mono">
          {value}
        </div>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          Copy
        </div>
      </div>
    </div>
  );
};

interface ColorPaletteProps {
  name: string;
  colors: Record<string, string>;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ name, colors }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{name}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
        {Object.entries(colors).map(([shade, value]) => (
          <ColorSwatch
            key={shade}
            name={name}
            shade={shade}
            value={value}
            isMain={shade === '500'}
          />
        ))}
      </div>
    </div>
  );
};

interface BrandColorsProps {
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

const BrandColors: React.FC<BrandColorsProps> = ({ 
  className, 
  showTitle = true, 
  compact = false 
}) => {
  return (
    <div className={cn('w-full', className)}>
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Brand Color Palette
          </h2>
          <p className="text-gray-600">
            Click on any color to copy its hex value to clipboard
          </p>
        </div>
      )}
      
      <div className={cn('space-y-6', compact && 'space-y-4')}>
        {Object.entries(brandColors).map(([key, { name, colors }]) => (
          <ColorPalette
            key={key}
            name={name}
            colors={colors}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Usage Guidelines</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Primary (Blue): Main brand color for buttons, links, and key elements</li>
          <li>• Secondary (Purple): Accent color for highlights and secondary actions</li>
          <li>• Accent (Orange): Call-to-action elements and important notifications</li>
          <li>• Neutral (Gray): Text, borders, and background elements</li>
          <li>• Success (Green): Success states, confirmations, and positive feedback</li>
          <li>• Warning (Yellow): Warnings, cautions, and pending states</li>
          <li>• Error (Red): Error states, destructive actions, and alerts</li>
        </ul>
      </div>
    </div>
  );
};

export default BrandColors;
export { brandColors, ColorSwatch, ColorPalette };
export type { BrandColorsProps, ColorSwatchProps, ColorPaletteProps };