import fs from 'fs';
import path from 'path';
import { loadItems } from '@/lib/trips';

describe('loadItems', () => {
  const dataDir = path.join(process.cwd(), 'data');
  const tempFile = path.join(dataDir, 'temp_test.json');

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

  it('sorts items by popularity descending', () => {
    const items = loadItems();
    const popularities = items.map((i) => i.popularity);
    const sorted = [...popularities].sort((a, b) => b - a);
    expect(popularities).toEqual(sorted);
  });

  it('includes newly added json files', () => {
    const extra = {
      meta: { base: 'Test', max_drive_min: 1, date_window: '', sort: 'popularity_desc' },
      items: [
        {
          id: 'extra_item',
          name: 'Extra Item',
          category: [],
          popularity: 1,
          drive_min: 0,
          description: '',
          planning: '',
          organizing: '',
          links: [],
          image: '',
          map_query: ''
        }
      ]
    };
    fs.writeFileSync(tempFile, JSON.stringify(extra));
    const items = loadItems();
    expect(items.find((i) => i.id === 'extra_item')).toBeTruthy();
  });
});
