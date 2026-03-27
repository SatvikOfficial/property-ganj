"use client"

import Link from "next/link"

type HomeSectionProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  actionHref?: string
  actionLabel?: string
  children: React.ReactNode
  className?: string
}

export default function HomeSection({
  eyebrow,
  title,
  subtitle,
  actionHref,
  actionLabel,
  children,
  className = "",
}: HomeSectionProps) {
  return (
    <section className={["w-full", className].filter(Boolean).join(" ")}>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
          <div className="space-y-2">
            {eyebrow && <p className="text-xs uppercase tracking-widest text-primary font-bold">{eyebrow}</p>}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-sm md:text-base text-muted-foreground max-w-2xl">{subtitle}</p>}
          </div>
          {actionHref && actionLabel && (
            <Link href={actionHref} className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation">
              {actionLabel} →
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}

