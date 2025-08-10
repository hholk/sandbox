import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ramos Analytics – Understand Your Data',
  description: 'B2B analytics platform for A/B tests, trends and alerts.',
  openGraph: {
    title: 'Ramos Analytics',
    description: 'B2B analytics platform for A/B tests, trends and alerts.',
    url: 'https://example.com',
    siteName: 'Ramos Analytics',
    images: [],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ramos Analytics',
    description: 'B2B analytics platform for A/B tests, trends and alerts.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-body">{children}</body>
    </html>
  );
}
