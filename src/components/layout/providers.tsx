'use client';
import type { PropsWithChildren } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { LoggedMealProvider } from '@/contexts/logged-meal-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoggedMealProvider>{children}</LoggedMealProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
