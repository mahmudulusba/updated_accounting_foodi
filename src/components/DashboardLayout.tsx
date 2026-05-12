import React from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <AppHeader />
      <main className="ml-56 mt-14 p-6">
        {children}
      </main>
    </div>
  );
}
