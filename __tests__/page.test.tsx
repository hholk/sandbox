import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Item } from '@/lib/trips';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) =>
    React.createElement('a', props, children),
}));

const mockItems: Item[] = [
  {
    id: 'arch-1',
    name: 'Pisa Klassiker',
    category: 'Stadt',
    planning_tips: 'Tickets vorab reservieren.',
    links: [
      { title: 'Tourismus Pisa', url: 'https://www.turismo.pisa.it/' },
    ],
  },
  {
    id: 'arch-2',
    name: 'Weingut Rundgang',
    category: ['Wein', 'Kulinarik'],
    organizing_tips: 'Vor Ort anmelden.',
    drive_time_min: 35,
    links: [],
  },
];

jest.mock('@/lib/trips', () => ({
  __esModule: true,
  loadItems: jest.fn(() => mockItems),
}));

describe('Archived landing page', () => {
  beforeEach(() => {
    const { loadItems } = jest.requireMock('@/lib/trips') as { loadItems: jest.Mock };
    loadItems.mockReturnValue(mockItems);
  });

  it('communicates the archive state and download link', async () => {
    const Page = (await import('@/app/page')).default;
    const html = renderToStaticMarkup(React.createElement(Page));
    expect(html).toContain('Archiviert seit');
    expect(html).toContain('/api/archive');
    expect(html).toContain('JSON-Archiv herunterladen');
  });

  it('lists archived items grouped by category', async () => {
    const Page = (await import('@/app/page')).default;
    const html = renderToStaticMarkup(React.createElement(Page));
    expect(html).toContain('Stadt');
    expect(html).toContain('Wein');
    expect(html).toMatch(/Stadt<\/h3>[\s\S]*Pisa Klassiker/);
    expect(html).toMatch(/Wein<\/h3>[\s\S]*Weingut Rundgang/);
  });

  it('keeps planning and organisation notes visible for each item', async () => {
    const Page = (await import('@/app/page')).default;
    const html = renderToStaticMarkup(React.createElement(Page));
    expect(html).toContain('Planung:');
    expect(html).toContain('Organisation:');
  });
});
