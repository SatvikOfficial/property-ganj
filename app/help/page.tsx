"use client"

import { useState } from "react"
import Header from "@/components/header"
import { ChevronDown, Mail, Phone, MessageSquare, HelpCircle, Home, Heart, CreditCard, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const faqs = [
  {
    icon: Home,
    question: "How can I search for properties?",
    answer:
      "Use the search bar on the homepage to enter your preferred location, property type, and budget. You can further refine results using filters like BHK, area, and purpose (buy/rent) on the search results page.",
  },
  {
    icon: Phone,
    question: "How do I contact property owners?",
    answer:
      "On any property listing page, click the 'Contact Owner' or 'Request Callback' button. You'll need to be logged in. The owner will receive your inquiry and get in touch with you directly.",
  },
  {
    icon: Heart,
    question: "How does the Shortlist (❤️) feature work?",
    answer:
      "Click the ❤️ heart icon on any property card to save it to your Liked Properties list. You can view all your saved properties under Profile → Liked Properties. Your shortlist is saved even if you close the browser.",
  },
  {
    icon: CreditCard,
    question: "How can I apply for a home loan?",
    answer:
      "Visit our Home Loans page from the navigation menu. We have partnerships with 10+ leading banks including SBI, HDFC, and ICICI. Click 'Apply for Loan' or 'Get Expert Assistance' and our team will guide you through the process.",
  },
  {
    icon: ShieldCheck,
    question: "Are the properties on Property Ganj verified?",
    answer:
      "We take listing authenticity seriously. Properties marked with a 'Verified' badge have been reviewed by our team. We recommend using our in-app contact system and never transferring money without a site visit and legal verification.",
  },
  {
    icon: Home,
    question: "How do I list my property for free?",
    answer:
      "Click 'Post Property FREE' in the navigation bar or visit /list-property. Fill in your property details, add photos, and submit. Your listing will be live within 24 hours after a basic review.",
  },
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)
  const Icon = faq.icon

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card transition-all duration-200 hover:shadow-sm">
      <button
        className="w-full flex items-center justify-between p-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground text-sm md:text-base">{faq.question}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-5 text-muted-foreground text-sm md:text-base leading-relaxed pl-16">
          {faq.answer}
        </p>
      </div>
    </div>
  )
}

export default function HelpPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-[#264143] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & Support</h1>
          <p className="text-lg text-gray-200 max-w-xl mx-auto">
            Find answers to common questions or get in touch with our support team. We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-3 rounded-full" />
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Still need help?</h2>
            <p className="text-muted-foreground mt-2">Reach out to our team and we&apos;ll get back to you within 24 hours.</p>
            <div className="w-16 h-1 bg-primary mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email Support</p>
                  <a href="mailto:support@propertyganj.com" className="text-primary hover:underline text-sm">
                    support@propertyganj.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Phone Support</p>
                  <a href="tel:+919876543210" className="text-primary hover:underline text-sm">
                    +91 98765 43210
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Mon – Sat, 10AM – 7PM</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Home Loan Queries</p>
                  <Link href="/home-loans" className="text-primary hover:underline text-sm">
                    Visit our Home Loans page →
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">Expert loan assistance available</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
              <h3 className="font-bold text-lg text-foreground mb-5 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Send a Message
              </h3>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="font-semibold text-foreground">Message sent!</p>
                  <p className="text-sm text-muted-foreground mt-1">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Enter your name"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Describe your issue or question..."
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
