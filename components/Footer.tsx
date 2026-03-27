import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-6">
      <div className="w-full">
        {/* Desktop: 4 columns grid */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="Property Ganj Logo" className="w-10 h-10 object-contain" />
              <img src="/logotext.png" alt="Property Ganj" className="h-10 object-contain" />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Your trusted platform for property buying, renting, and selling in Lucknow.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-primary-foreground/80 hover:text-white text-sm">Home</Link></li>
              <li><Link href="/search" className="text-primary-foreground/80 hover:text-white text-sm">Search</Link></li>
              <li><Link href="/list-property" className="text-primary-foreground/80 hover:text-white text-sm">List Property</Link></li>
              <li><Link href="/blog" className="text-primary-foreground/80 hover:text-white text-sm">Property Insights</Link></li>
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-white text-sm">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2">
              <li><Link href="/search?propertyType=apartment" className="text-primary-foreground/80 hover:text-white text-sm">Apartments</Link></li>
              <li><Link href="/search?propertyType=house" className="text-primary-foreground/80 hover:text-white text-sm">Houses</Link></li>
              <li><Link href="/search?propertyType=plot" className="text-primary-foreground/80 hover:text-white text-sm">Plots</Link></li>
              <li><Link href="/search?propertyType=commercial" className="text-primary-foreground/80 hover:text-white text-sm">Commercial</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <ul className="space-y-2">
              <li><Link href="mailto:propertyganj@outlook.com" className="text-primary-foreground/80 hover:text-white text-sm">Email Us</Link></li>
              <li><Link href="https://wa.me/919335909050" target="_blank" className="text-primary-foreground/80 hover:text-white text-sm">WhatsApp</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/80 hover:text-white text-sm">Contact</Link></li>
              <li><Link href="/help" className="text-primary-foreground/80 hover:text-white text-sm">Help Center</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Mobile: Collapsed accordion-style layout */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.jpg" alt="Property Ganj Logo" className="w-10 h-10 object-contain" />
            <img src="/logotext.png" alt="Property Ganj" className="h-10 object-contain" />
          </div>
          <p className="text-primary-foreground/80 text-sm mb-4">
            Your trusted platform for property buying, renting, and selling in Lucknow.
          </p>
          
          {/* Mobile Accordion Sections */}
          <details className="group">
            <summary className="font-semibold cursor-pointer py-2 px-2 rounded-md hover:bg-white/10 flex justify-between items-center">
              <span>Quick Links</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="py-2 pl-4 space-y-2">
              <p><Link href="/" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Home</Link></p>
              <p><Link href="/search" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Search</Link></p>
              <p><Link href="/list-property" className="text-primary-foreground/80 hover:text-white text-sm block py-1">List Property</Link></p>
              <p><Link href="/blog" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Property Insights</Link></p>
              <p><Link href="/about" className="text-primary-foreground/80 hover:text-white text-sm block py-1">About Us</Link></p>
            </div>
          </details>
          
          <details className="group">
            <summary className="font-semibold cursor-pointer py-2 px-2 rounded-md hover:bg-white/10 flex justify-between items-center">
              <span>Property Types</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="py-2 pl-4 space-y-2">
              <p><Link href="/search?propertyType=apartment" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Apartments</Link></p>
              <p><Link href="/search?propertyType=house" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Houses</Link></p>
              <p><Link href="/search?propertyType=plot" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Plots</Link></p>
              <p><Link href="/search?propertyType=commercial" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Commercial</Link></p>
            </div>
          </details>
          
          <details className="group">
            <summary className="font-semibold cursor-pointer py-2 px-2 rounded-md hover:bg-white/10 flex justify-between items-center">
              <span>Connect With Us</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="py-2 pl-4 space-y-2">
              <p><Link href="mailto:propertyganj@outlook.com" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Email Us</Link></p>
              <p><Link href="https://wa.me/919335909050" target="_blank" className="text-primary-foreground/80 hover:text-white text-sm block py-1">WhatsApp</Link></p>
              <p><Link href="/contact" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Contact</Link></p>
              <p><Link href="/help" className="text-primary-foreground/80 hover:text-white text-sm block py-1">Help Center</Link></p>
            </div>
          </details>
        </div>
      </div>
      <div className="w-full pt-3 border-t border-primary/30 text-center text-xs text-primary-foreground/60">
        <p>&copy; {new Date().getFullYear()} Property Ganj. All rights reserved.</p>
      </div>
    </footer>
  );
}