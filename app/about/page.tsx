"use client";

import Header from '@/components/header';
import Link from 'next/link';
import { Building2, Search, Users, Shield, TrendingUp, Heart, MapPin, Phone, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/20 to-background py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="text-primary">PropertyGanj</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in finding the perfect property in Lucknow. We connect buyers, renters, 
            and property owners to make real estate transactions seamless, transparent, and stress-free.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                To revolutionize the real estate experience by providing a platform that is user-friendly, 
                transparent, and efficient. We believe everyone deserves to find their dream property with ease.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're committed to making property search and transactions accessible to everyone, 
                whether you're buying your first home, investing in real estate, or looking for the perfect rental.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Customer First</h3>
                    <p className="text-sm text-muted-foreground">
                      Your satisfaction is our top priority. We're here to make your property journey smooth and enjoyable.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Trust & Transparency</h3>
                    <p className="text-sm text-muted-foreground">
                      All listings are verified to ensure authenticity. No hidden fees, no surprises.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Innovation</h3>
                    <p className="text-sm text-muted-foreground">
                      We leverage cutting-edge technology to provide the best property search experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-accent/20 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">Advanced Search</h3>
              <p className="text-muted-foreground text-sm">
                Powerful filters help you find exactly what you're looking for - by location, price, size, and more.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">Verified Listings</h3>
              <p className="text-muted-foreground text-sm">
                All properties are verified to ensure authenticity and accuracy. Browse with confidence.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">Direct Contact</h3>
              <p className="text-muted-foreground text-sm">
                Connect directly with property owners, agents, and builders without intermediaries.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">Location Insights</h3>
              <p className="text-muted-foreground text-sm">
                Get detailed information about neighborhoods, amenities, and local attractions.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">Free Listings</h3>
              <p className="text-muted-foreground text-sm">
                List your property for free and reach thousands of potential buyers and renters.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">Market Insights</h3>
              <p className="text-muted-foreground text-sm">
                Stay informed with property trends, price insights, and market analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Why Choose PropertyGanj?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/5 to-accent/10 p-8 rounded-2xl border border-primary/20">
              <h3 className="font-bold text-foreground text-xl mb-4">For Buyers & Renters</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Comprehensive property listings with detailed information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Advanced search filters to find your perfect match</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Direct contact with property owners and agents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Save your favorite properties for later</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Get notified about new listings matching your criteria</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-primary/5 p-8 rounded-2xl border border-accent/20">
              <h3 className="font-bold text-foreground text-xl mb-4">For Property Owners</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>List your property for free - no hidden charges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Reach thousands of potential buyers and renters</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Manage your listings easily from your dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Get inquiries directly from interested parties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Track views and engagement on your listings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Insights Section */}
      <section className="bg-accent/20 py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">Property Ganj Insights</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Stay updated with our latest articles on property trends, investment tips, and market analysis in Lucknow
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/blog/1" className="block group">
              <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col md:flex-row">
                <div className="w-full sm:w-16 h-16 bg-gradient-to-r from-primary to-accent md:w-20 md:h-full flex-shrink-0"></div>
                <div className="p-2 md:p-4 flex-1">
                  <h3 className="font-bold text-foreground text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">Understanding Circle Rates in Lucknow: A Complete Guide</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 group-hover:text-foreground transition-colors">Learn how circle rates affect property prices in Lucknow and how they impact your property investment decisions.</p>
                </div>
              </div>
            </Link>

            <Link href="/blog/3" className="block group">
              <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col md:flex-row">
                <div className="w-full sm:w-16 h-16 bg-gradient-to-r from-secondary to-accent md:w-20 md:h-full flex-shrink-0"></div>
                <div className="p-2 md:p-4 flex-1">
                  <h3 className="font-bold text-foreground text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">Stamp Duty and Registration Charges in Lucknow: What You Need to Know</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 group-hover:text-foreground transition-colors">Complete guide to stamp duty and registration charges for property transactions in Lucknow.</p>
                </div>
              </div>
            </Link>

            <Link href="/blog/6" className="block group">
              <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col md:flex-row">
                <div className="w-full sm:w-16 h-16 bg-gradient-to-r from-accent to-primary md:w-20 md:h-full flex-shrink-0"></div>
                <div className="p-2 md:p-4 flex-1">
                  <h3 className="font-bold text-foreground text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">Top Localities for Property Investment in Lucknow 2025</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 group-hover:text-foreground transition-colors">Explore the best localities in Lucknow for real estate investment this year.</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-3 md:mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm md:text-base"
            >
              View All Articles
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Loan & Finance Section */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">Loan & Finance</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive guides and resources for home loans, financing, and property investment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/blog/1" className="block group">
              <div className="bg-card rounded-lg border border-border hover:shadow-lg transition-shadow h-full flex flex-col md:flex-row">
                <div className="w-16 h-16 bg-primary/10 rounded-l-lg md:rounded-l-lg md:rounded-r-none md:w-20 md:h-full flex-shrink-0 flex items-center justify-center md:rounded-r-lg md:rounded-l-none">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="p-2 md:p-4 flex-1">
                  <h3 className="font-bold text-foreground text-xs sm:text-sm md:text-base mb-1 group-hover:text-secondary transition-colors">Home Loan Eligibility: How to Check Your Qualification</h3>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">Complete guide to determining your home loan eligibility based on income, credit score, and other factors.</p>
                </div>
              </div>
            </Link>

            <Link href="/blog/2" className="block group">
              <div className="bg-card rounded-lg border border-border hover:shadow-lg transition-shadow h-full flex flex-col md:flex-row">
                <div className="w-16 h-16 bg-primary/10 rounded-l-lg md:rounded-l-lg md:rounded-r-none md:w-20 md:h-full flex-shrink-0 flex items-center justify-center md:rounded-r-lg md:rounded-l-none">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="p-2 md:p-4 flex-1">
                  <h3 className="font-bold text-foreground text-xs sm:text-sm md:text-base mb-1 group-hover:text-secondary transition-colors">Interest Rates and EMI Calculations: A Complete Guide</h3>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">Learn how interest rates affect your EMI and how to calculate your monthly payments.</p>
                </div>
              </div>
            </Link>

            <Link href="/blog/3" className="block group">
              <div className="bg-card rounded-lg border border-border hover:shadow-lg transition-shadow h-full flex flex-col md:flex-row">
                <div className="w-16 h-16 bg-primary/10 rounded-l-lg md:rounded-l-lg md:rounded-r-none md:w-20 md:h-full flex-shrink-0 flex items-center justify-center md:rounded-r-lg md:rounded-l-none">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="p-2 md:p-4 flex-1">
                  <h3 className="font-bold text-foreground text-xs sm:text-sm md:text-base mb-1 group-hover:text-secondary transition-colors">Top Banks for Home Loans in Lucknow: Compare Interest Rates</h3>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">Compare home loan rates and features from the best banks operating in Lucknow.</p>
                </div>
              </div>
            </Link>

            <Link href="/blog/4" className="block group">
              <div className="bg-card rounded-lg border border-border hover:shadow-lg transition-shadow h-full flex flex-col md:flex-row">
                <div className="w-16 h-16 bg-primary/10 rounded-l-lg md:rounded-l-lg md:rounded-r-none md:w-20 md:h-full flex-shrink-0 flex items-center justify-center md:rounded-r-lg md:rounded-l-none">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="p-2 md:p-4 flex-1">
                  <h3 className="font-bold text-foreground text-xs sm:text-sm md:text-base mb-1 group-hover:text-secondary transition-colors">Home Loan Documents: Complete Checklist for Property Buyers</h3>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">Essential documents required for home loan approval and property purchase.</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-3 md:mt-8">
            <Link
              href="/loan-finance"
              className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline text-sm md:text-base"
            >
              Explore Loan Options
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-lg mb-8 opacity-90">
            Start your property search today or list your property for free
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/search" 
              className="bg-background text-foreground px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors"
            >
              Browse Properties
            </Link>
            <Link 
              href="/list-property" 
              className="bg-accent text-accent-foreground px-8 py-3 rounded-full font-semibold hover:bg-accent/80 transition-colors"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-xl border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Email Us</h3>
                  <p className="text-muted-foreground text-sm">support@propertyganj.com</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-8 rounded-xl border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Call Us</h3>
                  <p className="text-muted-foreground text-sm">+91 1800-XXX-XXXX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
