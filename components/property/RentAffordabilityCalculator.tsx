'use client'

import { useMemo, useState } from 'react'
import { Wallet2, RotateCcw } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

type RentAffordabilityCalculatorProps = {
  defaultRent?: number
  defaultIncome?: number
  className?: string
  heading?: string
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0))

export function RentAffordabilityCalculator({
  defaultRent = 25000,
  defaultIncome = 75000,
  className,
  heading = 'Rent Affordability',
}: RentAffordabilityCalculatorProps) {
  const [monthlyIncome, setMonthlyIncome] = useState(defaultIncome)
  const [rentPercentage, setRentPercentage] = useState(30)
  const [otherCommitments, setOtherCommitments] = useState(0)
  const [depositMonths, setDepositMonths] = useState(2)

  const { safeRent, deposit, utilisation } = useMemo(() => {
    const rawRent = (monthlyIncome * rentPercentage) / 100 - otherCommitments
    const safeRent = Math.max(rawRent, 0)
    const deposit = safeRent * Math.max(depositMonths, 0)
    const utilisation = monthlyIncome > 0 ? ((safeRent + otherCommitments) / monthlyIncome) * 100 : 0
    return { safeRent, deposit, utilisation }
  }, [monthlyIncome, rentPercentage, otherCommitments, depositMonths])

  const reset = () => {
    setMonthlyIncome(defaultIncome)
    setRentPercentage(30)
    setOtherCommitments(0)
    setDepositMonths(2)
  }

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm space-y-4',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
            <Wallet2 className="w-3.5 h-3.5" />
            Rent Tool
          </p>
          <h3 className="text-lg md:text-xl font-semibold text-foreground">{heading}</h3>
          <p className="text-xs text-muted-foreground">Stay within the safe 25-35% band of your take-home pay.</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-accent/20 p-3 md:p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Safe Monthly Rent</p>
          <p className="text-xl font-bold text-foreground mt-1 leading-tight break-words">
            {formatCurrency(safeRent)}
          </p>
        </div>
        <div className="rounded-xl bg-muted/40 p-3 md:p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Security Deposit</p>
          <p className="text-lg font-semibold text-foreground mt-1 leading-tight break-words">
            {formatCurrency(deposit)}
          </p>
          <p className="text-[11px] text-muted-foreground">({depositMonths} months advance)</p>
        </div>
      </div>

      <div className="rounded-xl border border-border p-3">
        <p className="text-xs uppercase text-muted-foreground">Income utilisation</p>
        <div className="mt-2 h-2 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(Math.max(utilisation, 0), 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {(utilisation).toFixed(1)}% of income used after accounting for other EMIs
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <Label htmlFor="rent-income">Monthly Take-home</Label>
            <span>{formatCurrency(monthlyIncome)}</span>
          </div>
          <Input
            id="rent-income"
            type="number"
            min={10000}
            step={5000}
            value={monthlyIncome}
            onChange={(event) => setMonthlyIncome(Number(event.target.value) || 0)}
            className="mb-3"
          />
          <Slider
            value={[monthlyIncome]}
            min={10000}
            max={500000}
            step={5000}
            onValueChange={(value) => setMonthlyIncome(value[0] || 0)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <Label htmlFor="rent-percent">Rent % of income</Label>
              <span>{rentPercentage}%</span>
            </div>
            <Input
              id="rent-percent"
              type="number"
              min={10}
              max={50}
              step={1}
              value={rentPercentage}
              onChange={(event) => setRentPercentage(Math.min(50, Math.max(10, Number(event.target.value) || 10)))}
              className="mb-3"
            />
            <Slider
              value={[rentPercentage]}
              min={10}
              max={50}
              step={1}
              onValueChange={(value) => setRentPercentage(Math.round(value[0] || 10))}
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <Label htmlFor="rent-commitments">Other EMIs (₹)</Label>
              <span>{formatCurrency(otherCommitments)}</span>
            </div>
            <Input
              id="rent-commitments"
              type="number"
              min={0}
              step={1000}
              value={otherCommitments}
              onChange={(event) => setOtherCommitments(Math.max(0, Number(event.target.value) || 0))}
              className="mb-3"
            />
            <Slider
              value={[otherCommitments]}
              min={0}
              max={200000}
              step={1000}
              onValueChange={(value) => setOtherCommitments(Math.max(0, value[0] || 0))}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <Label htmlFor="rent-deposit">Deposit (months)</Label>
            <span>{depositMonths} m</span>
          </div>
          <Input
            id="rent-deposit"
            type="number"
            min={0}
            max={6}
            step={1}
            value={depositMonths}
            onChange={(event) => setDepositMonths(Math.min(12, Math.max(0, Number(event.target.value) || 0)))}
            className="mb-3"
          />
          <Slider
            value={[depositMonths]}
            min={0}
            max={12}
            step={1}
            onValueChange={(value) => setDepositMonths(Math.round(value[0] || 0))}
          />
        </div>
      </div>
    </div>
  )
}


