
'use client';
import type { PropsWithChildren } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { LoggedMealProvider } from '@/contexts/logged-meal-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LocaleProvider } from '@/contexts/locale-context';
import { PreferencesProvider } from '@/contexts/preferences-context';
import { ThemeProvider } from '@/contexts/theme-context';

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="nutrisnap-theme">
        <AuthProvider>
          <LoggedMealProvider>
            <PreferencesProvider>
              <LocaleProvider>{children}</LocaleProvider>
            </PreferencesProvider>
          </LoggedMealProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
