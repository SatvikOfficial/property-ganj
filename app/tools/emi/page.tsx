import Header from '@/components/header'
import { EmiCalculator } from '@/components/property/EmiCalculator'
import { TOOL_DEFINITIONS } from '@/data/tools'

const tool = TOOL_DEFINITIONS.find((item) => item.slug === 'emi')

export const metadata = {
  title: `${tool?.name ?? 'EMI Calculator'} | Property Tools`,
  description: tool?.description ?? 'Estimate your monthly instalments.',
}

export default function EmiToolPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{tool?.highlight}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{tool?.name}</h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Punch in the property cost, rate of interest and tenure to instantly know the EMI, total payable and interest outgo. Share the results with your banker or broker in one tap.
          </p>
        </div>

        <EmiCalculator className="shadow-lg" />
      </section>
    </main>
  )
}


