import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-driftwood/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-display text-2xl text-deep-ocean hover:text-sea-glass transition-warm">
            IRB Rentals
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-driftwood hover:text-deep-ocean transition-warm">
              Home
            </Link>
            <Link href="/properties" className="text-driftwood hover:text-deep-ocean transition-warm">
              Properties
            </Link>
            <Link href="/about" className="text-driftwood hover:text-deep-ocean transition-warm">
              About
            </Link>
            <Link href="/faq" className="text-driftwood hover:text-deep-ocean transition-warm">
              FAQ
            </Link>
          </div>
          
          <Link
            href="/#availability"
            className="px-4 py-2 bg-sea-glass text-white rounded-lg hover:bg-sea-glass/90 transition-warm shadow-warm"
          >
            Check Availability
          </Link>
        </div>
      </div>
    </nav>
  );
}
