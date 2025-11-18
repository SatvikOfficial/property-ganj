"use client";

import Link from "next/link";
import Header from "@/components/header";

export default function LoanFinancePage() {
  const loanArticles = [
    {
      id: 1,
      title: "Home Loan Eligibility: How to Check Your Qualification",
      excerpt: "Learn the key factors that determine your home loan eligibility and how to improve your chances of approval.",
      date: "November 10, 2025",
      readTime: "5 min read",
      category: "Home Loans"
    },
    {
      id: 2,
      title: "Interest Rates and EMI Calculations: A Complete Guide",
      excerpt: "Understand how home loan interest rates work and learn to calculate your monthly EMIs effectively.",
      date: "November 8, 2025",
      readTime: "6 min read",
      category: "EMI Planning"
    },
    {
      id: 3,
      title: "Top Banks for Home Loans in Lucknow: Compare Interest Rates",
      excerpt: "Comparison of home loan offerings from major banks operating in Lucknow with current interest rates.",
      date: "November 5, 2025",
      readTime: "7 min read",
      category: "Loan Providers"
    },
    {
      id: 4,
      title: "Home Loan Documents: Complete Checklist for Property Buyers",
      excerpt: "Essential documents required for home loan application in Lucknow and how to prepare them properly.",
      date: "November 2, 2025",
      readTime: "4 min read",
      category: "Documentation"
    },
    {
      id: 5,
      title: "Pre-EMI vs Full EMI: Which Option is Right for You?",
      excerpt: "Understanding the difference between pre-EMI and full EMI payments during property construction.",
      date: "October 30, 2025",
      readTime: "5 min read",
      category: "Payment Options"
    },
    {
      id: 6,
      title: "Tax Benefits on Home Loans: Save Money Legally",
      excerpt: "Learn about the various tax deductions and benefits available on home loans under Indian tax laws.",
      date: "October 27, 2025",
      readTime: "6 min read",
      category: "Tax Benefits"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Loan & Finance</h1>
            <p className="text-muted-foreground text-lg">Expert guidance on home loans, financing options, and financial planning for property buyers in Lucknow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loanArticles.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-shadow block group"
              >
                <div className="mb-3">
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}