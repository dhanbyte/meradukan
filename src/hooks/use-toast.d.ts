import { ToastProps } from '@/lib/types';

declare module '@/hooks/use-toast' {
  export function useToast(): {
    toast: (props: ToastProps) => void;
    dismiss: (id: string) => void;
    toasts: ToastProps[];
  };
}
