import {
  Calculator,
  Landmark,
  Wallet,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

export type ToolDefinition = {
  slug: 'emi' | 'mortgage' | 'rent-affordability' | 'rental-yield'
  name: string
  description: string
  href: string
  icon: LucideIcon
  intent: 'buy' | 'rent' | 'invest'
  highlight: string
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    slug: 'emi',
    name: 'EMI Calculator',
    description: 'Estimate your monthly instalment before you book a site visit.',
    href: '/tools/emi',
    icon: Calculator,
    intent: 'buy',
    highlight: 'Plan monthly outflow',
  },
  {
    slug: 'mortgage',
    name: 'Mortgage Planner',
    description: 'Play with down payment, rate and tenure to see loan impact.',
    href: '/tools/mortgage',
    icon: Landmark,
    intent: 'buy',
    highlight: 'Optimise loan structure',
  },
  {
    slug: 'rent-affordability',
    name: 'Rent Affordability',
    description: 'Know the safe rent band based on your monthly income.',
    href: '/tools/rent-affordability',
    icon: Wallet,
    intent: 'rent',
    highlight: 'Set realistic budgets',
  },
  {
    slug: 'rental-yield',
    name: 'Rental Yield',
    description: 'Check how much annual return your investment can generate.',
    href: '/tools/rental-yield',
    icon: BarChart3,
    intent: 'invest',
    highlight: 'Track portfolio returns',
  },
]


