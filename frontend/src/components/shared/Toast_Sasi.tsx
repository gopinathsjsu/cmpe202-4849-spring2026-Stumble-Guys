import React from 'react';

type ToastVariant = 'success' | 'error' | 'info';

type Props = {
  title: string;
  message?: string;
  variant?: ToastVariant;
};

const styles: Record<ToastVariant, string> = {
  success: 'border-green-200 bg-green-50 text-green-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  info: 'border-gray-200 bg-white text-gray-900',
};

const Toast: React.FC<Props> = ({ title, message, variant = 'info' }) => {
  return (
    <div className={`rounded-xl border px-4 py-3 shadow-sm ${styles[variant]}`}>
      <div className="text-sm font-semibold">{title}</div>
      {message && <div className="mt-1 text-xs opacity-90">{message}</div>}
    </div>
  );
};

export default Toast;

