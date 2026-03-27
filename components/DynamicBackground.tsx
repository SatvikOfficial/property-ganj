import type { ReactNode } from 'react'

type DynamicBackgroundProps = {
  variant?: 'landing' | 'default'
  children?: ReactNode
}

export default function DynamicBackground({
  variant = 'default',
  children,
}: DynamicBackgroundProps) {
  const isLanding = variant === 'landing'

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      <div
        className={`absolute inset-0 ${
          isLanding
            ? 'bg-[radial-gradient(circle_at_15%_20%,rgba(251,146,60,0.32),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.26),transparent_24%),linear-gradient(135deg,rgba(2,6,23,0.92),rgba(15,23,42,0.74)_48%,rgba(15,118,110,0.58))]'
            : 'bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.12),transparent)]'
        }`}
      />
      <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </div>
  )
}
