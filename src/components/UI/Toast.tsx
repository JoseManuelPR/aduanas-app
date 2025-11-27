import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig: Record<ToastType, {
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}> = {
  success: {
    bgGradient: 'bg-gradient-to-r from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-400',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bgGradient: 'bg-gradient-to-r from-red-50 to-rose-50',
    borderColor: 'border-red-400',
    iconBg: 'bg-red-500',
    iconColor: 'text-white',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    bgGradient: 'bg-gradient-to-r from-amber-50 to-orange-50',
    borderColor: 'border-amber-400',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  info: {
    bgGradient: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    borderColor: 'border-blue-400',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const ToastItem: React.FC<{
  toast: Toast;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = toastConfig[toast.type];
  const duration = toast.duration || 4000;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 50);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [toast.id, duration, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl shadow-xl border-l-4 ${config.borderColor}
        ${config.bgGradient} backdrop-blur-sm
        transform transition-all duration-300 ease-out
        ${isExiting 
          ? 'opacity-0 translate-x-8 scale-95' 
          : 'opacity-100 translate-x-0 scale-100'}
        min-w-[340px] max-w-[420px]
      `}
      style={{
        animation: isExiting ? 'none' : 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`
            ${config.iconBg} ${config.iconColor} 
            p-2 rounded-lg shadow-md flex-shrink-0
            animate-bounce-subtle
          `}>
            {config.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h4 className="font-semibold text-gray-900 leading-tight">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {toast.message}
              </p>
            )}
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-black/5">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${
            toast.type === 'success' ? 'bg-emerald-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
      
      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Helper functions for common toast types
export const toast = {
  success: (title: string, message?: string, duration?: number) => ({
    type: 'success' as ToastType,
    title,
    message,
    duration,
  }),
  error: (title: string, message?: string, duration?: number) => ({
    type: 'error' as ToastType,
    title,
    message,
    duration,
  }),
  warning: (title: string, message?: string, duration?: number) => ({
    type: 'warning' as ToastType,
    title,
    message,
    duration,
  }),
  info: (title: string, message?: string, duration?: number) => ({
    type: 'info' as ToastType,
    title,
    message,
    duration,
  }),
};

export default ToastProvider;

