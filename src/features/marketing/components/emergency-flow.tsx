const steps = [
  ['1', 'מתקבלת קריאת מצוקה עם נקודת GPS'],
  ['2', 'השרת מאתר דפיברילטורים קרובים'],
  ['3', 'נשלחת התראה בסלולר וברשת LoRa'],
  ['4', 'מתנדב יוצא במהירות למקום האירוע'],
];

export function EmergencyFlow() {
  return (
    <ol className="grid gap-4 md:grid-cols-4">
      {steps.map(([number, text]) => (
        <li key={number} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="mb-4 grid size-9 place-items-center rounded-full bg-red-600 font-bold text-white">{number}</span>
          <p className="font-medium leading-7">{text}</p>
        </li>
      ))}
    </ol>
  );
}
