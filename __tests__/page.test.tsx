import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Item } from '@/lib/trips';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement('img', props),
}));

const mockItems: Item[] = [
  {
    id: 'pisa',
    name: 'Pisa – Piazza dei Miracoli & Schiefer Turm',
    category: 'Stadt',
    links: [
      { title: 'Tourismus Pisa', url: 'https://www.turismo.pisa.it/' },
    ],
  },
  {
    id: 'florence',
    name: 'Florenz kompakt – Uffizien & Altstadt stressfrei',
    category: 'Stadt',
    links: [],
  },
  {
    id: 'lucca_sat_indie',
    name: 'SA 20.09 – WØM FEST OFF (Indie/Electro) @ Distilleria Indie',
    category: 'Musik',
    links: [],
  },
];

jest.mock('@/lib/trips', () => ({
  __esModule: true,
  loadItems: jest.fn(() => mockItems),
}));

describe('Page navigation layout', () => {
  beforeEach(() => {
    const { loadItems } = jest.requireMock('@/lib/trips') as { loadItems: jest.Mock };
    loadItems.mockReturnValue(mockItems);
  });

  it('enables horizontal scrolling to avoid wrapped sticky navigation', async () => {
    const Page = (await import('@/app/page')).default;
    const html = renderToStaticMarkup(React.createElement(Page));
    expect(html).toContain('overflow-x-auto');
    expect(html).toContain('flex-nowrap');
    expect(html).toContain('lg:flex-wrap');
  });

  it('adds scroll margin so anchored cards remain readable beneath the sticky nav', async () => {
    const Page = (await import('@/app/page')).default;
    const html = renderToStaticMarkup(React.createElement(Page));
    expect(html).toContain('scroll-mt-40');
  });

  it('renders shortened navigation labels derived from long titles', async () => {
    const Page = (await import('@/app/page')).default;
    const html = renderToStaticMarkup(React.createElement(Page));
    expect(html).toContain('Pisa – Piazza dei Miracoli');
    expect(html).toContain('Florenz kompakt – Uffizien');
    expect(html).toContain('Distilleria Indie – WØM FEST OFF');
  });
});

describe('getNavLabel', () => {
  it('collapses long titles to concise navigation chips', async () => {
    const { getNavLabel } = await import('@/app/page');
    expect(getNavLabel(mockItems[0])).toBe('Pisa – Piazza dei Miracoli');
    expect(getNavLabel(mockItems[1])).toBe('Florenz kompakt – Uffizien');
    expect(getNavLabel(mockItems[2])).toBe('Distilleria Indie – WØM FEST OFF');
  });
});
