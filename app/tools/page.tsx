import Link from 'next/link'

import Header from '@/components/header'
import { TOOL_DEFINITIONS } from '@/data/tools'

export const metadata = {
  title: 'Property Tools | Property Ganj',
  description: 'Plan EMIs, mortgages, rent budgets and yields with our quick calculators.',
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Tools</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Smarter decisions start here</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
            Whether you are buying, renting or investing, our calculators cut through the math so you can focus on the property.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TOOL_DEFINITIONS.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="group border border-border rounded-3xl p-5 md:p-6 bg-card hover:border-primary hover:-translate-y-1 transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition">
                    <Icon className="w-5 h-5" />
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
    </main>
  )
}


