import Header from '@/components/header'
import { RentAffordabilityCalculator } from '@/components/property/RentAffordabilityCalculator'
import { TOOL_DEFINITIONS } from '@/data/tools'

const tool = TOOL_DEFINITIONS.find((item) => item.slug === 'rent-affordability')

export const metadata = {
  title: `${tool?.name ?? 'Rent Affordability'} | Property Tools`,
  description: tool?.description ?? 'Work out a safe rent budget.',
}

export default function RentAffordabilityPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{tool?.highlight}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{tool?.name}</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Tenants in metro cities typically spend 25-35% of take-home salary on rent. Use this calculator to ensure you stay in the sweet spot and plan the security deposit with ease.
          </p>
        </div>

        <RentAffordabilityCalculator className="shadow-lg" />
      </section>
    </main>
  )
}


