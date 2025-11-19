'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calculator, RotateCcw } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

type EmiCalculatorProps = {
  defaultAmount?: number
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

export function EmiCalculator({
  defaultAmount = 5000000,
  className,
  heading = 'Instant EMI Estimator',
  variant = 'full',
}: EmiCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(defaultAmount)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenureYears, setTenureYears] = useState(15)

  useEffect(() => {
    setLoanAmount(defaultAmount)
  }, [defaultAmount])

  const { monthlyEmi, totalInterest, totalPayable } = useMemo(() => {
    const principal = loanAmount || 0
    const months = Math.max(tenureYears * 12, 1)
    const monthlyRate = interestRate / 12 / 100

    if (principal <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayable: 0,
      }
    }

    if (monthlyRate === 0) {
      const emi = principal / months
      return {
        monthlyEmi: emi,
        totalInterest: emi * months - principal,
        totalPayable: emi * months,
      }
    }

    const pow = Math.pow(1 + monthlyRate, months)
    const emi = (principal * monthlyRate * pow) / (pow - 1)
    const payable = emi * months
    return {
      monthlyEmi: emi,
      totalInterest: payable - principal,
      totalPayable: payable,
    }
  }, [loanAmount, interestRate, tenureYears])

  const resetValues = () => {
    setLoanAmount(defaultAmount)
    setInterestRate(8.5)
    setTenureYears(15)
  }

  const summaryGrid = variant === 'compact' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-3'

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
            <Calculator className="w-3.5 h-3.5" />
            EMI Calculator
          </p>
          <h3 className="text-lg md:text-xl font-semibold text-foreground">{heading}</h3>
          <p className="text-xs text-muted-foreground">
            Purely informational. Adjust the sliders to match your bank quote.
          </p>
        </div>
        <button
          type="button"
          onClick={resetValues}
          className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className={`grid gap-3 ${summaryGrid}`}>
        <div className="rounded-xl bg-accent/30 p-3 md:p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Monthly EMI</p>
          <p className="text-xl font-bold text-foreground mt-1 leading-tight break-words">
            {formatCurrency(monthlyEmi)}
          </p>
        </div>
        <div className="rounded-xl bg-muted/40 p-3 md:p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Interest</p>
          <p className="text-lg font-semibold text-foreground mt-1 leading-tight break-words">
            {formatCurrency(totalInterest)}
          </p>
        </div>
        {variant === 'full' && (
          <div className="rounded-xl bg-muted/40 p-3 md:p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Payable</p>
            <p className="text-lg font-semibold text-foreground mt-1 leading-tight break-words">
              {formatCurrency(totalPayable)}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <Label htmlFor="emi-loan">Loan Amount</Label>
            <span>{formatCurrency(loanAmount)}</span>
          </div>
          <Input
            id="emi-loan"
            type="number"
            min={100000}
            step={50000}
            value={loanAmount}
            onChange={(event) => setLoanAmount(Number(event.target.value) || 0)}
            className="mb-3"
          />
          <Slider
            value={[loanAmount]}
            min={500000}
            max={100000000}
            step={50000}
            onValueChange={(value) => setLoanAmount(value[0] || 0)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <Label htmlFor="emi-rate">Interest Rate</Label>
              <span>{interestRate.toFixed(2)}%</span>
            </div>
            <Input
              id="emi-rate"
              type="number"
              min={5}
              max={15}
              step={0.1}
              value={interestRate}
              onChange={(event) => setInterestRate(Number(event.target.value) || 0)}
              className="mb-3"
            />
            <Slider
              value={[interestRate]}
              min={5}
              max={15}
              step={0.1}
              onValueChange={(value) => setInterestRate(Number(value[0]?.toFixed(2)) || 0)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <Label htmlFor="emi-tenure">Tenure (Years)</Label>
              <span>{tenureYears} yr</span>
            </div>
            <Input
              id="emi-tenure"
              type="number"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(event) => setTenureYears(Number(event.target.value) || 1)}
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
    </div>
  )
}


