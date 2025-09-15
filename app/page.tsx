import Image from 'next/image';
import { loadItems } from '@/lib/trips';
import type { Item } from '@/lib/trips';

function getCategories(itemCategory: Item['category']): string[] {
  if (!itemCategory) {
    return [];
  }
  return Array.isArray(itemCategory) ? itemCategory : [itemCategory];
}

export default function Page() {
  const items = loadItems();
  const categories = new Set<string>();
  const tags = new Set<string>();
  items.forEach((item) => {
    getCategories(item.category).forEach((cat) => categories.add(cat));
    (item.tags ?? []).forEach((tag) => tags.add(tag));
  });
  const maxDrive = items.reduce((max, item) => {
    const value = item.drive_time_min ?? item.drive_min ?? 0;
    return value > max ? value : max;
  }, 0);
  const stats = [
    { label: 'Erlebnisse', value: items.length.toString() },
    { label: 'Kategorien', value: categories.size.toString() },
    { label: 'Tags', value: tags.size.toString() },
    { label: 'Max. Fahrtzeit', value: `${maxDrive} Min.` },
  ];
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="glass-panel relative overflow-hidden rounded-3xl px-8 py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.15),_transparent_55%)]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Montescudaio Roadbook</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Kuratierte Tagesausflüge mit konkreten Tipps für Anreise, Timing & Tickets.
            </h1>
            <p className="text-lg text-[var(--muted)]">
              Setze auf stressfreie Planung: Alle Empfehlungen wurden nach Popularität sortiert und mit direkten
              Kartenlinks, Zeitfenstern und Organisationshinweisen versehen.
            </p>
          </div>
          <dl className="grid w-full max-w-md grid-cols-2 gap-4 text-sm text-[var(--muted)]">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-2xl px-4 py-5 text-center">
                <dt className="text-xs uppercase tracking-wide">{stat.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>
      <nav
        className="sticky top-6 z-20 flex w-full items-center gap-3 overflow-x-auto rounded-full bg-[#0f172a99] p-4 shadow-xl backdrop-blur flex-nowrap lg:flex-wrap"
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[#ffffff0f] px-3 py-1 text-sm font-medium text-foreground no-underline transition hover:border-[var(--accent)] hover:bg-[rgba(249,115,22,0.15)] hover:text-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden />
            {item.name}
          </a>
        ))}
      </nav>
      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((item) => {
          const categoriesForItem = getCategories(item.category);
          const links = item.links ?? [];
          return (
            <article
              key={item.id}
              id={item.id}
              className="glass-panel relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-transparent p-6 transition hover:border-[var(--accent)] hover:shadow-[0_24px_60px_rgba(8,12,21,0.7)] scroll-mt-40"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-foreground">{item.name}</h2>
                  {categoriesForItem.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {categoriesForItem.map((category) => (
                        <span
                          key={category}
                          className="rounded-full bg-[rgba(148,163,184,0.12)] px-3 py-1 text-[var(--muted)]"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {item.image && (
                  <div className="overflow-hidden rounded-2xl border border-[var(--card-border)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={800}
                      height={400}
                      loading="lazy"
                      className="h-48 w-full object-cover transition duration-500 hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 45vw, 90vw"
                    />
                  </div>
                )}
                {item.description && <p className="text-base text-[var(--muted)]">{item.description}</p>}
              </div>
              <div className="space-y-3 text-sm text-[var(--muted)]">
                {(item.planning_tips || item.planning) && (
                  <p>
                    <span className="font-semibold text-foreground">Planung:</span> {item.planning_tips ?? item.planning}
                  </p>
                )}
                {(item.organizing_tips || item.organizing) && (
                  <p>
                    <span className="font-semibold text-foreground">Organisation:</span>{' '}
                    {item.organizing_tips ?? item.organizing}
                  </p>
                )}
                {(item.drive_time_min !== undefined || item.drive_min !== undefined) && (
                  <p>
                    <span className="font-semibold text-foreground">Fahrtzeit:</span> {item.drive_time_min ?? item.drive_min}{' '}
                    Min.
                  </p>
                )}
                {item.duration_suggested_min !== undefined && (
                  <p>
                    <span className="font-semibold text-foreground">Dauer:</span> {item.duration_suggested_min} Min.
                  </p>
                )}
                {item.price_hint && (
                  <p>
                    <span className="font-semibold text-foreground">Preis:</span> {item.price_hint}
                  </p>
                )}
                {item.coords && (
                  <p>
                    <span className="font-semibold text-foreground">Koordinaten:</span> {item.coords.lat}, {item.coords.lon}
                  </p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <p>
                    <span className="font-semibold text-foreground">Tags:</span> {item.tags.join(', ')}
                  </p>
                )}
              </div>
              {links.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {links.map((link) => (
                    <a
                      key={`${item.id}-${link.url}`}
                      href={link.url}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,115,22,0.35)] bg-[rgba(249,115,22,0.08)] px-3 py-1 text-sm font-medium text-foreground no-underline transition hover:bg-[rgba(249,115,22,0.2)]"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span aria-hidden>↗</span>
                      {link.title}
                    </a>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
