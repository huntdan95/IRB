import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-deep-ocean text-sand mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-2xl mb-4">IRB Condos</h3>
            <p className="text-sand/80 mb-4">
              Your Gulf Coast escape awaits. Experience the best of Indian Rocks Beach in our
              beachfront condos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sand/80 hover:text-sea-glass transition-warm">
                Instagram
              </a>
              <a href="#" className="text-sand/80 hover:text-sea-glass transition-warm">
                Facebook
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sand/80 hover:text-sea-glass transition-warm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-sand/80 hover:text-sea-glass transition-warm">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sand/80 hover:text-sea-glass transition-warm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sand/80 hover:text-sea-glass transition-warm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-sand/80">
              <li>
                <a href="mailto:info@irbrentals.com" className="hover:text-sea-glass transition-warm">
                  info@irbrentals.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-sea-glass transition-warm">
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-driftwood/20 mt-8 pt-8 flex items-center justify-center text-sand/60 text-sm relative min-h-[3rem]">
          <p>&copy; {new Date().getFullYear()} IRB Condos. All rights reserved.</p>
          <Link
            href="/admin/login"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded text-driftwood/70 hover:text-sand/90 transition-warm focus:outline-none focus:ring-2 focus:ring-sea-glass/50 focus:ring-offset-2 focus:ring-offset-deep-ocean"
            aria-label="Owner Login"
            title="Owner Login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
