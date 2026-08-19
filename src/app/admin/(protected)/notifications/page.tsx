import { NotificationList } from '@/features/admin/components/notification-list';
import { getNotifications } from '@/features/admin/server/admin-data';

type Props = { searchParams: Promise<{ page?: string }> };

export default async function NotificationsPage({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const data = await getNotifications('push', page);
  return <NotificationList title="התראות" description="התראות Push לאירועים ולסוללה חלשה" path="/admin/notifications" page={page} data={data} />;
}
