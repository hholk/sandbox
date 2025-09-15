import fs from 'fs';
import path from 'path';

export interface Link {
  title: string;
  url: string;
}

export interface Item {
  id: string;
  name: string;
  category: string[];
  popularity: number;
  drive_min: number;
  description: string;
  planning: string;
  organizing: string;
  links: Link[];
  image: string;
  map_query: string;
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
  items.sort((a, b) => b.popularity - a.popularity);
  return items;
}
