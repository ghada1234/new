
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ScanLine, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/locale-context';

const navItems = [
  { href: '/dashboard', labelKey: 'dashboard', icon: Home },
  { href: '/analyze', labelKey: 'analyzeMeal', icon: ScanLine },
  { href: '/suggestions', labelKey: 'aiMealSuggestions', icon: Lightbulb },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background md:hidden">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive = (href === '/dashboard' && pathname === href) || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-2 text-center font-medium',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
