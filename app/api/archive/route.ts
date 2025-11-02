import { NextResponse } from 'next/server';
import { loadTrips } from '@/lib/trips';

const ARCHIVE_DATE_ISO = '2024-05-27';

/**
 * Expose the archived trip dataset as JSON so future travellers can download
 * it in one request. The handler stays synchronous because the data already
 * lives on disk within the repository.
 */
export function GET() {
  const trips = loadTrips();
  return NextResponse.json(
    {
      archived: true,
      archived_on: ARCHIVE_DATE_ISO,
      trips,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    }
  );
}
