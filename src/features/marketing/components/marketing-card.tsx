import Link from 'next/link';

type MarketingCardProps = {
  title: string;
  text: string;
  href: string;
  linkText: string;
};

export function MarketingCard({ title, text, href, linkText }: MarketingCardProps) {
  return (
    <article className="flex flex-col rounded-2xl bg-slate-900 p-6 text-white">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 flex-1 leading-7 text-slate-300">{text}</p>
      <Link className="mt-6 font-semibold text-red-300 hover:text-red-200" href={href}>
        {linkText} ←
      </Link>
    </article>
  );
}
