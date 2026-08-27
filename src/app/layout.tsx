import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VedaAI - AI Teacher Toolkit',
  description: 'AI Assessment Extraction & Answer Mapping',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50/50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
