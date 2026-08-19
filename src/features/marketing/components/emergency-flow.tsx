const channels = [
  {
    title: 'ערוץ LoRa / Meshtastic',
    description: 'קריאת המצוקה עוברת ברשת ה-Mesh יחד עם נקודת ה-GPS, גם ללא קליטה סלולרית.',
  },
  {
    title: 'ערוץ SMS / סלולר',
    description: 'השרת שולח לבעל הדפיברילטור את מיקום האירוע, מיקום הבעלים ומספר הטלפון שלו.',
  },
];

export function EmergencyFlow() {
  return (
    <div className="grid gap-5 text-center">
      <FlowBox title="קריאת מצוקה" text="מתקבלת קריאה עם נקודת GPS ומיקום האירוע" color="bg-red-600 text-white" />
      <Arrow />
      <FlowBox title="שרת PulseMesh" text="מאתר דפיברילטורים ניידים ובעלים קרובים" />
      <Arrow />

      <div className="grid gap-5 md:grid-cols-2">
        {channels.map((channel) => (
          <FlowBox key={channel.title} title={channel.title} text={channel.description} color="border-blue-200 bg-blue-50" />
        ))}
      </div>

      <Arrow />
      <FlowBox title="תגובה וניווט" text="המתנדב מאשר הגעה ומקבל מסלול מהיר אל מיקום האירוע" color="border-green-200 bg-green-50" />
    </div>
  );
}

function FlowBox({ title, text, color = 'border-slate-200 bg-white' }: { title: string; text: string; color?: string }) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${color}`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 leading-7">{text}</p>
    </div>
  );
}

function Arrow() {
  return <div className="text-3xl font-bold text-slate-400" aria-hidden="true">↓</div>;
}
