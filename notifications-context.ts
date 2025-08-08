import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type NotificationsContextValue = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  unreadCount: number;
  setUnreadCount: (v: number) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const value = useMemo(
    () => ({ isOpen, setIsOpen, unreadCount, setUnreadCount }),
    [isOpen, unreadCount]
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used within NotificationsProvider');
  return ctx;
}

