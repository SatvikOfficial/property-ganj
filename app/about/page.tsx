import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, HeartHandshake, MapPinned, ShieldCheck, Sparkles, TrendingUp } from "lucide-react"

import Header from "@/components/header"

const values = [
  {
    icon: ShieldCheck,
    title: "Trust before traffic",
    copy: "We would rather present fewer, cleaner decisions than inflate the experience with noise.",
  },
  {
    icon: MapPinned,
    title: "Locality-first thinking",
    copy: "Search is sharper when it reflects how people actually live across Lucknow, not just how forms are structured.",
  },
  {
    icon: HeartHandshake,
    title: "Human support",
    copy: "Support matters most when the decision becomes expensive, emotional, or time-sensitive.",
  },
]

const platformPillars = [
  "Verified listings and clearer property presentation",
  "Market and locality guidance that supports decisions",
  "Search flows built for buyers, renters, and sellers",
  "Loan support that reduces friction after shortlisting",
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf8f3_0%,#f8fafc_28%,#fff6ee_100%)]">
      <Header />

      <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-[#eddccd] bg-white shadow-[0_24px_80px_rgba(16,35,36,0.08)]">
          <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#fff9f2_0%,#ffffff_58%,#eef6ff_100%)] px-6 py-8 text-foreground sm:px-8 sm:py-10">
              <Image
                src="/apartment-complex-lucknow.jpg"
                alt="PropertyGanj city living"
                fill
                sizes="(max-width: 1280px) 100vw, 60vw"
                className="object-cover opacity-24"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.9)_40%,rgba(248,250,252,0.72)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(235,98,57,0.12),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(82,168,255,0.16),transparent_24%)]" />

              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  About PropertyGanj
                </span>
                <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                  A premium real-estate experience shaped around clarity, local knowledge, and trust.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  PropertyGanj is built for people who want better decisions, not just more listings. We bring search, support, editorial insight, and finance guidance into one refined platform for Lucknow.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Search focus", value: "Lucknow-first" },
                    { label: "Property view", value: "Premium + practical" },
                    { label: "Support style", value: "Concierge-led" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[22px] border border-[#f1dfcf] bg-white/85 px-4 py-4 shadow-[0_10px_24px_rgba(16,35,36,0.05)] backdrop-blur">
                      <p className="text-lg font-semibold text-primary">{item.value}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,#fff9f2_0%,#ffffff_100%)] p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">What guides the platform</p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground">We optimize for confidence at the moment a user needs to act.</h2>
              <div className="mt-6 space-y-4">
                {values.map(({ icon: Icon, title, copy }) => (
                  <div key={title} className="rounded-[24px] border border-[#f1dfcf] bg-white p-5 shadow-[0_10px_28px_rgba(16,35,36,0.04)]">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)]">
          <div className="rounded-[30px] border border-[#eddccd] bg-white p-6 shadow-[0_16px_48px_rgba(16,35,36,0.06)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Our role in the journey</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">From discovery to decision, the platform is designed to reduce uncertainty.</h2>
            <div className="mt-6 space-y-3">
              {platformPillars.map((pillar) => (
                <div key={pillar} className="rounded-[22px] border border-[#f1dfcf] bg-[#fffaf4] px-4 py-4 text-sm leading-6 text-muted-foreground">
                  {pillar}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="overflow-hidden rounded-[30px] border border-[#eddccd] bg-white shadow-[0_16px_48px_rgba(16,35,36,0.06)]">
              <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
                <div className="relative min-h-[220px]">
                  <Image
                    src="/modern-apartment.jpg"
                    alt="Modern apartment interior"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Our perspective</p>
                  <h2 className="mt-3 text-2xl font-semibold text-foreground">Real estate platforms feel better when they are honest about what matters.</h2>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">
                    People do not need louder banners. They need sharper search, stronger presentation, better support, and clearer context around price, locality, and risk. That is the direction PropertyGanj is built around.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: Building2,
                  title: "Listings",
                  copy: "Better structured and easier to compare.",
                },
                {
                  icon: TrendingUp,
                  title: "Insights",
                  copy: "Editorial context that sharpens decisions.",
                },
                {
                  icon: HeartHandshake,
                  title: "Support",
                  copy: "Human help when the stakes get real.",
                },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-[28px] border border-[#eddccd] bg-[linear-gradient(135deg,#fff7ef_0%,#ffffff_100%)] p-6 shadow-[0_12px_36px_rgba(16,35,36,0.05)]">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl rounded-[30px] border border-[#eddccd] bg-[linear-gradient(135deg,#fff8ef_0%,#ffffff_58%,#eef7ff_100%)] p-6 text-foreground sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Build with us</p>
              <h2 className="mt-2 text-3xl font-semibold">Whether you are buying, renting, or listing, the goal is the same: clearer momentum.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Explore the platform, read the journal, or speak to support when you need help turning interest into the right move.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/search?q=Lucknow"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Explore listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition duration-300 hover:border-primary/30 hover:text-primary"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
