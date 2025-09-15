import config from '../next.config';

describe('image remotePatterns configuration', () => {
  it('allows wikimedia and unsplash', () => {
    const patterns = config.images?.remotePatterns ?? [];
    const hosts = patterns.map((p) => p.hostname);
    expect(hosts).toEqual(
      expect.arrayContaining(['upload.wikimedia.org', 'images.unsplash.com'])
    );
  });
});
