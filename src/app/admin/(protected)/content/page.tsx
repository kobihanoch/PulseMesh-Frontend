import { MarketingEditor } from '@/features/admin/components/marketing-editor';
import { getMarketingContent } from '@/features/marketing/server/get-marketing-content';

export default async function MarketingContentPage() {
  const content = await getMarketingContent();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold">תוכן שיווקי</h1>
      <p className="mb-8 mt-3 text-slate-600">עריכת התוכן שמופיע בכרטיסים בדף הבית.</p>
      <MarketingEditor content={content} />
    </main>
  );
}
