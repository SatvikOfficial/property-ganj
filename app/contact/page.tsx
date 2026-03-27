"use client"

import Header from "@/components/header"
import Link from "next/link"
import { Mail, MessageCircle, Phone, Clock, ArrowRight } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-br from-primary/10 via-accent/15 to-background py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-primary font-bold">Support</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-foreground">
              Contact PropertyGanj
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Need help with a listing, verification, or account? Reach us on the channel that’s easiest for you.
              We typically respond within a few hours during business times.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="mailto:propertyganj@outlook.com"
              className="card-premium p-6 border border-border hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <span className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground truncate">propertyganj@outlook.com</p>
                  <p className="mt-3 text-sm font-semibold text-primary flex items-center gap-2">
                    Send an email <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/919335909050"
              target="_blank"
              rel="noreferrer"
              className="card-premium p-6 border border-border hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <span className="h-11 w-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <MessageCircle className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-foreground">WhatsApp</p>
                  <p className="text-sm text-muted-foreground truncate">+91 93359 09050</p>
                  <p className="mt-3 text-sm font-semibold text-secondary flex items-center gap-2">
                    Chat on WhatsApp <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </div>
            </a>

            <a
              href="tel:+919335909050"
              className="card-premium p-6 border border-border hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-4">
                <span className="h-11 w-11 rounded-2xl bg-accent/30 text-foreground flex items-center justify-center">
                  <Phone className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-foreground">Call</p>
                  <p className="text-sm text-muted-foreground truncate">+91 93359 09050</p>
                  <p className="mt-3 text-sm font-semibold text-foreground flex items-center gap-2">
                    Call now <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <span className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center">
                <Clock className="size-5 text-muted-foreground" />
              </span>
              <div>
                <p className="font-bold text-foreground">Support hours</p>
                <p className="text-sm text-muted-foreground">
                  Mon–Sat, 10:00 AM–7:00 PM (IST). For urgent listing issues, include the property link in your message.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/search?q=Lucknow"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Browse listings
            </Link>
            <Link
              href="/list-property"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold text-foreground hover:bg-accent transition"
            >
              Post a property
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

