import crypto from 'crypto';

/** Allowed remote hosts that can be proxied through the image handler. */
export const ALLOWED_IMAGE_HOSTS = Object.freeze([
  'upload.wikimedia.org',
  'images.unsplash.com',
]);

const CACHE_BUSTER = crypto.createHash('sha1').update(process.env.NODE_ENV ?? 'development').digest('hex').slice(0, 8);

/**
 * Build a deterministic cache key for an image source URL. Runs in O(n) time
 * where n is the length of the source string because it hashes every
 * character exactly once.
 */
export function buildImageCacheKey(src: string): string {
  return crypto.createHash('sha256').update(src).digest('hex');
}

/**
 * Construct the API route used to proxy and cache remote images.
 */
export function buildImageProxyUrl(src: string): string {
  const params = new URLSearchParams({ src, v: CACHE_BUSTER });
  return `/api/image?${params.toString()}`;
}

/**
 * Validate that a URL targets an allowed host so we avoid SSRF issues when
 * proxying remote images. The check runs in O(m) time where m is the hostname
 * length.
 */
export function isAllowedImageHost(url: URL): boolean {
  return ALLOWED_IMAGE_HOSTS.includes(url.hostname);
}
