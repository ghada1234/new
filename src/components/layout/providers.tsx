
'use client';
import type { PropsWithChildren } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { LoggedMealProvider } from '@/contexts/logged-meal-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LocaleProvider } from '@/contexts/locale-context';
import { HealthGoalsProvider } from '@/contexts/health-goals-context';

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocaleProvider>
          <HealthGoalsProvider>
            <LoggedMealProvider>{children}</LoggedMealProvider>
          </HealthGoalsProvider>
        </LocaleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
