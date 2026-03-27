import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgePercent, Building2, CheckCircle2, Clock3, FileCheck2, HandCoins, ShieldCheck } from "lucide-react"

import Header from "@/components/header"
import { bankPartners } from "@/data/bankPartners"

const processSteps = [
  {
    title: "Share your shortlist",
    copy: "Tell us the project, budget band, and whether you need sanction support before booking.",
  },
  {
    title: "Compare partner fits",
    copy: "We help you compare rate bands, eligibility comfort, turnaround, and paperwork intensity.",
  },
  {
    title: "Move to approval",
    copy: "Documentation support and lender coordination reduce avoidable delay during the critical stage.",
  },
]

export default function HomeLoansPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf8f3_0%,#f8fafc_26%,#fff6ee_100%)]">
      <Header />

      <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-[#eddccd] bg-white shadow-[0_24px_80px_rgba(16,35,36,0.08)]">
          <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <div className="relative overflow-hidden bg-[#0f2025] px-6 py-8 text-white sm:px-8 sm:py-10">
              <Image
                src="/modern-residential-building.png"
                alt="Luxury residential building"
                fill
                sizes="(max-width: 1280px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,32,37,0.95)_0%,rgba(15,32,37,0.8)_42%,rgba(15,32,37,0.48)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,211,173,0.18),transparent_28%),radial-gradient(circle_at_76%_22%,rgba(82,168,255,0.22),transparent_24%)]" />

              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#ffd2ad]" />
                  Finance concierge
                </span>
                <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                  Home-loan support that feels premium from comparison to approval.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                  PropertyGanj helps buyers move from shortlist to sanction with trusted banking partners, document guidance, and a smoother decision path.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Partner banks", value: `${bankPartners.length}+` },
                    { label: "Response window", value: "<24 hrs" },
                    { label: "Use cases", value: "Purchase to transfer" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                      <p className="text-xl font-semibold text-[#ffd7b4]">{item.value}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/58">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="#partners"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                  >
                    Compare banks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/help"
                    className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/16"
                  >
                    Speak to support
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,#fff9f2_0%,#ffffff_100%)] p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Why buyers use us</p>
              <div className="mt-4 space-y-4">
                {[
                  {
                    icon: BadgePercent,
                    title: "Cleaner comparison",
                    copy: "Rate bands only matter when checked against processing load, flexibility, and speed.",
                  },
                  {
                    icon: FileCheck2,
                    title: "Document readiness",
                    copy: "Support on paperwork reduces the late-stage churn that slows approvals.",
                  },
                  {
                    icon: HandCoins,
                    title: "Decision confidence",
                    copy: "Choose a lender based on fit, not just the headline rate on a landing page.",
                  },
                ].map(({ icon: Icon, title, copy }) => (
                  <div key={title} className="rounded-[24px] border border-[#f1dfcf] bg-white p-5 shadow-[0_10px_28px_rgba(16,35,36,0.04)]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="partners" className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Partner panel</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">Banking options that cover high-intent buyer journeys</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              Compare lenders across tone, flexibility, and process fit, then move to the one that best supports your deal structure.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {bankPartners.map((bank) => (
              <div
                key={bank.id}
                className="group overflow-hidden rounded-[28px] border border-[#eddccd] bg-white shadow-[0_16px_48px_rgba(16,35,36,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_54px_rgba(16,35,36,0.1)]"
              >
                <div className={`bg-gradient-to-br ${bank.accent} p-5`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-[20px] border border-white/80 bg-white p-3 shadow-[0_8px_24px_rgba(16,35,36,0.06)]">
                      <Image src={bank.logoUrl} alt={bank.name} width={88} height={32} className="h-8 w-auto object-contain" />
                    </div>
                    <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {bank.badge}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-primary/80">{bank.interestRate}</p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{bank.name}</h3>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-6 text-muted-foreground">{bank.description}</p>
                  <div className="mt-5 space-y-2">
                    {bank.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/help"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition duration-300 group-hover:translate-x-0.5"
                  >
                    Ask about this bank
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
          <div className="rounded-[30px] border border-[#eddccd] bg-white p-6 shadow-[0_16px_48px_rgba(16,35,36,0.06)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Process clarity</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">How the PropertyGanj loan flow works</h2>
            <div className="mt-6 space-y-4">
              {processSteps.map((step, index) => (
                <div key={step.title} className="rounded-[24px] border border-[#f1dfcf] bg-[#fffaf4] p-5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[#eddccd] bg-[linear-gradient(135deg,#102324_0%,#17383f_100%)] p-6 text-white sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f6c7a3]">Best suited for</p>
            <h2 className="mt-2 text-3xl font-semibold">Buyers who want a polished deal experience, not just a lower rate.</h2>
            <div className="mt-6 grid gap-4">
              {[
                { icon: Building2, title: "New project buyers", copy: "Need lender comparisons before booking and agreement execution." },
                { icon: Clock3, title: "Time-sensitive purchases", copy: "Want quicker movement between shortlist, sanction, and execution." },
                { icon: ShieldCheck, title: "Documentation-heavy cases", copy: "Prefer guided support so paperwork does not stall the process." },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-[#ffd7b4]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/70">{copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/help"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Start with support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
