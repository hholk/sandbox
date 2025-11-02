import Link from 'next/link';
import { loadItems } from '@/lib/trips';
import type { Item } from '@/lib/trips';

const ARCHIVE_DATE_ISO = '2024-05-27';

/**
 * Convert any provided category field into a reliable array so we can group
 * items even when the original data mixes strings and arrays.
 */
function normaliseCategories(category: Item['category']): string[] {
  if (!category) {
    return [];
  }
  return Array.isArray(category) ? category : [category];
}

/**
 * Format the archive date in German so newcomers immediately understand when
 * the project stopped receiving updates.
 */
function getArchiveDateLabel(): string {
  const formatter = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return formatter.format(new Date(`${ARCHIVE_DATE_ISO}T00:00:00Z`));
}

interface ArchiveGroup {
  label: string;
  items: Item[];
}

/**
 * Group the archived trips by category so the final list stays readable.
 * We intentionally keep a fallback bucket for uncategorised entries because
 * some historical records may miss metadata.
 */
function buildArchiveGroups(items: Item[]): ArchiveGroup[] {
  const groups = new Map<string, Item[]>();
  items.forEach((item) => {
    const categories = normaliseCategories(item.category);
    if (categories.length === 0) {
      const current = groups.get('Ohne Kategorie') ?? [];
      current.push(item);
      groups.set('Ohne Kategorie', current);
      return;
    }
    categories.forEach((category) => {
      const key = category.trim() || 'Ohne Kategorie';
      const current = groups.get(key) ?? [];
      current.push(item);
      groups.set(key, current);
    });
  });
  return Array.from(groups.entries())
    .map(([label, groupItems]) => ({ label, items: groupItems.sort(sortByName) }))
    .sort((a, b) => a.label.localeCompare(b.label, 'de'));
}

function sortByName(a: Item, b: Item): number {
  return a.name.localeCompare(b.name, 'de');
}

export default function Page() {
  const items = loadItems();
  const archiveGroups = buildArchiveGroups(items);
  const totalLinks = items.reduce((sum, item) => sum + (item.links?.length ?? 0), 0);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="glass-panel space-y-6 rounded-3xl px-8 py-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Montescudaio Roadbook</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Archiviert seit {getArchiveDateLabel()}</h1>
          <p className="text-lg text-[var(--muted)]">
            Dieses Projekt bleibt als Nachschlagewerk erhalten, wird aber nicht mehr weiter gepflegt. Alle Tipps,
            Fahrzeiten und Links findest du unten in einem kompakten Archiv.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--card-border)] bg-[#ffffff08] p-5 text-sm text-[var(--muted)]">
          <p>
            <span className="font-semibold text-foreground">Archivumfang:</span> {items.length} Ausflüge mit{' '}
            {totalLinks} kuratierten Links.
          </p>
          <p>
            <span className="font-semibold text-foreground">Export:</span>{' '}
            <Link
              href="/api/archive"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,115,22,0.35)] bg-[rgba(249,115,22,0.08)] px-3 py-1 text-foreground no-underline transition hover:bg-[rgba(249,115,22,0.2)]"
            >
              JSON-Archiv herunterladen ↗
            </Link>
          </p>
        </div>
      </header>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Archivierte Inhalte</h2>
        <p className="text-sm text-[var(--muted)]">
          Jede Kategorie fasst die damaligen Empfehlungen zusammen. Die Details bleiben bewusst simpel, damit man sie
          schnell in eigene Notizen kopieren kann.
        </p>
        <div className="space-y-4">
          {archiveGroups.map((group) => (
            <article key={group.label} className="glass-panel space-y-3 rounded-2xl border border-[var(--card-border)] p-5">
              <h3 className="text-xl font-semibold text-foreground">{group.label}</h3>
              <ul className="space-y-3 text-sm text-[var(--muted)]">
                {group.items.map((item) => (
                  <li key={item.id} className="space-y-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    {item.description && <p>{item.description}</p>}
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
                        <span className="font-semibold text-foreground">Fahrtzeit:</span> {item.drive_time_min ?? item.drive_min}
                        {' Min.'}
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
                    {item.links && item.links.length > 0 && (
                      <ul className="flex flex-wrap gap-2 pt-1">
                        {item.links.map((link) => (
                          <li key={`${item.id}-${link.url}`}>
                            <a
                              href={link.url}
                              className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,115,22,0.35)] bg-[rgba(249,115,22,0.08)] px-3 py-1 text-foreground no-underline transition hover:bg-[rgba(249,115,22,0.2)]"
                              target="_blank"
                              rel="noreferrer"
                            >
                              ↗ {link.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
