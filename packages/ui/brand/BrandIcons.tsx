import React from 'react';
import { cn } from '../utils/cn';

// Icon size variants
const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10'
} as const;

type IconSize = keyof typeof iconSizes;

interface IconProps {
  size?: IconSize;
  className?: string;
  'aria-label'?: string;
}

// Running and fitness related icons
export const RunningIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Running'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

export const TimerIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Timer'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Calendar'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Trophy'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);

// User and communication icons
export const UserIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'User'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Users'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Chat'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

// Navigation and UI icons
export const HomeIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Home'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

export const DashboardIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Dashboard'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Settings'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// Action icons
export const PlusIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Add'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Edit'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Delete'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// Status icons
export const CheckIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Check'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Close'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const AlertIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'Alert'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

// External link icons
export const ExternalLinkIcon: React.FC<IconProps> = ({ size = 'md', className, 'aria-label': ariaLabel }) => (
  <svg
    className={cn(iconSizes[size], className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label={ariaLabel || 'External Link'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

// Collection of all icons for easy access
export const BrandIcons = {
  // Running and fitness
  Running: RunningIcon,
  Timer: TimerIcon,
  Calendar: CalendarIcon,
  Trophy: TrophyIcon,
  
  // User and communication
  User: UserIcon,
  Users: UsersIcon,
  Chat: ChatIcon,
  
  // Navigation and UI
  Home: HomeIcon,
  Dashboard: DashboardIcon,
  Settings: SettingsIcon,
  
  // Actions
  Plus: PlusIcon,
  Edit: EditIcon,
  Delete: DeleteIcon,
  
  // Status
  Check: CheckIcon,
  X: XIcon,
  Alert: AlertIcon,
  
  // External
  ExternalLink: ExternalLinkIcon
};

export type { IconProps, IconSize };
export { iconSizes };