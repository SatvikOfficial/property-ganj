import { MortgageCalculator } from '@/components/property/MortgageCalculator'
import { TOOL_DEFINITIONS } from '@/data/tools'

const tool = TOOL_DEFINITIONS.find((item) => item.slug === 'mortgage')

export const metadata = {
  title: `${tool?.name ?? 'Mortgage Planner'} | Property Tools`,
  description: tool?.description ?? 'Optimise your home loan structure.',
}

export default function MortgageToolPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/80">{tool?.highlight}</p>
        <h1 className="text-3xl md:text-4xl font-bold tools-section-header">{tool?.name}</h1>
        <p className="text-sm md:text-base tools-section-description max-w-2xl mx-auto">
          Experiment with down payment, tenure and interest to see how your EMI behaves. Use this to negotiate better rates or to finalise the perfect bank offer.
        </p>
      </div>

      <div className="flex justify-center">
        <MortgageCalculator className="shadow-lg w-full max-w-2xl" />
      </div>
    </section>
  )
}


