import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'NutriSnap',
  description: 'Track your nutrients with a snap',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} font-body antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
