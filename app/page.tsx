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
      {items.map((item) => (
        <section
          key={item.id}
          id={item.id}
          className="mb-12 rounded-lg bg-[#2a2a2a] p-6 shadow"
        >
          <h2 className="mb-4 text-2xl font-bold text-accent">{item.name}</h2>
          <img
            src={item.image}
            alt={item.name}
            width={800}
            height={400}
            loading="lazy"
            className="mb-4 h-auto w-full rounded"
          />
          <p className="mb-2 text-foreground">{item.description}</p>
          <p className="mb-2">
            <strong>Planung:</strong> {item.planning}
          </p>
          <p className="mb-2">
            <strong>Organisation:</strong> {item.organizing}
          </p>
          <p className="mb-2">
            <strong>Fahrtzeit:</strong> {item.drive_min} Min.
          </p>
          <p className="mb-2">
            <strong>Kategorie:</strong> {item.category.join(', ')}
          </p>
          <ul className="list-inside list-disc">
            {item.links.map((l) => (
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
        </section>
      ))}
    </main>
  );
}
