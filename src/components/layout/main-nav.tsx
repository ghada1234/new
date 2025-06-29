
'use client';
import {
  Home,
  ScanLine,
  Lightbulb,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLocale } from '@/contexts/locale-context';

const navItems = [
  { href: '/dashboard', labelKey: 'dashboard', icon: Home },
  { href: '/analyze', labelKey: 'analyzeMeal', icon: ScanLine },
  { href: '/suggestions', labelKey: 'aiMealSuggestions', icon: Lightbulb },
  { href: '/about', labelKey: 'aboutMe', icon: Info },
] as const;

export function MainNav() {
  const pathname = usePathname();
  const { t, locale } = useLocale();
  const isRtl = locale === 'ar';

  return (
    <nav className="flex flex-col items-start gap-2 px-2 text-sm font-medium">
      <TooltipProvider>
        {navItems.map(({ href, labelKey, icon: Icon }) => (
          <Tooltip key={href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={href}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  { 'bg-muted text-primary': pathname.startsWith(href) }
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{t(labelKey)}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side={isRtl ? 'left' : 'right'} sideOffset={5}>
              {t(labelKey)}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </nav>
  );
}
