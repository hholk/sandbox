import fs from 'fs';
import path from 'path';

export interface Link {
  title: string;
  url: string;
}

export interface Item {
  id: string;
  name: string;
  category: string | string[];
  popularity?: number;
  drive_min?: number;
  drive_time_min?: number;
  description?: string;
  planning?: string;
  planning_tips?: string;
  organizing?: string;
  organizing_tips?: string;
  links?: Link[];
  image?: string;
  map_query?: string;
  duration_suggested_min?: number;
  price_hint?: string;
  coords?: { lat: number; lon: number };
  apple_maps_url?: string;
  apple_maps_deeplink?: string;
  apple_directions_url?: string;
  apple_directions_deeplink?: string;
  google_maps_url?: string;
  tags?: string[];
}

/**
 * Create a link to Apple Maps with driving directions for CarPlay.
 * Runs in O(n) time where n is the length of the query due to encoding.
 */
export function appleMapsLink(query: string): Link {
  const q = query.trim();
  if (!q) {
    throw new Error('map_query is required to build Apple Maps link');
  }
  const url = `https://maps.apple.com/?daddr=${encodeURIComponent(q)}&dirflg=d`;
  return { title: 'Apple Maps', url };
}

/**
 * Convert a public Apple Maps URL into an app deeplink so iOS devices open
 * the native Maps application directly. The transformation runs in O(1)
 * time because it only inspects the URL components once.
 *
 * @example
 * appleMapsAppUrl('https://maps.apple.com/?q=Berlin');
 * // ➜ 'maps://?q=Berlin'
 */
export function appleMapsAppUrl(webUrl: string): string {
  try {
    const parsed = new URL(webUrl);
    const path = parsed.pathname === '/' ? '' : parsed.pathname;
    const suffix = `${path}${parsed.search ?? ''}`;
    return suffix ? `maps://${suffix}` : 'maps://';
  } catch {
    const trimmed = webUrl.replace(/^https?:\/\//, '');
    const slash = trimmed.indexOf('/');
    const suffix = slash >= 0 ? trimmed.slice(slash) : '';
    return suffix ? `maps://${suffix}` : 'maps://';
  }
}

export interface TripData {
  meta: {
    base: string;
    max_drive_min: number;
    date_window: string;
    sort: string;
  };
  items: Item[];
}

const dataDir = path.join(process.cwd(), 'data');

export function loadTrips(): TripData[] {
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));
  return files.map((file) => {
    const full = path.join(dataDir, file);
    return JSON.parse(fs.readFileSync(full, 'utf-8')) as TripData;
  });
}

export function loadItems(): Item[] {
  const trips = loadTrips();
  const items = trips.flatMap((t) => t.items);
  items.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  items.forEach((item) => {
    if (item.map_query && item.map_query.trim()) {
      const link = appleMapsLink(item.map_query);
      const links = item.links ?? (item.links = []);
      const exists = links.some((l) => l.url === link.url);
      if (!exists) {
        links.unshift(link);
      }
    }
    const extra: Link[] = [];
    if (item.apple_maps_url) {
      extra.push({ title: 'Apple Maps', url: item.apple_maps_url });
    }
    const appleMapAppUrl =
      item.apple_maps_deeplink ?? (item.apple_maps_url ? appleMapsAppUrl(item.apple_maps_url) : undefined);
    if (appleMapAppUrl) {
      extra.push({ title: 'Apple Maps (App)', url: appleMapAppUrl });
    }
    if (item.apple_directions_url) {
      extra.push({ title: 'Apple Directions', url: item.apple_directions_url });
    }
    const appleDirectionsAppUrl =
      item.apple_directions_deeplink ??
      (item.apple_directions_url ? appleMapsAppUrl(item.apple_directions_url) : undefined);
    if (appleDirectionsAppUrl) {
      extra.push({ title: 'Apple Directions (App)', url: appleDirectionsAppUrl });
    }
    if (item.google_maps_url) {
      extra.push({ title: 'Google Maps', url: item.google_maps_url });
    }
    if (extra.length) {
      const links = item.links ?? (item.links = []);
      extra.forEach((l) => {
        if (!links.some((existing) => existing.url === l.url)) {
          links.push(l);
        }
      });
    }
  });
  return items;
}
