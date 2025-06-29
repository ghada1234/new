'use client';
import type { PropsWithChildren } from 'react';
import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarHeader } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Logo } from '@/components/layout/logo';
import { MainNav } from '@/components/layout/main-nav';
import { UserMenu } from '@/components/layout/user-menu';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

export function AppShell({ children }: PropsWithChildren) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen}>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarBody className="flex-grow">
          <MainNav />
        </SidebarBody>
        <UserMenu />
      </Sidebar>
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pr-14">
        <Header>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </Header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-6">{children}</main>
      </div>
    </div>
  );
}
