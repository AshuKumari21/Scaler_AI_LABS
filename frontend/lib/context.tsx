'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface UserProfile {
  name: string;
  email: string;
}

export interface NotificationSettings {
  emailSummary: boolean;
  actionItemAssigned: boolean;
  weeklyDigest: boolean;
  browserNotifications: boolean;
}

export type ThemeMode = 'light' | 'dark';

interface AppContextType {
  profile: UserProfile;
  initials: string;
  firstName: string;
  updateProfile: (name: string, email: string) => void;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  notifications: NotificationSettings;
  updateNotification: (key: keyof NotificationSettings, value: boolean) => void;
  isMounted: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@meetflow.io',
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  emailSummary: true,
  actionItemAssigned: true,
  weeklyDigest: false,
  browserNotifications: true,
};

export function getInitials(name: string): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export function getFirstName(name: string): string {
  if (!name || !name.trim()) return 'User';
  return name.trim().split(' ')[0];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      // Hydrate Profile
      const savedProfile = localStorage.getItem('meetflow_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setProfileState(parsed);
      }

      // Hydrate Theme
      const savedTheme = localStorage.getItem('meetflow_theme') as ThemeMode;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        // Default to light theme
        document.documentElement.classList.remove('dark');
      }

      // Hydrate Notifications
      const savedNotifs = localStorage.getItem('meetflow_notifications');
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      }
    } catch (e) {
      console.error('Error hydrating state from localStorage:', e);
    }
  }, []);

  // Sync theme changes to DOM & localStorage
  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem('meetflow_theme', mode);
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to save theme to localStorage:', e);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  // Sync profile changes
  const updateProfile = useCallback((name: string, email: string) => {
    const updated = { name: name.trim(), email: email.trim() };
    setProfileState(updated);
    try {
      localStorage.setItem('meetflow_profile', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  }, []);

  // Sync notification preference changes
  const updateNotification = useCallback((key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem('meetflow_notifications', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save notifications to localStorage:', e);
      }
      return updated;
    });
  }, []);

  const initials = useMemo(() => getInitials(profile.name), [profile.name]);
  const firstName = useMemo(() => getFirstName(profile.name), [profile.name]);

  return (
    <AppContext.Provider
      value={{
        profile,
        initials,
        firstName,
        updateProfile,
        theme,
        setTheme,
        toggleTheme,
        notifications,
        updateNotification,
        isMounted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
