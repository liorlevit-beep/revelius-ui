import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number; // ms, 0 = persistent
}

interface ScanToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ScanToast({ toasts, onDismiss }: ScanToastProps) {
  return (
    <div className="fixed top-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-white border-emerald-200';
      case 'error':
        return 'bg-white border-red-200';
      case 'warning':
        return 'bg-white border-amber-200';
      case 'info':
        return 'bg-white border-blue-200';
    }
  };

  return (
    <div
      className={`pointer-events-auto rounded-xl border shadow-lg p-4 flex items-start gap-3 max-w-md transition-all duration-200 ${getStyles()} ${
        isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          toast.type === 'success' ? 'bg-emerald-100' :
          toast.type === 'error' ? 'bg-red-100' :
          toast.type === 'warning' ? 'bg-amber-100' :
          'bg-blue-100'
        }`}>
          {getIcon()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 mb-0.5">{toast.title}</p>
        {toast.message && <p className="text-sm text-gray-600">{toast.message}</p>}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
