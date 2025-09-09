import React from 'react';
import { cn } from '../../utils/cn';

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className,
  collapsed = false,
  header,
  footer,
}) => {
  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Sidebar Header */}
      {header && (
        <div className={cn(
          'flex-shrink-0 p-4 border-b border-base-300',
          collapsed && 'px-2'
        )}>
          {header}
        </div>
      )}

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        <nav className={cn('p-2', collapsed && 'px-1')}>
          {children}
        </nav>
      </div>

      {/* Sidebar Footer */}
      {footer && (
        <div className={cn(
          'flex-shrink-0 p-4 border-t border-base-300',
          collapsed && 'px-2'
        )}>
          {footer}
        </div>
      )}
    </div>
  );
};

// Sidebar Item Component
export interface SidebarItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  badge?: string | number;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  children,
  icon,
  active = false,
  collapsed = false,
  onClick,
  href,
  className,
  badge,
}) => {
  const baseClasses = cn(
    'flex items-center w-full px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors',
    'hover:bg-base-300 hover:text-base-content',
    active
      ? 'bg-primary text-primary-content'
      : 'text-base-content/70',
    collapsed ? 'justify-center px-2' : 'justify-start',
    className
  );

  const content = (
    <>
      {/* Icon */}
      {icon && (
        <div className={cn(
          'flex-shrink-0',
          !collapsed && 'mr-3'
        )}>
          {icon}
        </div>
      )}

      {/* Text */}
      {!collapsed && (
        <span className="flex-1 truncate">
          {children}
        </span>
      )}

      {/* Badge */}
      {badge && !collapsed && (
        <span className="ml-2 px-2 py-0.5 text-xs bg-base-300 text-base-content rounded-full">
          {badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick}>
      {content}
    </button>
  );
};

// Sidebar Group Component
export interface SidebarGroupProps {
  children: React.ReactNode;
  title?: string;
  collapsed?: boolean;
  className?: string;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  children,
  title,
  collapsed = false,
  className,
}) => {
  return (
    <div className={cn('mb-4', className)}>
      {/* Group Title */}
      {title && !collapsed && (
        <div className="px-3 py-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider">
          {title}
        </div>
      )}

      {/* Group Items */}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;