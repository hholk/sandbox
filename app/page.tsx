import { loadItems } from '@/lib/trips';

export default function Page() {
  const items = loadItems();
  return (
    <main className="mx-auto max-w-3xl p-6">
      <nav className="mb-8 flex flex-wrap gap-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-full bg-accent px-3 py-1 text-sm text-background no-underline hover:bg-foreground hover:text-background"
          >
            {item.name}
          </a>
        ))}
      </nav>
      {items.map((item) => {
        const links = [...(item.links ?? [])];
        return (
          <section
            key={item.id}
            id={item.id}
            className="mb-12 rounded-lg bg-[#2a2a2a] p-6 shadow"
          >
            <h2 className="mb-4 text-2xl font-bold text-accent">{item.name}</h2>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                width={800}
                height={400}
                loading="lazy"
                className="mb-4 h-auto w-full rounded"
              />
            )}
            {item.description && (
              <p className="mb-2 text-foreground">{item.description}</p>
            )}
            {(item.planning_tips || item.planning) && (
              <p className="mb-2">
                <strong>Planung:</strong> {item.planning_tips ?? item.planning}
              </p>
            )}
            {(item.organizing_tips || item.organizing) && (
              <p className="mb-2">
                <strong>Organisation:</strong> {item.organizing_tips ?? item.organizing}
              </p>
            )}
            {(item.drive_time_min !== undefined || item.drive_min !== undefined) && (
              <p className="mb-2">
                <strong>Fahrtzeit:</strong> {item.drive_time_min ?? item.drive_min} Min.
              </p>
            )}
            {item.duration_suggested_min !== undefined && (
              <p className="mb-2">
                <strong>Dauer:</strong> {item.duration_suggested_min} Min.
              </p>
            )}
            {item.price_hint && (
              <p className="mb-2">
                <strong>Preis:</strong> {item.price_hint}
              </p>
            )}
            {item.coords && (
              <p className="mb-2">
                <strong>Koordinaten:</strong> {item.coords.lat}, {item.coords.lon}
              </p>
            )}
            {item.category && (
              <p className="mb-2">
                <strong>Kategorie:</strong>{' '}
                {Array.isArray(item.category) ? item.category.join(', ') : item.category}
              </p>
            )}
            {item.tags && item.tags.length > 0 && (
              <p className="mb-2">
                <strong>Tags:</strong> {item.tags.join(', ')}
              </p>
            )}
            {links.length > 0 && (
              <ul className="list-inside list-disc">
                {links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      className="rounded px-1 text-accent underline hover:bg-accent hover:text-background"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}
