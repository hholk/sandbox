import crypto from 'crypto';

/** Allowed remote hosts that can be proxied through the image handler. */
export const ALLOWED_IMAGE_HOSTS = Object.freeze([
  'upload.wikimedia.org',
  'images.unsplash.com',
]);

const REMOTE_IMAGE_PATTERN = /^https?:\/\//i;

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
 * Determine whether the provided image source references a remote HTTP(S)
 * endpoint. The check runs in O(k) time, where k is the source length,
 * because it only inspects the leading characters.
 */
export function isRemoteImageSource(src: string): boolean {
  return REMOTE_IMAGE_PATTERN.test(src);
}

/**
 * Normalize any image source so the UI can render both remote and locally
 * bundled assets without special casing. Remote URLs are proxied through the
 * API handler while relative paths are coerced into root-relative references.
 *
 * The transformation executes in O(k) time for a source of length k because
 * it performs a single trim operation and at most one concatenation.
 */
export function resolveImageSrc(src: string): string {
  const trimmed = src.trim();
  if (trimmed.length === 0) {
    throw new Error('Image source must be a non-empty string');
  }
  if (isRemoteImageSource(trimmed)) {
    return buildImageProxyUrl(trimmed);
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/**
 * Validate that a URL targets an allowed host so we avoid SSRF issues when
 * proxying remote images. The check runs in O(m) time where m is the hostname
 * length.
 */
export function isAllowedImageHost(url: URL): boolean {
  return ALLOWED_IMAGE_HOSTS.includes(url.hostname);
}
