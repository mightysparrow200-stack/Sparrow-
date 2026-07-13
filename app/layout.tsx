import './globals.css'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-gray-50 text-gray-950 min-h-screen flex flex-col">
        {/* GLOBAL NAVIGATION HEADER */}
        <header className="bg-coopGreen sticky top-0 z-50 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
            
            {/* BRAND LOGO */}
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 bg-coopGold rounded-full flex items-center justify-center font-serif text-slate-950 font-bold text-lg">
                MS
              </div>
              <div className="block">
                <div className="font-serif text-white text-sm md:text-base leading-none">Mighty Sparrow Co-op</div>
                <div className="text-[10px] text-white/50 mt-0.5">Alumni Society</div>
              </div>
            </Link>

            {/* DECOUPLED INDEPENDENT PAGES LINK MENU */}
            <nav className="flex items-center gap-4 md:gap-6">
              <Link href="/" className="text-white/80 hover:text-white font-medium text-xs md:text-sm transition">Home</Link>
              <Link href="/shop" className="text-white/80 hover:text-white font-medium text-xs md:text-sm transition">Marketplace</Link>
              <Link href="/dashboard" className="text-white/80 hover:text-white font-medium text-xs md:text-sm transition">Portal</Link>
              <Link href="/admin" className="text-white/80 hover:text-white font-medium text-xs md:text-sm transition">Admin</Link>
            </nav>

          </div>
        </header>

        {/* Dynamic modular page slot injector */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
