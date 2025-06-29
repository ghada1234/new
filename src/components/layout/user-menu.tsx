
'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { LifeBuoy, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { useLocale } from '@/contexts/locale-context';

export function UserMenu() {
  const { user, loading, logout } = useAuth();
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="mt-auto flex items-center gap-4 p-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mt-auto p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.photoURL ?? undefined} alt={`@${user.displayName}`} />
              <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="truncate">
                <p className="text-sm font-medium text-foreground">{user.displayName}</p>
                <p className="text-xs truncate">{user.email}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">
              <User className="mr-2 h-4 w-4" />
              <span>{t('account')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>{t('support')}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
