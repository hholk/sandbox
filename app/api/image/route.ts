import { NextRequest } from 'next/server';
import { Buffer } from 'buffer';
import { isAllowedImageHost } from '@/lib/image-proxy';
import { CachedImage, getCachedImage, setCachedImage } from '@/lib/server/image-cache';

const MAX_IMAGE_BYTES = 2_500_000; // 2.5 MB upper bound per image
const CACHE_CONTROL_HEADER = 'public, max-age=86400, stale-while-revalidate=604800';

function buildErrorResponse(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Creates a standalone {@link ArrayBuffer} copy from a Node.js {@link Buffer}.
 *
 * When a buffer is backed by a {@link SharedArrayBuffer}, the Web Response API
 * rejects it. Copying guarantees the return type is always a regular
 * {@link ArrayBuffer} instance.
 *
 * ```ts
 * const example = bufferToArrayBuffer(Buffer.from([1, 2, 3]));
 * console.log(example.byteLength); // 3
 * ```
 *
 * The copy runs in O(n) time where n equals the buffer length.
 */
export function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const { buffer: underlying, byteOffset, byteLength } = buffer;
  if (underlying instanceof ArrayBuffer) {
    return underlying.slice(byteOffset, byteOffset + byteLength);
  }

  const arrayBuffer = new ArrayBuffer(byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}

async function fetchRemoteImage(src: string): Promise<CachedImage> {
  const response = await fetch(src, {
    headers: {
      Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to load image: ${response.status} ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error('Image too large to cache');
  }
  const data = Buffer.from(arrayBuffer);
  return {
    contentType,
    data,
    createdAt: Date.now(),
  };
}

export async function GET(request: NextRequest): Promise<Response> {
  const src = request.nextUrl.searchParams.get('src');
  if (!src) {
    return buildErrorResponse('Missing src query parameter');
  }

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return buildErrorResponse('Invalid image URL');
  }

  if (!isAllowedImageHost(parsed)) {
    return buildErrorResponse('Host not allowed');
  }

  try {
    const cached = await getCachedImage(src);
    if (cached) {
      return new Response(bufferToArrayBuffer(cached.data), {
        status: 200,
        headers: {
          'content-type': cached.contentType,
          'cache-control': CACHE_CONTROL_HEADER,
        },
      });
    }

    const fresh = await fetchRemoteImage(src);
    await setCachedImage(src, fresh);
    return new Response(bufferToArrayBuffer(fresh.data), {
      status: 200,
      headers: {
        'content-type': fresh.contentType,
        'cache-control': CACHE_CONTROL_HEADER,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Image proxy failed', error);
    }
    return buildErrorResponse('Unable to load image', 502);
  }
}

export const runtime = 'nodejs';
export const preferredRegion = 'auto';

export const dynamic = 'force-dynamic';
