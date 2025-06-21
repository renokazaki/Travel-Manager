import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TripTogether | Group Travel Made Simple',
  description: 'Coordinate travel plans, manage budgets, and split expenses with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ClerkProvider>
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <main>
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
    // </ClerkProvider>
  );
}