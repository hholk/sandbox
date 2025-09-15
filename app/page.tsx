import Image from 'next/image';
import { loadItems } from '@/lib/trips';

export default function Page() {
  const items = loadItems();
  return (
    <main className="p-4">
      <nav className="mb-6 flex flex-wrap gap-4">
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="text-blue-600 underline">
            {item.name}
          </a>
        ))}
      </nav>
      {items.map((item) => (
        <section key={item.id} id={item.id} className="mb-12">
          <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
          <Image
            src={item.image}
            alt={item.name}
            width={800}
            height={400}
            className="mb-2 h-auto w-full"
          />
          <p className="mb-2">{item.description}</p>
          <p className="mb-2"><strong>Planung:</strong> {item.planning}</p>
          <p className="mb-2"><strong>Organisation:</strong> {item.organizing}</p>
          <p className="mb-2"><strong>Fahrtzeit:</strong> {item.drive_min} Min.</p>
          <p className="mb-2"><strong>Kategorie:</strong> {item.category.join(', ')}</p>
          <ul className="list-inside list-disc">
            {item.links.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  className="text-blue-600 underline"
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
