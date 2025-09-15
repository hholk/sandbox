import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Montescudaio Roadbook',
  description: 'Curated day trips and experiences around Montescudaio with practical planning details.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
