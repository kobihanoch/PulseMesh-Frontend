import api from '@/shared/lib/api/api-config/server-api/server-api';
import type { MarketingContent, MarketingSection } from '../types/marketing.types';

export async function getMarketingContent() {
  const { data: sections } = await api.get<MarketingContent[]>('/marketing-content');
  return Object.fromEntries(sections.map(({ section, content }) => [section, content])) as Record<MarketingSection, string>;
}
