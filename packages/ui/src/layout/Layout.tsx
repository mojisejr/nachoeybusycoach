import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { UserRole } from '@nachoeybusycoach/types';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
  currentPath?: string;
  showSidebar?: boolean;
  onSignOut?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  userRole,
  userName,
  currentPath,
  showSidebar = true,
  onSignOut
}) => {
  return (
    <div className="min-h-screen bg-base-100">
      <Header 
        userRole={userRole}
        userName={userName}
        onSignOut={onSignOut}
      />
      
      <div className="flex">
        {showSidebar && userRole && (
          <Sidebar 
            userRole={userRole}
            currentPath={currentPath}
          />
        )}
        
        <main className={`flex-1 p-6 ${showSidebar ? 'ml-0' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};