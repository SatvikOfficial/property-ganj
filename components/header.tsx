"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronRight, LogOut, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import CitySelector from "@/components/CitySelector"
import { createClient } from "@/utils/supabase/client"

type UserInfo = {
  name: string
  email: string
  role?: string
  id?: string
  avatarUrl?: string | null
}

type NavSection = {
  title: string
  items: { label: string; href: string; tag?: string }[]
}

type NavGroup = {
  title: string
  href: string
  description: string
  sections?: NavSection[]
}

const navGroups: NavGroup[] = [
  {
    title: "Buy",
    href: "/search?purpose=sale",
    description: "Premium buying journeys across ready homes, new launches, and plots.",
    sections: [
      {
        title: "Explore Homes",
        items: [
          { label: "Ready to move", href: "/search?purpose=sale" },
          { label: "New projects", href: "/search?purpose=sale&q=New%20Projects" },
          { label: "Owner listings", href: "/search?purpose=sale" },
          { label: "Luxury apartments", href: "/search?purpose=sale&propertyType=Apartment" },
        ],
      },
      {
        title: "Popular Searches",
        items: [
          { label: "Flats in Gomti Nagar", href: "/search?q=Gomti%20Nagar&purpose=sale" },
          { label: "Plots on Sultanpur Road", href: "/search?q=Sultanpur%20Road&purpose=sale" },
          { label: "Villas in Lucknow", href: "/search?q=Lucknow&purpose=sale&propertyType=Independent%20House/Villa" },
          { label: "Commercial buy", href: "/search?q=Lucknow&purpose=sale&propertyType=Office%20Space" },
        ],
      },
    ],
  },
  {
    title: "Rent",
    href: "/search?purpose=rent",
    description: "Well-located rentals, PG, and furnished options for every move.",
    sections: [
      {
        title: "Rental Types",
        items: [
          { label: "Flats for rent", href: "/search?purpose=rent&propertyType=Apartment" },
          { label: "House rentals", href: "/search?purpose=rent&propertyType=Independent%20House/Villa" },
          { label: "PG stays", href: "/search?purpose=rent&q=PG" },
          { label: "Commercial rent", href: "/search?purpose=rent&propertyType=Office%20Space" },
        ],
      },
      {
        title: "Quick Starts",
        items: [
          { label: "Furnished homes", href: "/search?q=Lucknow&purpose=rent" },
          { label: "Near Hazratganj", href: "/search?q=Hazratganj&purpose=rent" },
          { label: "Student friendly", href: "/search?q=IIM%20Road&purpose=rent" },
          { label: "Family homes", href: "/search?q=Indira%20Nagar&purpose=rent" },
        ],
      },
    ],
  },
  {
    title: "Sell",
    href: "/list-property",
    description: "List faster, reach serious buyers, and get supported through the funnel.",
    sections: [
      {
        title: "For Owners & Agents",
        items: [
          { label: "Post property", href: "/list-property", tag: "Free" },
          { label: "Owner dashboard", href: "/profile/my-ads" },
          { label: "Liked properties", href: "/profile/liked" },
          { label: "Agent profile", href: "/agent" },
        ],
      },
    ],
  },
  {
    title: "Blogs",
    href: "/blog",
    description: "Market reads, buyer guides, and locality intelligence from PropertyGanj.",
    sections: [
      {
        title: "Featured Reads",
        items: [
          { label: "Circle rates decoded", href: "/blog/1" },
          { label: "Registration budgeting", href: "/blog/3" },
          { label: "Metro-led investing", href: "/blog/4" },
          { label: "Best localities in 2026", href: "/blog/6" },
        ],
      },
    ],
  },
  {
    title: "Home Loans",
    href: "/home-loans",
    description: "Bank comparisons, eligibility support, and guided paperwork.",
  },
  {
    title: "About",
    href: "/about",
    description: "What PropertyGanj stands for and how the platform is built.",
  },
  {
    title: "Help",
    href: "/help",
    description: "Talk to support, browse FAQs, and resolve account or listing issues.",
  },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [supabase] = useState(() => createClient())

  const router = useRouter()

  useEffect(() => {
    const fetchProfileData = async (userId: string, authUser: any) => {
      const { data: profile } = await supabase.from("profiles").select("role, avatar_url").eq("user_id", userId).single()
      setUser({
        name: authUser.user_metadata?.full_name || authUser.email || "User",
        email: authUser.email || "",
        id: userId,
        role: profile?.role,
        avatarUrl: profile?.avatar_url || null,
      })
    }

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (currentUser) {
        fetchProfileData(currentUser.id, currentUser)
      } else {
        setUser(null)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfileData(session.user.id, session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsMenuOpen(false)
    setExpandedGroup(null)
    router.push("/auth")
    router.refresh()
  }

  const dashboardHref =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "agent"
        ? "/agent"
        : user?.role === "builder"
          ? "/builder"
          : null

  const dashboardLabel =
    user?.role === "admin"
      ? "Admin Dashboard"
      : user?.role === "agent"
        ? "Agent Dashboard"
        : user?.role === "builder"
          ? "Builder Dashboard"
          : null

  return (
    <header className="sticky top-0 z-[9999] border-b border-border/70 bg-gray-100/90 text-foreground backdrop-blur-sm">
      <div className="w-full">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3 transition duration-300 hover:opacity-90">
            <Image src="/logo.jpg" alt="PropertyGanj Logo" width={42} height={42} className="rounded-lg" />
            <Image src="/logotext.png" alt="PropertyGanj" width={184} height={36} className="hidden h-8 w-auto md:block" />
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <CitySelector />
            {user ? (
              <div className="group relative">
                <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition duration-300 hover:border-primary/30 hover:text-primary">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                  {user.name}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full hidden pt-2 group-hover:block">
                  <div className="min-w-[220px] rounded-2xl border border-border bg-white p-2 shadow-lg">
                    <Link href="/profile" className="block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-accent">
                      My Profile
                    </Link>
                    <Link href="/profile/liked" className="block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-accent">
                      Liked Properties
                    </Link>
                    <Link href="/profile/my-ads" className="block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-accent">
                      My Ads
                    </Link>
                    {dashboardHref && dashboardLabel ? (
                      <Link href={dashboardHref} className="block rounded-xl px-4 py-3 text-sm font-medium text-primary transition hover:bg-accent">
                        {dashboardLabel}
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="h-auto rounded-lg bg-[#eb6239] px-4 py-2 text-sm font-semibold text-white transition-all border-b-[4px] border-[#d6522f] hover:-translate-y-[1px] hover:border-b-[5px] hover:bg-[#ef724d] active:translate-y-[1px] active:border-b-[3px]">
                  Login / Sign Up
                </Button>
              </Link>
            )}
            <Link href="/list-property">
              <Button className="h-auto rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:bg-primary/90">
                Post Property
                <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-accent-foreground">
                  Free
                </span>
              </Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen((open) => {
                const next = !open
                if (!next) setExpandedGroup(null)
                return next
              })
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-white text-foreground transition duration-300 hover:border-primary/35 hover:text-primary md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="hidden border-t border-border bg-white md:block">
          <div className="flex items-center gap-x-7 py-3 pl-6 md:gap-x-8 md:pl-8 lg:gap-x-10 lg:pl-10">
            {navGroups.map((group) => {
              const hasSections = Boolean(group.sections?.length)

              return (
                <div key={group.title} className="group relative">
                  <div className="flex items-center gap-1 py-1.5">
                    <Link href={group.href} className="text-sm font-medium text-foreground transition duration-300 group-hover:text-primary">
                      {group.title}
                    </Link>
                    {hasSections ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition duration-300 group-hover:text-primary" />
                    ) : null}
                  </div>

                  {hasSections ? (
                    <div className="invisible opacity-0 absolute left-0 top-full w-[min(760px,82vw)] pt-1 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                      <div className="rounded-[28px] border border-border bg-white p-5 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
                        <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
                          <div className="rounded-[24px] bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">PropertyGanj</p>
                            <h3 className="mt-2 text-lg font-semibold text-foreground">{group.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p>
                            <Link href={group.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                              Open {group.title}
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </div>
                          <div className={`grid gap-4 ${group.sections && group.sections.length > 1 ? "md:grid-cols-2" : ""}`}>
                            {group.sections?.map((section) => (
                              <div key={section.title}>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                  {section.title}
                                </p>
                                <div className="mt-3 space-y-2">
                                  {section.items.map((item) => (
                                    <Link
                                      key={item.label}
                                      href={item.href}
                                      className="flex items-center justify-between rounded-2xl border border-transparent px-3 py-2 text-sm font-medium text-foreground transition duration-300 hover:border-primary/15 hover:bg-accent hover:text-primary"
                                    >
                                      <span>{item.label}</span>
                                      {item.tag ? (
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-primary">
                                          {item.tag}
                                        </span>
                                      ) : null}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </nav>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-border bg-white pb-5 pl-6 pr-4 pt-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:hidden">
          <div className="space-y-3">
            {navGroups.map((group) => {
              const hasSections = Boolean(group.sections?.length)
              const expanded = expandedGroup === group.title

              return (
                <div key={group.title} className="rounded-2xl border border-border bg-white">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <Link
                      href={group.href}
                      onClick={() => {
                        setIsMenuOpen(false)
                        setExpandedGroup(null)
                      }}
                      className="text-sm font-semibold text-foreground"
                    >
                      {group.title}
                    </Link>
                    {hasSections ? (
                      <button
                        type="button"
                        onClick={() => setExpandedGroup(expanded ? null : group.title)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary"
                        aria-label={`Toggle ${group.title}`}
                      >
                        <ChevronDown className={`h-4 w-4 transition duration-300 ${expanded ? "rotate-180" : ""}`} />
                      </button>
                    ) : null}
                  </div>
                  {hasSections && expanded ? (
                    <div className="space-y-4 border-t border-border px-4 py-4">
                      <p className="text-sm leading-6 text-muted-foreground">{group.description}</p>
                      {group.sections?.map((section) => (
                        <div key={section.title}>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            {section.title}
                          </p>
                          <div className="mt-2 space-y-2">
                            {section.items.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => {
                                  setIsMenuOpen(false)
                                  setExpandedGroup(null)
                                }}
                                className="flex items-center justify-between rounded-2xl bg-accent px-3 py-2 text-sm font-medium text-foreground"
                              >
                                <span>{item.label}</span>
                                {item.tag ? (
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-primary">
                                    {item.tag}
                                  </span>
                                ) : null}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="mt-4 space-y-3 rounded-[28px] border border-border bg-white p-4">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setExpandedGroup(null)
                  }}
                  className="block rounded-2xl bg-accent px-4 py-3 text-sm font-medium"
                >
                  My Profile
                </Link>
                <Link
                  href="/profile/liked"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setExpandedGroup(null)
                  }}
                  className="block rounded-2xl bg-accent px-4 py-3 text-sm font-medium"
                >
                  Liked Properties
                </Link>
                <Link
                  href="/profile/my-ads"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setExpandedGroup(null)
                  }}
                  className="block rounded-2xl bg-accent px-4 py-3 text-sm font-medium"
                >
                  My Ads
                </Link>
                {dashboardHref && dashboardLabel ? (
                  <Link
                    href={dashboardHref}
                    onClick={() => {
                      setIsMenuOpen(false)
                      setExpandedGroup(null)
                    }}
                    className="block rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-primary"
                  >
                    {dashboardLabel}
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setExpandedGroup(null)
                  }}
                  className="block rounded-full bg-[#eb6239] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login / Sign Up
                </Link>
                <Link
                  href="/list-property"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setExpandedGroup(null)
                  }}
                  className="block rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Post Property Free
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
