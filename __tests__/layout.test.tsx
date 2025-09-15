import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout from '../app/layout';

describe('RootLayout', () => {
  it('applies IBM Plex font variables', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        RootLayout,
        null,
        React.createElement('div', null, 'child')
      )
    );
    expect(html).toContain('--font-ibm-plex-sans');
    expect(html).toContain('--font-ibm-plex-mono');
  });
});
