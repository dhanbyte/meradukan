export * from '../types';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
}

export interface Toast extends ToastProps {
  id: string;
  createdAt: number;
}

export interface ToastState {
  toasts: Toast[];
  toast: (props: ToastProps) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}
