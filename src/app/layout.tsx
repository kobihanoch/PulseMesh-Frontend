import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ErrorToaster } from '@/shared/components/feedback/error-toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'PulseMesh',
  description: 'רשת קהילתית לאיתור דפיברילטורים ניידים בשעת חירום',
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="he" dir="rtl">
      <body>
        {children}
        <ErrorToaster />
      </body>
    </html>
  );
}
