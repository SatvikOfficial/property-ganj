'use client'

import { useMemo, useState } from 'react'
import { BarChart3, RotateCcw } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

type RentalYieldCalculatorProps = {
  propertyPrice?: number
  monthlyRent?: number
  className?: string
  heading?: string
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0))

const formatPercent = (value: number) => `${value.toFixed(2)}%`

export function RentalYieldCalculator({
  propertyPrice = 8000000,
  monthlyRent = 25000,
  className,
  heading = 'Rental Yield',
}: RentalYieldCalculatorProps) {
  const [price, setPrice] = useState(propertyPrice)
  const [rent, setRent] = useState(monthlyRent)
  const [maintenance, setMaintenance] = useState(2500)

  const metrics = useMemo(() => {
    const annualRent = rent * 12
    const annualMaintenance = maintenance * 12
    const netIncome = Math.max(annualRent - annualMaintenance, 0)
    const grossYield = price > 0 ? (annualRent / price) * 100 : 0
    const netYield = price > 0 ? (netIncome / price) * 100 : 0

    return {
      annualRent,
      annualMaintenance,
      netIncome,
      grossYield,
      netYield,
    }
  }, [price, rent, maintenance])

  const reset = () => {
    setPrice(propertyPrice)
    setRent(monthlyRent)
    setMaintenance(2500)
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
            <BarChart3 className="w-3.5 h-3.5" />
            Investment Tool
          </p>
          <h3 className="text-lg md:text-xl font-semibold text-foreground">{heading}</h3>
          <p className="text-xs text-muted-foreground">Understand what percentage return your rental asset generates.</p>
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

  <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-accent/20 p-3 md:p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Gross Yield</p>
          <p className="text-xl font-bold text-foreground mt-1 leading-tight break-words">
            {formatPercent(metrics.grossYield)}
          </p>
        </div>
        <div className="rounded-xl bg-muted/40 p-3 md:p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Net Yield</p>
          <p className="text-xl font-semibold text-foreground mt-1 leading-tight break-words">
            {formatPercent(metrics.netYield)}
          </p>
        </div>
        <div className="rounded-xl bg-muted/20 p-3 md:p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Annual Net Income</p>
          <p className="text-lg font-semibold text-foreground mt-1 leading-tight break-words">
            {formatCurrency(metrics.netIncome)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <Label htmlFor="yield-price">Property Value</Label>
            <span>{formatCurrency(price)}</span>
          </div>
          <Input
            id="yield-price"
            type="number"
            min={500000}
            step={50000}
            value={price}
            onChange={(event) => setPrice(Number(event.target.value) || 0)}
            className="mb-3"
          />
          <Slider
            value={[price]}
            min={500000}
            max={50000000}
            step={50000}
            onValueChange={(value) => setPrice(value[0] || 0)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <Label htmlFor="yield-rent">Monthly Rent</Label>
              <span>{formatCurrency(rent)}</span>
            </div>
            <Input
              id="yield-rent"
              type="number"
              min={5000}
              step={1000}
              value={rent}
              onChange={(event) => setRent(Number(event.target.value) || 0)}
              className="mb-3"
            />
            <Slider
              value={[rent]}
              min={5000}
              max={400000}
              step={1000}
              onValueChange={(value) => setRent(value[0] || 0)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <Label htmlFor="yield-maintenance">Monthly Maintenance</Label>
              <span>{formatCurrency(maintenance)}</span>
            </div>
            <Input
              id="yield-maintenance"
              type="number"
              min={0}
              step={500}
              value={maintenance}
              onChange={(event) => setMaintenance(Math.max(0, Number(event.target.value) || 0))}
              className="mb-3"
            />
            <Slider
              value={[maintenance]}
              min={0}
              max={100000}
              step={500}
              onValueChange={(value) => setMaintenance(Math.max(0, value[0] || 0))}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border p-3 text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Annual Rent</span>
            <span className="font-semibold text-foreground">{formatCurrency(metrics.annualRent)}</span>
          </div>
          <div className="flex justify-between">
            <span>Annual Maintenance</span>
            <span className="font-semibold text-foreground">{formatCurrency(metrics.annualMaintenance)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


