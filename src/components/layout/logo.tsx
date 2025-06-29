import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/dashboard"
      className="group flex items-center gap-2 px-2.5 text-foreground"
    >
      <UtensilsCrossed className="h-6 w-6 text-primary transition-all group-hover:scale-110" />
      <span className="font-headline text-lg font-semibold">NutriSnap</span>
    </Link>
  );
}
