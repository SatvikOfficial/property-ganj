import { RentalYieldCalculator } from '@/components/property/RentalYieldCalculator'
import { TOOL_DEFINITIONS } from '@/data/tools'

const tool = TOOL_DEFINITIONS.find((item) => item.slug === 'rental-yield')

export const metadata = {
  title: `${tool?.name ?? 'Rental Yield'} | Property Tools`,
  description: tool?.description ?? 'Track annual returns from your rental assets.',
}

export default function RentalYieldPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/80">{tool?.highlight}</p>
        <h1 className="text-3xl md:text-4xl font-bold tools-section-header">{tool?.name}</h1>
        <p className="text-sm md:text-base tools-section-description max-w-2xl mx-auto">
          Quickly interpret if a property is worth the investment by looking at gross and net rental yields after factoring maintenance costs.
        </p>
      </div>

      <div className="flex justify-center">
        <RentalYieldCalculator className="shadow-lg w-full max-w-2xl" />
      </div>
    </section>
  )
}


