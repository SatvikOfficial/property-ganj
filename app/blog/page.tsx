"use client";

import Link from "next/link";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Circle Rates in Lucknow: A Complete Guide",
      excerpt: "Learn how circle rates affect property prices in Lucknow and how they impact your property investment decisions.",
      date: "November 15, 2025",
      readTime: "5 min read",
      category: "Property Rates"
    },
    {
      id: 2,
      title: "Vastu Shastra Guidelines for a Happy Home in Lucknow",
      excerpt: "Essential Vastu tips for homebuyers in Lucknow to ensure prosperity and harmony in their new homes.",
      date: "November 12, 2025",
      readTime: "4 min read",
      category: "Home Tips"
    },
    {
      id: 3,
      title: "Stamp Duty and Registration Charges in Lucknow: What You Need to Know",
      excerpt: "Complete guide to stamp duty and registration charges for property transactions in Lucknow.",
      date: "November 10, 2025",
      readTime: "6 min read",
      category: "Legal"
    },
    {
      id: 4,
      title: "Lucknow's Metro Network: A Game Changer for Real Estate",
      excerpt: "How Lucknow's metro project is transforming property values and investment opportunities in the city.",
      date: "November 8, 2025",
      readTime: "7 min read",
      category: "Infrastructure"
    },
    {
      id: 5,
      title: "LDA vs. RERA: What Property Buyers Need to Know in Lucknow",
      excerpt: "Understanding the differences between LDA and RERA regulations for property buyers in Lucknow.",
      date: "November 5, 2025",
      readTime: "5 min read",
      category: "Regulations"
    },
    {
      id: 6,
      title: "Top Localities for Property Investment in Lucknow 2025",
      excerpt: "Explore the best localities in Lucknow for real estate investment this year.",
      date: "November 2, 2025",
      readTime: "8 min read",
      category: "Investment"
    }
  ];

  return (
    <main className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-4">Property Ganj Insights</h1>
          <p className="text-white/90 drop-shadow-md text-lg">Expert advice, market trends, and valuable tips for property buyers and sellers in Lucknow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="mb-3">
                <span className="inline-block bg-primary/20 text-foreground px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">{post.title}</h2>
              <p className="text-foreground/80 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center text-sm text-foreground/70">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}