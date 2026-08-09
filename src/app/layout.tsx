import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LUMIO FITS | AI Virtual Shirt Try-On & 3D Fitting Room',
  description: 'Experience your next shirt before you buy it. Photorealistic AI photo try-on, real-time 3D camera pose tracking, and natural-language search.',
  keywords: ['Virtual Try On', 'AI Fashion', '3D Fitting Room', 'MediaPipe Pose Tracking', 'React Three Fiber', 'Shirts Collection'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-fashion-dark text-slate-100 antialiased selection:bg-fashion-accent selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
