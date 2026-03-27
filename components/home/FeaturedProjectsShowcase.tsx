"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

type FeaturedProject = {
  id: string | number
  name: string
  location: string
  type: string
  price: string
  builder: string
  image: string
}

type FeaturedProjectsShowcaseProps = {
  projects: FeaturedProject[]
  getPropertyHref: (id?: string | number) => string
}

const ROTATION_MS = 4800

function getOrderedProjects(projects: FeaturedProject[], startIndex: number) {
  if (projects.length <= 1) return projects
  return [...projects.slice(startIndex), ...projects.slice(0, startIndex)]
}

export default function FeaturedProjectsShowcase({
  projects,
  getPropertyHref,
}: FeaturedProjectsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (projects.length <= 1) return
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length)
    }, ROTATION_MS)

    return () => window.clearInterval(interval)
  }, [projects.length])

  if (projects.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#f0dfcd] bg-white/70 p-6 text-sm text-muted-foreground">
        More featured projects will appear here as soon as they are added.
      </div>
    )
  }

  const orderedProjects = getOrderedProjects(projects, activeIndex)
  const primaryProject = orderedProjects[0]
  const secondaryProjects = orderedProjects.slice(1, 3)

  return (
    <div>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.22fr)_minmax(320px,0.78fr)]">
        <Link
          key={`${primaryProject.id}-primary`}
          href={getPropertyHref(primaryProject.id)}
          className="group relative h-[220px] overflow-hidden rounded-[28px] border border-[#f3d4b5] bg-[#102324] sm:h-[236px] xl:h-[254px]"
        >
          <Image
            src={primaryProject.image || "/placeholder.svg"}
            alt={primaryProject.name}
            fill
            sizes="(max-width: 1280px) 100vw, 62vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,35,36,0.92)_0%,rgba(16,35,36,0.6)_50%,rgba(16,35,36,0.22)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,205,164,0.3),transparent_28%)]" />
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 backdrop-blur">
            Premium spotlight
          </div>
          {projects.length > 1 ? (
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/12 bg-black/15 px-3 py-2 backdrop-blur">
              {projects.map((project, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={(event) => {
                      event.preventDefault()
                      setActiveIndex(index)
                    }}
                    aria-label={`Show ${project.name}`}
                    className={`h-2.5 w-2.5 rounded-full transition duration-300 ${
                      isActive ? "bg-white" : "bg-white/35 hover:bg-white/60"
                    }`}
                  />
                )
              })}
            </div>
          ) : null}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-white/55">{primaryProject.builder}</p>
            <h3 className="mt-2 max-w-xl text-xl font-semibold leading-tight sm:text-[1.8rem]">
              {primaryProject.name}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/80">
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1">
                {primaryProject.location}
              </span>
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1">
                {primaryProject.type}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-lg font-semibold text-[#ffd7b4] sm:text-xl">{primaryProject.price}</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition duration-300 group-hover:translate-x-0.5 group-hover:bg-primary/90">
                Explore project
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        <div className="grid gap-3 sm:grid-cols-2">
          {secondaryProjects.map((project) => (
            <Link
              key={project.id}
              href={getPropertyHref(project.id)}
              className="group grid min-h-[108px] grid-cols-[92px_minmax(0,1fr)] gap-3 rounded-[24px] border border-[#f0dfcd] bg-white/90 p-3 transition duration-500 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_40px_rgba(16,35,36,0.08)] sm:min-h-[116px]"
            >
              <div className="relative overflow-hidden rounded-[18px] bg-muted">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-primary/70">Featured project</p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground sm:text-base">{project.name}</h3>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{project.location}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{project.price}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    View
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
