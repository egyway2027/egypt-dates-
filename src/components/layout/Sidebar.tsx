'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/stores/useSidebarStore';

const navigationGroups = [
  {
    title: 'نواة النظام',
    items: [
      { label: 'لوحة التحكم والتحليلات', href: '/' },
    ],
  },
  {
    title: 'شؤون العاملين والأجور',
    items: [
      { label: 'سجل الموظفين الأساسي', href: '/employees' },
      { label: 'الحضور والانصراف الشهري', href: '/attendance' },
      { label: 'السلف والقروض والأقساط', href: '/loans' },
      { label: 'مسير الرواتب الآلي', href: '/payroll' },
      { label: 'تحويلات الأجور والمحافظ', href: '/payouts' },
    ],
  },
  {
    title: 'المصنع والعمليات الزراعية',
    items: [
      { label: 'عمالة المصنع (رجال وسيدات)', href: '/factory-labor' },
      { label: 'مقاولات الحصاد والفصل', href: '/contractors' },
      { label: 'كشوف التحويلات والمحجوزات', href: '/retentions' },
    ],
  },
  {
    title: 'الأصول والعهد العينية',
    items: [
      { label: 'تسليم السيارات والحركة', href: '/handovers/vehicles' },
      { label: 'تسليم المعدات والآليات', href: '/handovers/equipment' },
      { label: 'إقرارات استلام العمل', href: '/handovers/duty' },
    ],
  },
  {
    title: 'النظام',
    items: [
      { label: 'المعايير والإعدادات العامة', href: '/settings' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { isOpen } = useSidebarStore();
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 flex flex-col border-l border-slate-200 bg-white pt-16 transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${
        isOpen ? 'w-64 translate-x-0' : 'w-0 translate-x-full overflow-hidden border-none'
      }`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {navigationGroups.map((group, idx) => (
          <div key={idx} className="mb-5">
            <h3 className="mb-2 px-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-900 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};
