'use client';

import { useState, type FormEvent } from 'react';
import { showErrorToast, showSuccessToast } from '@/shared/lib/utils/toast';
import type { MarketingSection } from '@/features/marketing/types/marketing.types';
import { updateMarketingContent } from '../api/admin-actions';

const labels: Record<MarketingSection, string> = {
  participation: 'השתתפות במיזם',
  purchase: 'רכישה',
  maintenance: 'תחזוקה',
  registration: 'רישום',
};

export function MarketingEditor({ content }: { content: Record<MarketingSection, string> }) {
  const [saving, setSaving] = useState<MarketingSection | null>(null);

  async function save(event: FormEvent<HTMLFormElement>, section: MarketingSection) {
    event.preventDefault();
    setSaving(section);
    const form = new FormData(event.currentTarget);

    try {
      await updateMarketingContent(section, String(form.get('content') ?? ''));
      showSuccessToast('התוכן נשמר');
    } catch (error) {
      showErrorToast('שמירת התוכן נכשלה', error);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Object.entries(content).map(([section, text]) => (
        <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" key={section} onSubmit={(event) => save(event, section as MarketingSection)}>
          <label className="grid gap-3">
            <span className="text-xl font-bold">{labels[section as MarketingSection]}</span>
            <textarea className="min-h-48 rounded-lg border border-slate-300 p-3" name="content" defaultValue={text} maxLength={20_000} />
          </label>
          <button className="mt-4 rounded-lg bg-blue-700 px-5 py-2 font-bold text-white disabled:opacity-50" disabled={saving !== null} type="submit">
            {saving === section ? 'שומר...' : 'שמירה'}
          </button>
        </form>
      ))}
    </div>
  );
}
