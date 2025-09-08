'use client';

import React, { type ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarNav } from './sidebar-nav';
import { Logo } from '@/components/icons';
import { Bell, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <h1 className="text-xl font-semibold">Student Hub</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={user.photoURL || 'https://picsum.photos/id/237/40/40'} alt="User avatar" />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">{user.displayName || 'User'}</span>
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={signOut}>
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
             <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">Guest</span>
                  <a href="/login" className="text-sm text-primary hover:underline">
                    Login to get started
                  </a>
                </div>
              </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-1 items-center justify-end gap-4">
             <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
