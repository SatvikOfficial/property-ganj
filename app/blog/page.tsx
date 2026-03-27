import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpenText, Clock3, Sparkles } from "lucide-react"

import Header from "@/components/header"
import { blogPosts, featuredBlogPost } from "@/data/blogPosts"

export default function BlogPage() {
  const spotlightPosts = blogPosts.slice(1, 3)
  const latestPosts = blogPosts.slice(3)

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcfaf6_0%,#f8fafc_28%,#fff6ee_100%)]">
      <Header />

      <section className="relative overflow-hidden px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(235,98,57,0.12),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(59,130,246,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="rounded-[34px] border border-[#f1dfcf] bg-white/82 p-6 shadow-[0_24px_80px_rgba(16,35,36,0.08)] backdrop-blur sm:p-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                PropertyGanj Journal
              </span>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                Editorial intelligence for buyers, renters, and investors in Lucknow.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Market reads, design thinking, finance guidance, and locality watchlists curated to help serious property decisions move faster.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <Link
                href={`/blog/${featuredBlogPost.id}`}
                className="group relative overflow-hidden rounded-[30px] border border-[#ecd6c5] bg-[#0d1e22] text-white"
              >
                <Image
                  src={featuredBlogPost.image}
                  alt={featuredBlogPost.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 60vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,30,34,0.92)_0%,rgba(13,30,34,0.68)_52%,rgba(13,30,34,0.3)_100%)]" />
                <div className="relative flex h-full min-h-[360px] flex-col justify-end p-6 sm:p-8">
                  <div className="max-w-2xl">
                    <span className="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                      Featured read
                    </span>
                    <h2 className="mt-4 text-3xl font-semibold leading-tight">{featuredBlogPost.title}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/72 sm:text-base">{featuredBlogPost.excerpt}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/70">
                      <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1">
                        {featuredBlogPost.category}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        {featuredBlogPost.readTime}
                      </span>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition duration-300 group-hover:translate-x-0.5">
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>

              <div className="grid gap-4">
                {spotlightPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="group grid min-h-[172px] grid-cols-[120px_minmax(0,1fr)] gap-4 rounded-[26px] border border-[#eddccd] bg-[#fffaf4] p-4 transition duration-500 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_42px_rgba(16,35,36,0.08)]"
                  >
                    <div className="relative overflow-hidden rounded-[20px] bg-muted">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="160px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/75">{post.category}</p>
                        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground">{post.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">{post.readTime}</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-primary">
                          Read
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                <div className="rounded-[26px] border border-[#eddccd] bg-[linear-gradient(135deg,#fff1e3_0%,#ffffff_100%)] p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <BookOpenText className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-[0.22em]">Editorial focus</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Every piece is written to help a buyer act: understand the risk, compare the option, and know the next move.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Latest stories</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">Sharper reads for real property decisions</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {latestPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group overflow-hidden rounded-[28px] border border-[#ecdccf] bg-white shadow-[0_16px_48px_rgba(16,35,36,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(16,35,36,0.1)]"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_15%,rgba(13,30,34,0.62)_100%)]" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {post.category}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">{post.date}</p>
                    <h3 className="mt-2 line-clamp-2 text-xl font-semibold">{post.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{post.readTime}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      Continue reading
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-[30px] border border-[#eadcca] bg-[linear-gradient(135deg,#102324_0%,#17383f_100%)] p-6 text-white sm:p-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f6c7a3]">Research-backed browsing</p>
                <h3 className="mt-2 text-2xl font-semibold">Use the journal as your shortlist companion, not as decoration.</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                  Read the insight, then jump straight into search with a more informed brief on pricing, location, or approvals.
                </p>
              </div>
              <Link
                href="/search?q=Lucknow"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Explore properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
