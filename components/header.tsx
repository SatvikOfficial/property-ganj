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
  const [isScrolled, setIsScrolled] = useState(false)
  const [supabase] = useState(() => createClient())

  const router = useRouter()

  const closeMenu = () => {
    setIsMenuOpen(false)
    setExpandedGroup(null)
  }

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") return

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    }

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [isMenuOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    closeMenu()
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

  const mobileProfileLinks = [
    { href: "/profile", label: "My Profile" },
    { href: "/profile/liked", label: "Liked Properties" },
    { href: "/profile/my-ads", label: "My Ads" },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-[9999] border-b border-border/70 text-foreground backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? "bg-[rgba(248,250,252,0.94)] shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)]"
          : "bg-[rgba(248,250,252,0.86)]"
      }`}
    >
      <div className="pg-mobile-safe-top w-full">
        <div
          className={`flex items-center justify-between gap-3 px-4 transition-[padding] duration-300 md:px-0 ${
            isScrolled ? "py-2" : "py-3"
          }`}
        >
          <Link href="/" className="flex min-w-0 items-center gap-3 transition duration-300 hover:opacity-90">
            <Image
              src="/logo.jpg"
              alt="PropertyGanj Logo"
              width={42}
              height={42}
              className={`rounded-xl object-contain transition-all duration-300 ${isScrolled ? "h-10 w-10" : "h-[42px] w-[42px]"}`}
            />
            <div className="min-w-0 overflow-hidden md:hidden">
              <span
                className={`block whitespace-nowrap text-sm font-black tracking-[0.22em] text-[#1f2a2e] transition-all duration-300 ${
                  isScrolled ? "max-w-0 translate-y-[-2px] opacity-0" : "max-w-[10rem] opacity-100"
                }`}
              >
                PROPERTYGANJ
              </span>
            </div>
            <Image src="/logotext.png" alt="PropertyGanj" width={184} height={36} className={`hidden object-contain md:block transition-all duration-300 ${isScrolled ? "h-8 w-[163px]" : "h-[36px] w-[184px]"}`} />
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
                      className="h-7 w-7 rounded-full border border-border object-cover"
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
                <Button className="h-auto rounded-lg border-b-[4px] border-[#d6522f] bg-[#eb6239] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-[1px] hover:border-b-[5px] hover:bg-[#ef724d] active:translate-y-[1px] active:border-b-[3px]">
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
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white text-foreground transition duration-300 md:hidden ${
              isMenuOpen ? "border-primary/35 text-primary shadow-[0_12px_28px_-18px_rgba(235,98,57,0.5)]" : "border-border"
            }`}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
                    <div className="invisible absolute left-0 top-full w-[min(760px,82vw)] pt-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
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
      </header>

      <div className="pg-mobile-drawer-shell md:hidden" data-open={isMenuOpen}>
        <button
          type="button"
          aria-label="Close mobile navigation"
          className="pg-mobile-drawer-backdrop"
          onClick={closeMenu}
        />

        <div className="pg-mobile-drawer">
          <div className="flex items-center justify-between gap-3 rounded-[28px] border border-white/70 bg-white/85 px-4 py-3 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.2)] backdrop-blur">
            <div className="flex min-w-0 items-center gap-3">
              <Image src="/logo.jpg" alt="PropertyGanj Logo" width={40} height={40} className="h-10 w-10 rounded-xl object-contain" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Navigation</p>
                <p className="truncate text-sm font-semibold text-[#1f2a2e]">PropertyGanj</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="pg-mobile-drawer-item mt-4 rounded-[28px] border border-[#eadcca] bg-white/90 p-4 shadow-[0_20px_48px_-36px_rgba(15,23,42,0.22)]"
            style={{ transitionDelay: isMenuOpen ? "90ms" : "0ms" }}
          >
            {user ? (
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-11 w-11 rounded-2xl border border-border object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-black text-primary">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1f2a2e]">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  Sign in to save listings, manage ads, and move faster once you find the right property.
                </p>
                <Link
                  href="/auth"
                  onClick={closeMenu}
                  className="flex h-11 items-center justify-center rounded-full bg-[#eb6239] px-4 text-sm font-semibold text-white"
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {navGroups.map((group, index) => {
              const hasSections = Boolean(group.sections?.length)
              const expanded = expandedGroup === group.title

              return (
                <div
                  key={group.title}
                  className="pg-mobile-drawer-item rounded-[26px] border border-[#eadcca] bg-white/92 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)]"
                  style={{ transitionDelay: isMenuOpen ? `${140 + index * 45}ms` : "0ms" }}
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-4">
                    <Link
                      href={group.href}
                      onClick={closeMenu}
                      className="min-w-0 text-sm font-bold text-[#1f2a2e]"
                    >
                      {group.title}
                    </Link>
                    {hasSections ? (
                      <button
                        type="button"
                        onClick={() => setExpandedGroup(expanded ? null : group.title)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4ed] text-primary"
                        aria-label={`Toggle ${group.title}`}
                      >
                        <ChevronDown className={`h-4 w-4 transition duration-300 ${expanded ? "rotate-180" : ""}`} />
                      </button>
                    ) : null}
                  </div>

                  {hasSections && expanded ? (
                    <div className="space-y-4 border-t border-[#f2e5d9] px-4 pb-4 pt-3">
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
                                onClick={closeMenu}
                                className="flex min-h-11 items-center justify-between rounded-2xl bg-[#faf6f1] px-4 py-3 text-sm font-medium text-foreground"
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

          <div
            className="pg-mobile-drawer-item mt-4 space-y-3 rounded-[28px] border border-[#eadcca] bg-white/92 p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)]"
            style={{ transitionDelay: isMenuOpen ? "420ms" : "0ms" }}
          >
            {user ? (
              <>
                {mobileProfileLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex min-h-11 items-center rounded-2xl bg-[#faf6f1] px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                {dashboardHref && dashboardLabel ? (
                  <Link
                    href={dashboardHref}
                    onClick={closeMenu}
                    className="flex min-h-11 items-center rounded-2xl bg-[#fff4ed] px-4 py-3 text-sm font-semibold text-primary"
                  >
                    {dashboardLabel}
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : null}

            <Link
              href="/list-property"
              onClick={closeMenu}
              className="flex h-11 items-center justify-center rounded-full bg-[#1f2a2e] px-4 text-sm font-semibold text-white"
            >
              Post Property Free
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
