export type MarketingSection = 'participation' | 'purchase' | 'maintenance' | 'registration';

export type MarketingContent = {
  section: MarketingSection;
  content: string;
};
