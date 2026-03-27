import Link from "next/link"
import { ArrowRight, HelpCircle, Mail, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react"

import Header from "@/components/header"
import StickyContact from "@/components/ui/stickysocials"

const helpTopics = [
  {
    title: "Listing support",
    copy: "Help with posting a property, editing details, or understanding which listing flow fits your case.",
  },
  {
    title: "Account access",
    copy: "Support for login, verification, OTP issues, and profile-level troubleshooting.",
  },
  {
    title: "Buying guidance",
    copy: "Need help comparing projects, validating a shortlist, or connecting with the right team.",
  },
]

const faqs = [
  {
    question: "How fast does PropertyGanj support reply?",
    answer: "Most first responses are targeted within one business day. Faster touchpoints usually happen on WhatsApp and call support during working hours.",
  },
  {
    question: "Can I get help before posting or buying?",
    answer: "Yes. The help desk is not only for troubleshooting. You can reach out for guidance before listing a property, before visiting a project, or before moving to financing.",
  },
  {
    question: "Where should I go for home-loan questions?",
    answer: "If your query is about lender fit, paperwork readiness, or sanction support, the home-loans page is the best start. If you need a person, use the support links here.",
  },
  {
    question: "What if I am not sure which category my requirement belongs to?",
    answer: "Start with WhatsApp or email and describe the outcome you want. The team can route the request without forcing you to figure out the internal category first.",
  },
]

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf8f3_0%,#f8fafc_28%,#fff6ee_100%)]">
      <Header />
      <StickyContact />

      <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-[#eddccd] bg-white shadow-[0_24px_80px_rgba(16,35,36,0.08)]">
          <div className="grid lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
            <div className="relative overflow-hidden bg-[#102324] px-6 py-8 text-white sm:px-8 sm:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,211,173,0.2),transparent_28%),radial-gradient(circle_at_80%_16%,rgba(82,168,255,0.2),transparent_22%),linear-gradient(135deg,#102324_0%,#17383f_100%)]" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82">
                  <Sparkles className="h-3.5 w-3.5 text-[#ffd2ad]" />
                  Help & support
                </span>
                <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                  Real support for the moments where a property journey gets stuck.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                  Reach PropertyGanj for listings, account access, buying guidance, financing questions, and the decisions that need a human answer.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {helpTopics.map((topic) => (
                    <div key={topic.title} className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                      <h2 className="text-base font-semibold text-white">{topic.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-white/68">{topic.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,#fff9f2_0%,#ffffff_100%)] p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Fast contact paths</p>
              <div className="mt-5 space-y-4">
                {[
                  {
                    icon: MessageCircle,
                    title: "WhatsApp support",
                    copy: "Quick clarifications, listing help, and follow-up assistance.",
                    href: "https://wa.me/919335909050",
                    label: "Chat on WhatsApp",
                  },
                  {
                    icon: Phone,
                    title: "Call support",
                    copy: "Best when the requirement is urgent or needs a guided explanation.",
                    href: "tel:+919335909050",
                    label: "+91 93359 09050",
                  },
                  {
                    icon: Mail,
                    title: "Email us",
                    copy: "Use email for detailed requirements, screenshots, or documentation queries.",
                    href: "mailto:propertyganj@outlook.com",
                    label: "propertyganj@outlook.com",
                  },
                ].map(({ icon: Icon, title, copy, href, label }) => (
                  <a
                    key={title}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="group block rounded-[26px] border border-[#f1dfcf] bg-white p-5 shadow-[0_10px_28px_rgba(16,35,36,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/35"
                  >
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          {label}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
          <div className="rounded-[30px] border border-[#eddccd] bg-white p-6 shadow-[0_16px_48px_rgba(16,35,36,0.06)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Frequently asked</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">Questions buyers and listers ask us most</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-[24px] border border-[#f1dfcf] bg-[#fffaf4] p-5">
                  <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-[#eddccd] bg-[linear-gradient(135deg,#102324_0%,#17383f_100%)] p-6 text-white sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/12 text-[#ffd7b4]">
                  <HelpCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f6c7a3]">Need a person</p>
                  <h2 className="text-2xl font-semibold">Start with the outcome you want.</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/70">
                You do not need the perfect support category. Tell us whether you are trying to buy, rent, list, verify, or finance and we will guide the next step.
              </p>
              <Link
                href="/home-loans"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Visit home loans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[30px] border border-[#eddccd] bg-white p-6 shadow-[0_16px_48px_rgba(16,35,36,0.06)] sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Trust layer</p>
                  <h2 className="text-2xl font-semibold text-foreground">Support built for real estate friction, not generic tickets.</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                PropertyGanj support is tuned for listing edits, project discovery, account verification, and finance coordination, so the conversation stays practical.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center rounded-full border border-[#eadcca] bg-[#fffaf4] px-4 py-2.5 text-sm font-semibold text-foreground transition duration-300 hover:border-primary/35 hover:text-primary"
                >
                  Read the journal
                </Link>
                <Link
                  href="/search?q=Lucknow"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Browse properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
