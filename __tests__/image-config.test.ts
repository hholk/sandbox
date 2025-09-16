import { buildImageProxyUrl, isAllowedImageHost } from '@/lib/image-proxy';

describe('image proxy helpers', () => {
  it('builds a proxied url with encoded source', () => {
    const url = 'https://upload.wikimedia.org/test image.jpg';
    const proxy = buildImageProxyUrl(url);
    const parsed = new URL(proxy, 'http://localhost');
    expect(parsed.pathname).toBe('/api/image');
    expect(parsed.searchParams.get('src')).toBe(url);
    expect(parsed.searchParams.has('v')).toBe(true);
  });

  it('only allows whitelisted hosts', () => {
    expect(isAllowedImageHost(new URL('https://upload.wikimedia.org/foo.jpg'))).toBe(true);
    expect(isAllowedImageHost(new URL('https://images.unsplash.com/photo.jpg'))).toBe(true);
    expect(isAllowedImageHost(new URL('https://example.com/bar.jpg'))).toBe(false);
  });
});
