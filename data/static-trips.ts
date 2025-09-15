import type { TripData } from '@/lib/trips';
import montescudaio from './montescudaio.json';

const montescudaioTrip = montescudaio as TripData;

export const staticTrips: ReadonlyArray<TripData> = Object.freeze([
  Object.freeze(montescudaioTrip),
]);
