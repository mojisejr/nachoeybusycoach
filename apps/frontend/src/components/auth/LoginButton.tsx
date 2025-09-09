'use client';

import { useAuth } from '@/hooks/useAuth';
import { FaGoogle, FaFacebook, FaLine } from 'react-icons/fa';

interface LoginButtonProps {
  provider: 'google' | 'facebook' | 'line';
  className?: string;
}

const providerConfig = {
  google: {
    name: 'Google',
    icon: FaGoogle,
    bgColor: 'bg-red-500 hover:bg-red-600',
    textColor: 'text-white'
  },
  facebook: {
    name: 'Facebook',
    icon: FaFacebook,
    bgColor: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white'
  },
  line: {
    name: 'Line',
    icon: FaLine,
    bgColor: 'bg-green-500 hover:bg-green-600',
    textColor: 'text-white'
  }
};

export function LoginButton({ provider, className = '' }: LoginButtonProps) {
  const { login, isLoading } = useAuth();
  const config = providerConfig[provider];
  const IconComponent = config.icon;

  const handleLogin = () => {
    login(provider);
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`
        flex items-center justify-center gap-3 px-6 py-3 rounded-lg
        font-medium transition-colors duration-200
        ${config.bgColor} ${config.textColor}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <div className="loading loading-spinner loading-sm"></div>
      ) : (
        <IconComponent className="text-lg" />
      )}
      <span>
        {isLoading ? 'กำลังเข้าสู่ระบบ...' : `เข้าสู่ระบบด้วย ${config.name}`}
      </span>
    </button>
  );
}

// Combined login buttons component
export function LoginButtons({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <LoginButton provider="google" className="w-full" />
      <LoginButton provider="facebook" className="w-full" />
      <LoginButton provider="line" className="w-full" />
    </div>
  );
}

export default LoginButton;