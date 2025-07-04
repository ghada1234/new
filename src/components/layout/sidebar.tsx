
'use client';
import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';
import { useLocale } from '@/contexts/locale-context';

type SidebarProps = PropsWithChildren<{
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  className?: string;
}>;

export const Sidebar = ({
  isOpen,
  setOpen,
  className,
  children,
}: SidebarProps) => {
  const { locale } = useLocale();
  const isRtl = locale === 'ar';

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 z-10 hidden w-14 flex-col bg-background sm:flex',
          isRtl ? 'right-0 border-l' : 'left-0 border-r',
          className
        )}
      >
        {children}
      </aside>
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-20 bg-black/40 transition-opacity duration-200 md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          'fixed inset-y-0 z-30 flex h-full w-64 flex-col bg-background transition-transform duration-300 ease-in-out md:hidden',
          isRtl ? 'right-0 border-l' : 'left-0 border-r',
          isOpen ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full',
          className
        )}
      >
        {children}
      </aside>
    </>
  );
};

export const SidebarHeader = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={cn('flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6', className)}>
      {children}
    </div>
  );
};

export const SidebarBody = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return <div className={cn('flex-1 overflow-auto py-2', className)}>{children}</div>;
};

export const SidebarFooter = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return <div className={cn('mt-auto p-4', className)}>{children}</div>;
};
