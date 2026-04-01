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
  const visibleProjects = orderedProjects.slice(0, 4)

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {visibleProjects.map((project, index) => (
          <Link
            key={`${project.id}-${index}`}
            href={getPropertyHref(project.id)}
            className="group relative min-h-[196px] overflow-hidden rounded-[28px] border border-[#f3d4b5] bg-[#102324] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(16,35,36,0.12)] xl:min-h-[228px]"
          >
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,35,36,0.04)_15%,rgba(16,35,36,0.56)_52%,rgba(16,35,36,0.96)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,205,164,0.28),transparent_30%)]" />
            <div className="absolute left-3.5 top-3.5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75 backdrop-blur">
              {index === 0 ? "Premium spotlight" : "Featured project"}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <p className="line-clamp-1 text-[11px] uppercase tracking-[0.22em] text-white/58">
                {project.builder}
              </p>
              <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight text-white">
                {project.name}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-white/78">
                <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1">
                  {project.location}
                </span>
                <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1">
                  {project.type}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#ffd7b4] sm:text-base">{project.price}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/20">
                  View
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length > 1 ? (
        <div className="flex justify-center gap-2">
          {projects.map((project, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${project.name}`}
                className={`h-2.5 w-2.5 rounded-full transition duration-300 ${
                  isActive ? "bg-[#102324]" : "bg-[#102324]/20 hover:bg-[#102324]/45"
                }`}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
