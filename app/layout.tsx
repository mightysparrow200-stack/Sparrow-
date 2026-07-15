import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Header from './Header';
import { CoOpProvider } from './CoOpState';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Mighty Sparrow Alumni Co-op',
  description: 'Securing institutional resources and maximizing alumni wealth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col justify-between selection:bg-coopGold/30">
        
        <CoOpProvider>
          {/* Imported Dynamic Header Component */}
          <Header />

          {/* PAGE CONTENT CONTAINER */}
          <main className="flex-grow">
            {children}
          </main>

          {/* COOP FOOTER */}
          <footer className="bg-slate-900 text-gray-400 text-center py-6 px-4 border-t border-slate-800 mt-12">
            <div className="max-w-5xl mx-auto text-xs space-y-1.5">
              <p className="text-gray-300 font-semibold">© 2026 Mighty Sparrow Alumni Cooperative Society Ltd.</p>
              <p className="text-gray-500">Empowering members through pooled capital and shared agricultural excellence.</p>
            </div>
          </footer>
        </CoOpProvider>

      </body>
    </html>
  );
}
