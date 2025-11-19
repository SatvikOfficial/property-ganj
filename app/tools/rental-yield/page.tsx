import Header from '@/components/header'
import { RentalYieldCalculator } from '@/components/property/RentalYieldCalculator'
import { TOOL_DEFINITIONS } from '@/data/tools'

const tool = TOOL_DEFINITIONS.find((item) => item.slug === 'rental-yield')

export const metadata = {
  title: `${tool?.name ?? 'Rental Yield'} | Property Tools`,
  description: tool?.description ?? 'Track annual returns from your rental assets.',
}

export default function RentalYieldPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{tool?.highlight}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{tool?.name}</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Quickly interpret if a property is worth the investment by looking at gross and net rental yields after factoring maintenance costs.
          </p>
        </div>

        <RentalYieldCalculator className="shadow-lg" />
      </section>
    </main>
  )
}


