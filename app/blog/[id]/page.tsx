import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock3, Sparkles } from "lucide-react"
import { notFound } from "next/navigation"

import Header from "@/components/header"
import { blogPosts, getBlogPostById } from "@/data/blogPosts"

type BlogPostPageProps = {
  params: Promise<{ id: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params
  const post = getBlogPostById(id)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts.filter((entry) => entry.id !== post.id).slice(0, 3)

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf8f3_0%,#f8fafc_28%,#fff6ee_100%)]">
      <Header />

      <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[#eadcca] bg-white px-4 py-2 text-sm font-semibold text-foreground transition duration-300 hover:border-primary/35 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to journal
          </Link>

          <div className="mt-5 overflow-hidden rounded-[34px] border border-[#eddccd] bg-white shadow-[0_24px_80px_rgba(16,35,36,0.08)]">
            <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
              <div className="relative min-h-[360px] overflow-hidden bg-[#102324] sm:min-h-[460px]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,35,36,0.16)_0%,rgba(16,35,36,0.72)_72%,rgba(16,35,36,0.86)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                  <span className="inline-flex rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82">
                    {post.category}
                  </span>
                  <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
                    {post.title}
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/72">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-white/45" />
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between bg-[linear-gradient(180deg,#fffaf4_0%,#ffffff_100%)] p-6 sm:p-8">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Editorial takeaway
                  </span>
                  <p className="mt-4 text-xl font-semibold leading-8 text-foreground">{post.heroStat}</p>
                  <blockquote className="mt-5 rounded-[26px] border border-[#f1dfcf] bg-white px-5 py-5 text-base leading-7 text-muted-foreground shadow-[0_10px_28px_rgba(16,35,36,0.05)]">
                    "{post.pullQuote}"
                  </blockquote>
                </div>

                <div className="mt-8 space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Quick takeaways</p>
                    <div className="mt-3 space-y-2">
                      {post.takeaways.map((takeaway) => (
                        <div key={takeaway} className="rounded-[20px] border border-[#f1dfcf] bg-white px-4 py-3 text-sm leading-6 text-muted-foreground">
                          {takeaway}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#faf1e8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-6 rounded-[30px] border border-[#eddccd] bg-white p-6 shadow-[0_18px_50px_rgba(16,35,36,0.06)] sm:p-8">
            <p className="text-lg leading-8 text-muted-foreground">{post.excerpt}</p>

            {post.sections.map((section) => (
              <section key={section.title} className="space-y-4 border-t border-[#f2e6da] pt-6 first:border-t-0 first:pt-2">
                <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <div className="grid gap-3">
                    {section.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-[22px] border border-[#f1dfcf] bg-[linear-gradient(135deg,#fffaf4_0%,#ffffff_100%)] px-4 py-4 text-sm leading-6 text-muted-foreground"
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </article>

          <aside className="space-y-5">
            <div className="rounded-[30px] border border-[#eddccd] bg-[linear-gradient(135deg,#102324_0%,#17383f_100%)] p-6 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f6c7a3]">Turn insight into action</p>
              <h2 className="mt-3 text-2xl font-semibold">Ready to apply this in your shortlist?</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Jump back into search with a clearer brief on pricing, approvals, or location fit.
              </p>
              <Link
                href="/search?q=Lucknow"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Explore listings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[30px] border border-[#eddccd] bg-white p-5 shadow-[0_12px_36px_rgba(16,35,36,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">More from the journal</p>
              <div className="mt-4 space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="group block rounded-[22px] border border-[#f1dfcf] bg-[#fffaf4] p-4 transition duration-300 hover:border-primary/35 hover:bg-white"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/75">{relatedPost.category}</p>
                    <h3 className="mt-2 text-base font-semibold leading-6 text-foreground">{relatedPost.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{relatedPost.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Read next
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
