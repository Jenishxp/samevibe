import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import '@fontsource-variable/bricolage-grotesque';
import './globals.css';

export const metadata: Metadata = {
  title: 'SameVibe: flatmates who live like you',
  description: 'Match with flatmates by budget, sleep time, cleaning, smoking and pets. Same habits, same vibe.',
};
export const viewport: Viewport = { themeColor: '#08080a', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="top">
            <Link href="/" className="brand">samevibe</Link>
            <nav>
              <Link href="/matches">Matches</Link>
              <Link href="/profile">My profile</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
