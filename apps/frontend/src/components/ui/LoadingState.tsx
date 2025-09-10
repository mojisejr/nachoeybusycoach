'use client';

import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  loading?: boolean;
  error?: string | Error | null;
  onRetry?: () => void;
  children?: React.ReactNode;
  loadingText?: string;
  errorTitle?: string;
  retryText?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading = false,
  error = null,
  onRetry,
  children,
  loadingText = 'กำลังโหลด...',
  errorTitle = 'เกิดข้อผิดพลาด',
  retryText = 'ลองใหม่',
  className = ''
}) => {
  const errorMessage = error instanceof Error ? error.message : error;

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 text-sm">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{errorTitle}</h3>
        <p className="text-gray-600 text-center mb-4 max-w-md">
          {errorMessage || 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryText}
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

// Skeleton loading components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 rounded-lg p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-300 p-4">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-400 rounded mx-2"></div>
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 border-b border-gray-300 last:border-b-0">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className="h-3 bg-gray-300 rounded mx-2"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingState;