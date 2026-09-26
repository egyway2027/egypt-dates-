'use client';

import React from 'react';
import { useSidebarStore } from '@/stores/useSidebarStore';

export const Header: React.FC = () => {
  const { toggle } = useSidebarStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label="تبديل القائمة الجانبية"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex flex-col">
          <span className="text-sm font-bold text-emerald-950 dark:text-emerald-400">
            شركة تمور مصر للتجارة
          </span>
          <span className="text-xs text-slate-500">نظام إدارة الأجور والعمليات المالية</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-left md:block">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">الإدارة المالية</p>
          <p className="text-[11px] text-slate-400">السنة المالية 2026</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900 text-xs font-bold text-white shadow-inner">
          FIN
        </div>
      </div>
    </header>
  );
};
