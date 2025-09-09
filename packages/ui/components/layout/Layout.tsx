import React from 'react';
import { cn } from '../../utils/cn';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  sidebar,
  header,
  footer,
  sidebarCollapsed = false,
  onSidebarToggle,
}) => {
  return (
    <div className={cn('min-h-screen bg-base-100', className)}>
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-40 bg-base-100 border-b border-base-300">
          {header}
        </header>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebar && (
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-30 bg-base-200 border-r border-base-300 transition-all duration-300 ease-in-out',
              'lg:static lg:translate-x-0',
              sidebarCollapsed
                ? 'w-16 -translate-x-full lg:translate-x-0'
                : 'w-64 translate-x-0'
            )}
          >
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 min-h-screen',
            sidebar && !sidebarCollapsed && 'lg:ml-0',
            sidebar && sidebarCollapsed && 'lg:ml-0'
          )}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="bg-base-200 border-t border-base-300">
          {footer}
        </footer>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebar && !sidebarCollapsed && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onSidebarToggle}
        />
      )}
    </div>
  );
};

export default Layout;