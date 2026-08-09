import AdminShell from '@/features/auth/components/admin-shell';
import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
