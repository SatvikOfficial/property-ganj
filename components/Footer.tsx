import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Mail, PhoneCall, Search } from 'lucide-react';

const footerSections = [
  {
    title: 'Explore',
    links: [
      { label: 'Buy homes', href: '/search?purpose=sale' },
      { label: 'Rent homes', href: '/search?purpose=rent' },
      { label: 'New launches', href: '/search?purpose=sale&q=New%20Projects' },
      { label: 'Property insights', href: '/blog' },
    ],
  },
  {
    title: 'For Sellers',
    links: [
      { label: 'List a property', href: '/list-property' },
      { label: 'My ads', href: '/profile/my-ads' },
      { label: 'Agent dashboard', href: '/agent' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'About PropertyGanj', href: '/about' },
      { label: 'Help center', href: '/help' },
      { label: 'Home loans', href: '/home-loans' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
];

const marketChips = ['Lucknow', 'Noida', 'Greater Noida', 'Ghaziabad'];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#1d2b31] bg-[#081417] text-[#f7efe5]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-40 w-40 rounded-full bg-[#eb6239]/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-4rem] h-48 w-48 rounded-full bg-[#1f5660]/14 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 max-md:gap-6 px-4 py-8 max-md:py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6 max-md:gap-4 rounded-[28px] border border-white/10 bg-white/[0.045] px-4 max-md:px-3.5 py-5 max-md:py-4 shadow-[0_22px_60px_-40px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:px-5 sm:py-6 lg:flex-row lg:items-center lg:justify-between" data-mobile-reveal="pending">
          <div className="max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-3 transition-opacity duration-300 hover:opacity-90">
              <Image
                src="/logo.jpg"
                alt="PropertyGanj logo"
                width={42}
                height={42}
                className="h-[42px] w-[42px] rounded-xl object-cover"
              />
              <Image
                src="/logotext.png"
                alt="PropertyGanj"
                width={164}
                height={32}
                className="h-[32px] w-[164px] object-contain"
              />
            </Link>

            <p className="mt-3 max-w-xl text-sm max-md:text-[13px] leading-6 max-md:leading-5 text-[#d7c8bc]">
              Search serious listings, shortlist smarter, and connect with trusted agents, builders, and owners across high-intent markets.
            </p>

            <div className="pg-mobile-scroll-row mt-4 gap-2 md:flex md:flex-wrap md:overflow-visible md:pb-0">
              {marketChips.map((chip) => (
                <span
                  key={chip}
                  className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-[#f7efe5]/90"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 max-md:gap-2.5 sm:flex-row">
            <Link
              href="/search?purpose=sale"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#eb6239] px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f07650] hover:shadow-[0_18px_40px_-20px_rgba(235,98,57,0.6)] sm:w-auto sm:py-2.5"
            >
              <Search className="h-4 w-4" />
              Browse homes
            </Link>
            <Link
              href="/list-property"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f3c7b7]/70 hover:bg-white/10 sm:w-auto sm:py-2.5"
            >
              <Building2 className="h-4 w-4" />
              List property
            </Link>
          </div>
        </section>

        <section className="grid gap-6 max-md:gap-4 lg:grid-cols-[1.2fr,0.8fr]" data-mobile-reveal="pending">
          <div className="grid grid-cols-2 gap-6 max-md:gap-x-4 max-md:gap-y-5 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f3c7b7]">{section.title}</h3>
                <ul className="mt-3 space-y-2 max-md:mt-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm max-md:text-[13px] text-[#d7c8bc] transition-all duration-300 hover:translate-x-1 hover:text-white"
                      >
                        <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid gap-3 max-md:gap-2.5 sm:grid-cols-2">
            <a
              href="mailto:propertyganj@outlook.com"
              className="flex min-h-11 items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 px-4 max-md:px-3.5 py-3 max-md:py-2.5 text-sm max-md:text-[13px] text-[#f7efe5] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f3c7b7]/60 hover:bg-white/10"
            >
              <Mail className="h-4 w-4 text-[#eb9d7e]" />
              propertyganj@outlook.com
            </a>
            <a
              href="https://wa.me/919335909050"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 px-4 max-md:px-3.5 py-3 max-md:py-2.5 text-sm max-md:text-[13px] text-[#f7efe5] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f3c7b7]/60 hover:bg-white/10"
            >
              <PhoneCall className="h-4 w-4 text-[#eb9d7e]" />
              WhatsApp support
            </a>
          </div>
        </section>

        <section className="flex flex-col gap-3 max-md:gap-2 border-t border-white/10 pt-4 max-md:pt-3 text-sm max-md:text-[13px] text-[#bfae9f] sm:flex-row sm:items-center sm:justify-between" data-mobile-reveal="pending">
          <p>&copy; {new Date().getFullYear()} PropertyGanj. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="transition-colors duration-300 hover:text-white">
              About
            </Link>
            <Link href="/help" className="transition-colors duration-300 hover:text-white">
              Help
            </Link>
            <Link href="/contact" className="transition-colors duration-300 hover:text-white">
              Contact
            </Link>
          </div>
        </section>
      </div>
    </footer>
  );
}
