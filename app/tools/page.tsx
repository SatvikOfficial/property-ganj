import Link from 'next/link'
import { TOOL_DEFINITIONS } from '@/data/tools'

export default function ToolsPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-white/80">Tools</p>
        <h1 className="text-3xl md:text-4xl font-bold tools-page-title">Smarter decisions start here</h1>
        <p className="text-sm md:text-base tools-page-description max-w-3xl mx-auto">
          Whether you are buying, renting or investing, our calculators cut through the math so you can focus on the property.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {TOOL_DEFINITIONS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.slug}
              href={tool.href}
              className="group border border-border rounded-3xl p-6 bg-card/90 backdrop-blur-sm hover:border-primary hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition">
                  <Icon className="w-6 h-6" />
                </span>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">{tool.highlight}</p>
                  <h2 className="text-xl font-semibold text-foreground">{tool.name}</h2>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              <span className="text-sm font-semibold text-primary">Open tool →</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}


