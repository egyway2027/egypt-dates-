'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSidebarStore } from '@/stores/useSidebarStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isOpen } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100" dir="rtl">
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
            isOpen ? 'mr-64' : 'mr-0'
          }`}
        >
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
