import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout from '../app/layout';

describe('RootLayout', () => {
  it('applies Geist font variables', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        RootLayout,
        null,
        React.createElement('div', null, 'child')
      )
    );
    expect(html).toContain('--font-geist-sans');
    expect(html).toContain('--font-geist-mono');
  });
});
