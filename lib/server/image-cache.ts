import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';
import { buildImageCacheKey } from '@/lib/image-proxy';

export interface CachedImage {
  readonly data: Buffer;
  readonly contentType: string;
  readonly createdAt: number;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const CACHE_ROOT = path.join(process.cwd(), '.next', 'cache', 'image-proxy');

const memoryCache = new Map<string, CachedImage>();

function isExpired(entry: CachedImage): boolean {
  return Date.now() - entry.createdAt > CACHE_TTL_MS;
}

function cachePathForSource(src: string): string {
  const key = buildImageCacheKey(src);
  return path.join(CACHE_ROOT, `${key}.json`);
}

async function ensureCacheDir(): Promise<void> {
  await fs.mkdir(CACHE_ROOT, { recursive: true }).catch((error: unknown) => {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  });
}

async function readFromDisk(src: string): Promise<CachedImage | null> {
  try {
    const file = cachePathForSource(src);
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw) as { contentType: string; data: string; createdAt: number };
    const entry: CachedImage = {
      contentType: parsed.contentType,
      data: Buffer.from(parsed.data, 'base64'),
      createdAt: parsed.createdAt,
    };
    if (isExpired(entry)) {
      await fs.unlink(file).catch(() => {});
      return null;
    }
    memoryCache.set(src, entry);
    return entry;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      return null;
    }
    if (err.name === 'SyntaxError') {
      // Corrupt cache entry – delete and skip.
      try {
        await fs.unlink(cachePathForSource(src));
      } catch {
        // ignore cleanup failures
      }
      return null;
    }
    throw err;
  }
}

async function writeToDisk(src: string, entry: CachedImage): Promise<void> {
  const file = cachePathForSource(src);
  const payload = JSON.stringify({
    contentType: entry.contentType,
    createdAt: entry.createdAt,
    data: entry.data.toString('base64'),
  });
  await ensureCacheDir();
  await fs.writeFile(file, payload, 'utf8');
}

export async function getCachedImage(src: string): Promise<CachedImage | null> {
  const existing = memoryCache.get(src);
  if (existing && !isExpired(existing)) {
    return existing;
  }
  memoryCache.delete(src);
  return readFromDisk(src);
}

export async function setCachedImage(src: string, entry: CachedImage): Promise<void> {
  memoryCache.set(src, entry);
  try {
    await writeToDisk(src, entry);
  } catch (error) {
    // Ignore write errors (e.g., read-only file systems)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Failed to persist image cache entry:', error);
    }
  }
}

export async function clearImageCache(): Promise<void> {
  memoryCache.clear();
  try {
    await fs.rm(CACHE_ROOT, { recursive: true, force: true });
  } catch {
    // ignore cleanup failures
  }
}
