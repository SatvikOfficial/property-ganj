'use client'

import { useMemo } from 'react'
import { MapPin, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  POPULAR_LUCKNOW_LOCALITIES,
  type LocalityInsight,
  type PopularLucknowLocality,
} from '@/data/lucknowLocalities'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

type LocalityInsightsProps = {
  locality?: string
  city?: string
  propertyRatePerSqft?: number
  className?: string
}

const formatNumber = (value?: number, suffix = '') => {
  if (!value) return '—'
  return `${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}${suffix}`
}

const tooltipFormatter = (value: number) => `₹${value.toLocaleString('en-IN')}`

export function LocalityInsights({
  locality,
  city = 'Lucknow',
  propertyRatePerSqft,
  className,
}: LocalityInsightsProps) {
  const matchedLocality = useMemo<PopularLucknowLocality | undefined>(() => {
    if (!locality) return undefined
    const normalized = locality.toLowerCase()
    return POPULAR_LUCKNOW_LOCALITIES.find((entry) => {
      const tokens = [
        entry.label,
        entry.locality,
        entry.area,
        ...(entry.aliases || []),
      ]
        .filter(Boolean)
        .map((value) => value!.toLowerCase())
      return tokens.some((token) => normalized.includes(token) || token.includes(normalized))
    })
  }, [locality])

  const insights: LocalityInsight | undefined = matchedLocality?.insights

  if (!matchedLocality || !insights) {
    return null
  }

  const priceGap =
    propertyRatePerSqft && insights.averagePricePerSqft
      ? propertyRatePerSqft - insights.averagePricePerSqft
      : undefined

  const priceNarrative =
    priceGap !== undefined
      ? priceGap > 0
        ? `~₹${Math.abs(Math.round(priceGap)).toLocaleString('en-IN')} above locality average`
        : `~₹${Math.abs(Math.round(priceGap)).toLocaleString('en-IN')} below locality average`
      : null

  return (
    <section className={cn('max-w-6xl mx-auto px-4 py-10', className)}>
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Locality Intelligence</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              {matchedLocality.label}
            </h2>
            <p className="text-sm text-muted-foreground">{city}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl bg-accent/20 px-5 py-3">
              <p className="text-xs text-muted-foreground uppercase">Ranking</p>
              <p className="text-2xl font-semibold text-foreground">
                #{insights.ranking ?? '—'}
                <span className="text-sm text-muted-foreground"> / 20</span>
              </p>
            </div>
            <div className="rounded-2xl bg-muted/40 px-5 py-3">
              <p className="text-xs text-muted-foreground uppercase">Avg ₹/sq.ft</p>
              <p className="text-2xl font-semibold text-foreground">
                ₹{formatNumber(insights.averagePricePerSqft)}
              </p>
              {priceNarrative && (
                <p className="text-xs text-muted-foreground mt-1">{priceNarrative}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 mt-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="bg-muted/40 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">3 Yr Price Trend</p>
                <h3 className="text-lg font-semibold text-foreground">
                  {matchedLocality.label} Price Trends
                </h3>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Confidence: {insights.trendConfidence ?? 'High'}
              </div>
            </div>
            <div className="h-64 border border-border rounded-lg bg-white/80 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={insights.priceTrend}
                  margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" strokeWidth={1} />
                  <XAxis
                    dataKey="year"
                    stroke="#374151"
                    tick={{ fill: '#374151', fontSize: 12 }}
                    axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                    tickLine={{ stroke: '#374151', strokeWidth: 2 }}
                  />
                  <YAxis
                    stroke="#374151"
                    tick={{ fill: '#374151', fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                    axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                    tickLine={{ stroke: '#374151', strokeWidth: 2 }}
                  />
                  <Tooltip
                    formatter={(value) => tooltipFormatter(value as number)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderRadius: '12px',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 6, stroke: '#2563eb', strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 3, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-background rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Safety Rating
                </p>
                <span className="text-sm font-semibold text-muted-foreground">
                  {insights.safetyRating?.toFixed(1) ?? '—'} / 5
                </span>
              </div>
              <Progress value={(insights.safetyRating || 0) * 20} />
            </div>

            <div className="bg-background rounded-2xl border border-border p-4">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Nearby Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {insights.nearbyAmenities?.map((amenity) => (
                  <span
                    key={amenity}
                    className="text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                )) || <span className="text-xs text-muted-foreground">No data yet.</span>}
              </div>
            </div>

            <div className="bg-background rounded-2xl border border-border p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Pros</p>
                  <ul className="space-y-1.5 text-sm text-foreground">
                    {insights.pros?.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    )) || <li className="text-muted-foreground">No documented pros yet.</li>}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Watch-outs</p>
                  <ul className="space-y-1.5 text-sm text-foreground">
                    {insights.cons?.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                        {item}
                      </li>
                    )) || <li className="text-muted-foreground">No concerns flagged.</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


