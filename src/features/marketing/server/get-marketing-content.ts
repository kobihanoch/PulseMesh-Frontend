import api from '@/shared/lib/api/api-config/api';
import type { MarketingContent, MarketingSection } from '../types/marketing.types';

export async function getMarketingContent() {
  try {
    const { data: sections } = await api.get<MarketingContent[]>('/marketing-content');
    return Object.fromEntries(sections.map(({ section, content }) => [section, content])) as Record<MarketingSection, string>;
  } catch {
    // The public page remains usable while the backend is unavailable.
    return {} as Partial<Record<MarketingSection, string>>;
  }
}
