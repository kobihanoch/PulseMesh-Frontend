import { NotificationList } from '@/features/admin/components/notification-list';
import { getNotifications } from '@/features/admin/server/admin-data';

type Props = { searchParams: Promise<{ page?: string }> };

export default async function LoraAlertsPage({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const data = await getNotifications('lora', page);
  return <NotificationList title="התראות LoRa" description="פקודות Downlink מדומות למכשירי LoRa" path="/admin/lora-alerts" page={page} data={data} />;
}
