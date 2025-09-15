import fs from 'fs';
import path from 'path';
import { appleMapsAppUrl, appleMapsLink, loadItems } from '@/lib/trips';

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

  it('adds an Apple Maps link based on map_query', () => {
    const items = loadItems();
    const item = items[0];
    const apple = item.links?.find((l) => l.title === 'Apple Maps');
    expect(apple).toBeTruthy();
    expect(apple?.url).toContain('maps.apple.com');
    const appleApp = item.links?.find((l) => l.title === 'Apple Maps (App)');
    expect(appleApp).toBeTruthy();
    expect(appleApp?.url.startsWith('maps://')).toBe(true);
  });

  it('exposes provided apple_maps_url links from dataset items', () => {
    const items = loadItems();
    const pisa = items.find((i) => i.id === 'pisa_miracoli_tower');
    expect(pisa).toBeTruthy();
    const direct = pisa?.links?.find((l) =>
      l.url.startsWith('https://maps.apple.com/?ll=43.7230,10.3966')
    );
    expect(direct).toBeTruthy();
    const directApp = pisa?.links?.find((l) =>
      l.url.startsWith('maps://?ll=43.7230,10.3966')
    );
    expect(directApp).toBeTruthy();
  });

  it('retains optional fields and builds map links', () => {
    const extra = {
      meta: { base: 'Test', max_drive_min: 1, date_window: '', sort: 'popularity_desc' },
      items: [
        {
          id: 'optional_item',
          name: 'Optional Item',
          category: 'test',
          drive_time_min: 5,
          duration_suggested_min: 10,
          price_hint: 'kostenlos',
          coords: { lat: 1, lon: 2 },
          apple_maps_url: 'https://maps.apple.com/?q=1,2',
          google_maps_url: 'https://maps.google.com/?q=1,2',
          tags: ['a', 'b']
        }
      ]
    };
    fs.writeFileSync(tempFile, JSON.stringify(extra));
    const items = loadItems();
    const item = items.find((i) => i.id === 'optional_item');
    expect(item?.price_hint).toBe('kostenlos');
    expect(item?.coords).toEqual({ lat: 1, lon: 2 });
    const google = item?.links?.find((l) => l.url.includes('google.com'));
    expect(google).toBeTruthy();
    const appleApp = item?.links?.find((l) => l.url.startsWith('maps://?q=1,2'));
    expect(appleApp).toBeTruthy();
    expect(item?.tags).toEqual(['a', 'b']);
  });
});

describe('appleMapsLink', () => {
  it('encodes query for driving directions', () => {
    const link = appleMapsLink('San Francisco');
    expect(link).toEqual({
      title: 'Apple Maps',
      url: 'https://maps.apple.com/?daddr=San%20Francisco&dirflg=d',
    });
  });
});

describe('appleMapsAppUrl', () => {
  it('converts web URLs to deeplinks for the Apple Maps app', () => {
    expect(appleMapsAppUrl('https://maps.apple.com/?q=Berlin')).toBe('maps://?q=Berlin');
    expect(
      appleMapsAppUrl('https://maps.apple.com/?ll=43.7230,10.3966&q=Leaning%20Tower%20of%20Pisa')
    ).toBe('maps://?ll=43.7230,10.3966&q=Leaning%20Tower%20of%20Pisa');
  });
});
