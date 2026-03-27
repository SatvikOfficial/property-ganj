export interface BankPartner {
  id: string
  name: string
  description: string
  interestRate: string
  logoUrl: string
  features: string[]
  accent: string
  badge: string
  contactLink?: string
}

export const bankPartners: BankPartner[] = [
  {
    id: "sbi",
    name: "State Bank of India (SBI)",
    description: "India's largest public sector bank offering competitive home loan rates with minimal processing fees.",
    interestRate: "8.40% onwards",
    logoUrl: "/banks/sbi.svg",
    accent: "from-sky-500/20 via-white to-sky-100",
    badge: "Public Sector",
    features: [
      "Up to 90% loan amount",
      "Minimal processing fees",
      "Quick approval process",
      "Balance transfer facility"
    ]
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    description: "Leading private sector bank with flexible home loan options and doorstep service.",
    interestRate: "8.55% onwards",
    logoUrl: "/banks/hdfc.svg",
    accent: "from-rose-500/15 via-white to-blue-100",
    badge: "Private Banking",
    features: [
      "Doorstep service",
      "Flexible repayment options",
      "Top-up loans available",
      "Digital approval process"
    ]
  },
  {
    id: "icici",
    name: "ICICI Bank",
    description: "Innovative banking solutions with instant in-principle approval and minimal documentation.",
    interestRate: "8.60% onwards",
    logoUrl: "/banks/icici.svg",
    accent: "from-orange-500/20 via-white to-amber-100",
    badge: "Fast Approval",
    features: [
      "Instant in-principle approval",
      "Minimal documentation",
      "Zero foreclosure charges",
      "Women borrower benefits"
    ]
  },
  {
    id: "axis",
    name: "Axis Bank",
    description: "Customer-centric approach with personalized home loan solutions and competitive rates.",
    interestRate: "8.50% onwards",
    logoUrl: "/banks/axis.svg",
    accent: "from-fuchsia-500/15 via-white to-rose-100",
    badge: "Relationship Led",
    features: [
      "Personalized solutions",
      "Quick disbursement",
      "Flexible tenure options",
      "Overdraft facility"
    ]
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    description: "Trustworthy banking partner offering comprehensive home loan products with easy eligibility.",
    interestRate: "8.65% onwards",
    logoUrl: "/banks/kotak.svg",
    accent: "from-red-500/15 via-white to-slate-100",
    badge: "Flexible Tenure",
    features: [
      "Easy eligibility criteria",
      "Loan against property",
      "Construction loans",
      "NRIs welcome"
    ]
  },
  {
    id: "pnb",
    name: "Punjab National Bank (PNB)",
    description: "Trusted public sector bank with affordable home loan schemes for all income groups.",
    interestRate: "8.45% onwards",
    logoUrl: "/banks/pnb.svg",
    accent: "from-amber-500/20 via-white to-orange-100",
    badge: "Affordable Plans",
    features: [
      "Affordable housing loans",
      "Special schemes for women",
      "Low processing charges",
      "Wide branch network"
    ]
  },
  {
    id: "lic",
    name: "LIC Housing Finance",
    description: "Specialized housing finance company with tailored solutions for dream homes.",
    interestRate: "8.50% onwards",
    logoUrl: "/banks/lic.svg",
    accent: "from-yellow-400/20 via-white to-blue-100",
    badge: "Housing Specialist",
    features: [
      "Specialized housing finance",
      "Long repayment tenure",
      "Loan for renovation",
      "Plot purchase loans"
    ]
  },
  {
    id: "bank-of-baroda",
    name: "Bank of Baroda",
    description: "Reliable public sector bank offering comprehensive home loan solutions at competitive rates.",
    interestRate: "8.40% onwards",
    logoUrl: "/banks/bob.svg",
    accent: "from-orange-500/20 via-white to-amber-100",
    badge: "High Value Loans",
    features: [
      "Competitive interest rates",
      "Minimal documentation",
      "Quick processing",
      "Balance transfer options"
    ]
  }
]
