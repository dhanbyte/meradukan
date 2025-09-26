import { NotificationItem } from './types';

declare module '@/lib/notificationStore' {
  export const useNotificationStore: () => {
    notifications: NotificationItem[];
    isLoading: boolean;
    init: (userId: string) => void;
    addNotification: (userId: string, productId: string) => void;
    removeNotification: (userId: string, productId: string) => void;
    hasNotification: (productId: string) => boolean;
    clear: () => void;
  };
}
