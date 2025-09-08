import React from 'react';
import { UserRole } from '@nachoeybusycoach/types';

interface HeaderProps {
  userRole?: UserRole;
  userName?: string;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  userRole, 
  userName, 
  onSignOut 
}) => {
  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><a href="/dashboard">Dashboard</a></li>
            {userRole === 'coach' && (
              <>
                <li><a href="/runners">Runners</a></li>
                <li><a href="/plans">Training Plans</a></li>
              </>
            )}
            {userRole === 'runner' && (
              <>
                <li><a href="/training">My Training</a></li>
                <li><a href="/progress">Progress</a></li>
              </>
            )}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl font-bold text-primary">
          นาเชยไม่เคยมีโค้ชว่าง
        </a>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/dashboard">Dashboard</a></li>
          {userRole === 'coach' && (
            <>
              <li><a href="/runners">Runners</a></li>
              <li><a href="/plans">Training Plans</a></li>
            </>
          )}
          {userRole === 'runner' && (
            <>
              <li><a href="/training">My Training</a></li>
              <li><a href="/progress">Progress</a></li>
            </>
          )}
        </ul>
      </div>
      
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <div className="bg-primary text-primary-content w-10 h-10 rounded-full flex items-center justify-center">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">{userRole}</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><button onClick={onSignOut}>Logout</button></li>
          </ul>
        </div>
      </div>
    </header>
  );
};