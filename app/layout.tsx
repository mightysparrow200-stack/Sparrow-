import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Link from 'next/link';
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
        
        {/* WE WRAP THE ENTIRE BODY IN COOPPROVIDER */}
        <CoOpProvider>
          
          {/* GLOBAL NAVIGATION HEADER */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-150 px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              
              {/* Logo Group */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="bg-coopGreen text-coopGold w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover:scale-105 transition">
                  MS
                </span>
                <div className="leading-tight">
                  <span className="block text-xs font-bold text-slate-900 tracking-tight">Mighty Sparrow Co-op</span>
                  <span className="block text-[10px] text-gray-400">Alumni Society</span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="flex items-center gap-1 sm:gap-2">
                <Link 
                  href="/" 
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-coopGreen hover:bg-gray-100 transition"
                >
                  Home
                </Link>
                <Link 
                  href="/shop" 
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-coopGreen hover:bg-gray-100 transition"
                >
                  Marketplace
                </Link>
                <Link 
                  href="/dashboard" 
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-coopGreen hover:bg-gray-100 transition"
                >
                  Portal
                </Link>
                <Link 
                  href="/admin" 
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-coopGreen hover:bg-gray-100 transition"
                >
                  Admin
                </Link>
              </nav>

            </div>
          </header>

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
