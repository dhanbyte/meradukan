import { CustomUser } from './ClerkAuthContext';

declare module '@/context/ClerkAuthContext' {
  export const useAuth: () => {
    user: CustomUser | null;
    loading: boolean;
    updateUserProfile: (profileData: Partial<CustomUser>) => Promise<void>;
    logout: () => void;
  };
}
