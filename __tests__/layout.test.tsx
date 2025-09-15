import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout from '../app/layout';

describe('RootLayout', () => {
  it('renders children with antialiased class', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        RootLayout,
        null,
        React.createElement('div', null, 'child')
      )
    );
    expect(html).toContain('antialiased');
    expect(html).toContain('child');
  });
});
