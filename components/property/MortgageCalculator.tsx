'use client'

import { useMemo, useState } from 'react'
import { Landmark, RotateCcw } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

type MortgageCalculatorProps = {
  propertyPrice?: number
  className?: string
  heading?: string
  variant?: 'full' | 'compact'
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0))

export function MortgageCalculator({
  propertyPrice = 7500000,
  className,
  heading = 'Mortgage Planner',
  variant = 'full',
}: MortgageCalculatorProps) {
  const [homePrice, setHomePrice] = useState(propertyPrice)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(8.25)
  const [tenureYears, setTenureYears] = useState(20)

  const metrics = useMemo(() => {
    const price = Math.max(homePrice, 0)
    const downPayment = (price * downPaymentPercent) / 100
    const loanAmount = Math.max(price - downPayment, 0)
    const months = Math.max(tenureYears * 12, 1)
    const monthlyRate = interestRate / 12 / 100

    let emi = 0
    if (loanAmount > 0) {
      if (monthlyRate === 0) {
        emi = loanAmount / months
      } else {
        const pow = Math.pow(1 + monthlyRate, months)
        emi = (loanAmount * monthlyRate * pow) / (pow - 1)
      }
    }

    const totalPayment = emi * months
    const totalInterest = Math.max(totalPayment - loanAmount, 0)

    return {
      downPayment,
      loanAmount,
      monthlyEmi: emi,
      totalInterest,
      totalPayment,
    }
  }, [homePrice, downPaymentPercent, interestRate, tenureYears])

  const reset = () => {
    setHomePrice(propertyPrice)
    setDownPaymentPercent(20)
    setInterestRate(8.25)
    setTenureYears(20)
  }

  const summaryGrid = variant === 'compact' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'

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
            <Landmark className="w-3.5 h-3.5" />
            Mortgage Calculator
          </p>
          <h3 className="text-lg md:text-xl font-semibold text-foreground">{heading}</h3>
          <p className="text-xs text-muted-foreground">Tweak the knobs to find the sweet spot between EMI & tenure.</p>
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

      <div className={`grid gap-3 ${summaryGrid}`}>
        <div className="rounded-xl bg-muted/40 p-3 md:p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Loan Amount</p>
          <p className="text-xl font-bold text-foreground mt-1 leading-tight break-words">
            {formatCurrency(metrics.loanAmount)}
          </p>
        </div>
        <div className="rounded-xl bg-accent/30 p-3 md:p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Monthly EMI</p>
          <p className="text-xl font-bold text-foreground mt-1 leading-tight break-words">
            {formatCurrency(metrics.monthlyEmi)}
          </p>
        </div>
        {variant === 'full' && (
          <div className="rounded-xl bg-muted/40 p-3 md:p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Interest</p>
            <p className="text-xl font-semibold text-foreground mt-1 leading-tight break-words">
              {formatCurrency(metrics.totalInterest)}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <Label htmlFor="mortgage-price">Home Cost</Label>
            <span>{formatCurrency(homePrice)}</span>
          </div>
          <Input
            id="mortgage-price"
            type="number"
            min={500000}
            step={50000}
            value={homePrice}
            onChange={(event) => setHomePrice(Number(event.target.value) || 0)}
            className="mb-3"
          />
          <Slider
            value={[homePrice]}
            min={500000}
            max={50000000}
            step={50000}
            onValueChange={(value) => setHomePrice(value[0] || 0)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <Label htmlFor="mortgage-down">Down Payment (%)</Label>
              <span>{downPaymentPercent}%</span>
            </div>
            <Input
              id="mortgage-down"
              type="number"
              min={0}
              max={80}
              step={1}
              value={downPaymentPercent}
              onChange={(event) => setDownPaymentPercent(Number(event.target.value) || 0)}
              className="mb-3"
            />
            <Slider
              value={[downPaymentPercent]}
              min={0}
              max={80}
              step={1}
              onValueChange={(value) => setDownPaymentPercent(Math.round(value[0] || 0))}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Down payment: <span className="font-semibold">{formatCurrency(metrics.downPayment)}</span>
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <Label htmlFor="mortgage-rate">Interest Rate (%)</Label>
              <span>{interestRate.toFixed(2)}%</span>
            </div>
            <Input
              id="mortgage-rate"
              type="number"
              min={6}
              max={14}
              step={0.1}
              value={interestRate}
              onChange={(event) => setInterestRate(Number(event.target.value) || 0)}
              className="mb-3"
            />
            <Slider
              value={[interestRate]}
              min={6}
              max={14}
              step={0.1}
              onValueChange={(value) => setInterestRate(Number(value[0]?.toFixed(2)) || 0)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <Label htmlFor="mortgage-tenure">Tenure (Years)</Label>
            <span>{tenureYears} yr</span>
          </div>
          <Input
            id="mortgage-tenure"
            type="number"
            min={1}
            max={30}
            step={1}
            value={tenureYears}
            onChange={(event) => setTenureYears(Math.min(30, Math.max(1, Number(event.target.value) || 1)))}
            className="mb-3"
          />
          <Slider
            value={[tenureYears]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => setTenureYears(Math.round(value[0] || 1))}
          />
        </div>
      </div>
    </div>
  )
}


