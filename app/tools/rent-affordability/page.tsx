import { RentAffordabilityCalculator } from '@/components/property/RentAffordabilityCalculator'
import { TOOL_DEFINITIONS } from '@/data/tools'

const tool = TOOL_DEFINITIONS.find((item) => item.slug === 'rent-affordability')

export const metadata = {
  title: `${tool?.name ?? 'Rent Affordability'} | Property Tools`,
  description: tool?.description ?? 'Work out a safe rent budget.',
}

export default function RentAffordabilityPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/80">{tool?.highlight}</p>
        <h1 className="text-3xl md:text-4xl font-bold tools-section-header">{tool?.name}</h1>
        <p className="text-sm md:text-base tools-section-description max-w-2xl mx-auto">
          Tenants in metro cities typically spend 25-35% of take-home salary on rent. Use this calculator to ensure you stay in the sweet spot and plan the security deposit with ease.
        </p>
      </div>

      <div className="flex justify-center">
        <RentAffordabilityCalculator className="shadow-lg w-full max-w-2xl" />
      </div>
    </section>
  )
}


