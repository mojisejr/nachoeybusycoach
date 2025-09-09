import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../core/Button';

export interface HeaderProps {
  className?: string;
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  userMenu?: React.ReactNode;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  logo,
  navigation,
  actions,
  userMenu,
  onMenuToggle,
  showMenuButton = false,
  title,
}) => {
  return (
    <div className={cn('flex items-center justify-between h-16 px-4 lg:px-6', className)}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        )}

        {/* Logo */}
        {logo && (
          <div className="flex items-center">
            {logo}
          </div>
        )}

        {/* Title */}
        {title && (
          <h1 className="text-lg font-semibold text-base-content">
            {title}
          </h1>
        )}

        {/* Desktop Navigation */}
        {navigation && (
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation}
          </nav>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}

        {/* User Menu */}
        {userMenu && (
          <div className="flex items-center">
            {userMenu}
          </div>
        )}
      </div>
    </div>
  );
};

// Navigation Link Component
export interface NavLinkProps {
  href?: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  active = false,
  onClick,
  className,
}) => {
  const baseClasses = cn(
    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
    'hover:bg-base-300 hover:text-base-content',
    active
      ? 'bg-primary text-primary-content'
      : 'text-base-content/70',
    className
  );

  if (href) {
    return (
      <a href={href} className={baseClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Header;