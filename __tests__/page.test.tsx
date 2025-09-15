import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement('img', props),
}));

const mockItems = [
  {
    id: 'pisa',
    name: 'Pisa – Piazza dei Miracoli',
    category: 'Stadt',
    links: [
      { title: 'Tourismus Pisa', url: 'https://www.turismo.pisa.it/' },
    ],
  },
  {
    id: 'florence',
    name: 'Florenz kompakt',
    category: 'Stadt',
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
});
