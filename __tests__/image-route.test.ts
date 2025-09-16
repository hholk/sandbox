import { NextRequest } from 'next/server';
import { GET, bufferToArrayBuffer } from '@/app/api/image/route';
import { clearImageCache } from '@/lib/server/image-cache';

describe('image proxy route', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.NODE_ENV;
  let fetchMock: jest.Mock;

  beforeEach(async () => {
    await clearImageCache();
    process.env.NODE_ENV = 'test';
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(async () => {
    await clearImageCache();
    global.fetch = originalFetch;
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  it('rejects requests without src parameter', async () => {
    const request = new NextRequest('http://localhost/api/image');
    const response = await GET(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Missing src query parameter' });
  });

  it('rejects disallowed hosts', async () => {
    const request = new NextRequest('http://localhost/api/image?src=https%3A%2F%2Fexample.com%2Ftest.jpg');
    const response = await GET(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Host not allowed' });
  });

  it('fetches and caches allowed images', async () => {
    const buffer = Buffer.from('test-image');
    const mockResponse = new Response(buffer, {
      status: 200,
      headers: { 'content-type': 'image/jpeg' },
    });
    fetchMock.mockResolvedValue(mockResponse);

    const url = 'https://upload.wikimedia.org/test.jpg';
    const firstRequest = new NextRequest(`http://localhost/api/image?src=${encodeURIComponent(url)}`);
    const first = await GET(firstRequest);
    expect(first.status).toBe(200);
    const firstBody = await first.arrayBuffer();
    expect(firstBody).toBeInstanceOf(ArrayBuffer);
    expect(Buffer.from(firstBody)).toEqual(buffer);

    const secondRequest = new NextRequest(`http://localhost/api/image?src=${encodeURIComponent(url)}`);
    const second = await GET(secondRequest);
    expect(second.status).toBe(200);
    const secondBody = await second.arrayBuffer();
    expect(secondBody).toBeInstanceOf(ArrayBuffer);
    expect(Buffer.from(secondBody)).toEqual(buffer);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('converts SharedArrayBuffer-backed buffers into standalone ArrayBuffers', () => {
    const shared = new SharedArrayBuffer(4);
    const view = new Uint8Array(shared);
    view.set([5, 6, 7, 8]);

    const buffer = Buffer.from(shared);
    const arrayBuffer = bufferToArrayBuffer(buffer);

    expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);
    expect(arrayBuffer.byteLength).toBe(4);
    expect(Buffer.from(arrayBuffer)).toEqual(Buffer.from([5, 6, 7, 8]));

    view.fill(0);
    expect(Buffer.from(arrayBuffer)).toEqual(Buffer.from([5, 6, 7, 8]));
  });
});
