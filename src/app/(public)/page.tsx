import Link from 'next/link';
import { EmergencyFlow } from '@/features/marketing/components/emergency-flow';
import { MarketingCard } from '@/features/marketing/components/marketing-card';
import { getMarketingContent } from '@/features/marketing/server/get-marketing-content';

// Axios is not part of Next.js's fetch cache, so declare that this page uses SSR.
export const dynamic = 'force-dynamic';

const shops = [
  ['RAKwireless', 'https://store.rakwireless.com/collections/meshtastic'],
  ['LILYGO', 'https://lilygo.cc/en-us/products/t-beam-meshtastic'],
  ['Meshtastic LoRa', 'https://meshtasticlora.com/shop/'],
];

export default async function HomePage() {
  const content = await getMarketingContent();

  return (
    <main>
      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 font-bold text-red-400">PulseMesh</p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">דפיברילטור קרוב יכול להציל חיים</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            LoRa היא תקשורת רדיו ארוכת טווח וחסכונית שאינה תלויה בקליטה סלולרית. Meshtastic מאפשר למכשירים להעביר הודעה
            ביניהם כרשת. בזמן חירום PulseMesh מאתר דפיברילטורים ניידים קרובים ומזעיק את בעליהם.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link className="rounded-xl bg-red-600 px-6 py-3 font-bold hover:bg-red-500" href="/register">
              הצטרפות למיזם
            </Link>
            <Link className="rounded-xl border border-slate-600 px-6 py-3 font-bold hover:bg-slate-800" href="/simulator">
              פתיחת הסימולטור
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-8 text-3xl font-bold">איך זה עובד?</h2>
        <EmergencyFlow />
      </section>

      <section className="bg-slate-100 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          <MarketingCard title="השתתפות" text={content.participation || 'בעלי דפיברילטור ונושאי LoRa יכולים לחזק את רשת ההצלה.'} href="/register" linkText="להצטרפות" />
          <MarketingCard title="רכישה" text={content.purchase || 'בחרו מכשיר LoRa מתאים וחברו אותו לרשת הקהילתית.'} href="#shops" linkText="לאתרי רכישה" />
          <MarketingCard title="תחזוקה" text={content.maintenance || 'בדיקת תקינות וסוללה שומרת את הדפיברילטור מוכן לחירום.'} href="/register" linkText="לעדכון פרטים" />
          <MarketingCard title="רישום" text={content.registration || 'הרישום קצר, ללא סיסמה, ומתאים לשלושה סוגי ציוד.'} href="/register" linkText="לרישום ציוד" />
        </div>
      </section>

      <section id="shops" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">רכישת מכשיר LoRa</h2>
        <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 font-medium text-amber-900">
          לפני הרכישה יש לוודא שהדגם תומך בתדר 433MHz. אין לרכוש תדר אחר ללא בדיקת התאמה לדרישות בישראל.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {shops.map(([name, href]) => (
            <a key={name} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-100" href={href} target="_blank" rel="noreferrer">
              {name} ↗
            </a>
          ))}
        </div>
        <a className="mt-10 inline-block font-bold text-red-700 hover:text-red-600" href="https://www.mdais.org/defibrillators" target="_blank" rel="noreferrer">
          למידע על פריסת דפיברילטורים של מד״א ↗
        </a>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-600">
        במקרה חירום אמיתי יש להתקשר מיד למד״א במספר 101. האתר אינו מחליף מוקד חירום.
      </footer>
    </main>
  );
}
