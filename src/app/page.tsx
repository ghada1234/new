'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed } from 'lucide-react';
import { useLocale } from '@/contexts/locale-context';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLocale();

  useEffect(() => {
    // If done loading and user exists, redirect to dashboard
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // While loading or if user exists (and is about to be redirected), show loading state.
  if (loading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
         <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex flex-col items-center">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-5 w-[350px]" />
            </div>
          </div>
      </div>
    );
  }

  // Welcome screen for logged-out users
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 text-center">
            <UtensilsCrossed className="h-16 w-16 text-primary" />
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {t('nutrisnapTitle')}
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
                {t('nutrisnapDescription')}
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                    <Link href="/register">{t('createAccount')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/login">{t('login')}</Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
