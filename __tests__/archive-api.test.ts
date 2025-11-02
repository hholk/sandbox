jest.mock('@/lib/trips', () => ({
  __esModule: true,
  loadTrips: jest.fn(() => [
    {
      meta: {
        base: 'test',
        max_drive_min: 60,
        date_window: '2024-01',
        sort: 'popularity',
      },
      items: [],
    },
  ]),
}));

import { GET } from '@/app/api/archive/route';
import { loadTrips } from '@/lib/trips';

describe('archive API', () => {
  it('returns archived trips with metadata', async () => {
    const response = GET();
    const json = await response.json();
    expect(json.archived).toBe(true);
    expect(json.archived_on).toBe('2024-05-27');
    expect(Array.isArray(json.trips)).toBe(true);
    expect(loadTrips).toHaveBeenCalled();
  });
});
