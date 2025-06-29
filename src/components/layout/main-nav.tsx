'use client';
import {
  Home,
  ScanLine,
  Lightbulb,
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

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/analyze', label: 'Analyze Meal', icon: ScanLine },
  { href: '/suggestions', label: 'Meal Suggestions', icon: Lightbulb },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-start gap-2 px-2 text-sm font-medium">
      <TooltipProvider>
        {navItems.map(({ href, label, icon: Icon }) => (
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
                <span className="truncate">{label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              {label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </nav>
  );
}
