import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'شركة تمور مصر للتجارة - النظام المحاسبي والإداري',
  description: 'نظام إدارة الأجور والعمليات التشغيلية ومستخلصات المقاولين',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
