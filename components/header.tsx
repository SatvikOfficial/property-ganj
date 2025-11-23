"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import StyledDropdown from "@/components/StyledDropdown"
import { useRouter } from "next/navigation"

type User = {
  name: string;
  email: string;
  role?: 'user' | 'agent' | 'admin';
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to fetch user", error)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Failed to logout", error)
    }
  }

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])


  return (
    <header className="bg-gray-100/90 text-foreground sticky top-0 z-[9999] backdrop-blur-sm overflow-visible">
      <style jsx global>{`
        .burger {
          position: relative;
          width: 30px;
          height: 20px;
          background: transparent;
          cursor: pointer;
          display: block;
        }

        .burger input {
          display: none;
        }

        .burger span {
          display: block;
          position: absolute;
          height: 3px;
          width: 100%;
          background: currentColor;
          border-radius: 3px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: .25s ease-in-out;
        }

        .burger span:nth-of-type(1) {
          top: 0px;
          transform-origin: left center;
        }

        .burger span:nth-of-type(2) {
          top: 50%;
          transform: translateY(-50%);
          transform-origin: left center;
        }

        .burger span:nth-of-type(3) {
          top: 100%;
          transform-origin: left center;
          transform: translateY(-100%);
        }

        .burger.active span:nth-of-type(1) {
          transform: rotate(45deg);
          top: 0px;
          left: 5px;
        }

        .burger.active span:nth-of-type(2) {
          width: 0%;
          opacity: 0;
        }

        .burger.active span:nth-of-type(3) {
          transform: rotate(-45deg);
          top: 28px;
          left: 5px;
        }

        /* Full-screen mobile menu overlay */
        .mobile-menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9997;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .mobile-menu-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: white;
          z-index: 9998;
          padding: 0;
          overflow-y: auto;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-20px);
          transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
        }

        .mobile-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .mobile-menu-content {
          padding: 2rem 1.5rem;
          flex: 1;
          overflow-y: auto;
        }

        .mobile-nav-link {
          display: block;
          padding: 1.25rem 1rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 1px solid #f3f4f6;
          transition: all 0.2s ease;
        }

        .mobile-nav-link:hover {
          background: #f9fafb;
          color: #eb6239;
          padding-left: 1.5rem;
        }

        .mobile-nav-link:active {
          background: #f3f4f6;
        }

      `}</style>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/logo.jpg" alt="PropertyGanj Logo" width={40} height={40} className="rounded" />
          <Image src="/logotext.png" alt="PropertyGanj" width={100} height={20} className="h-5 w-auto md:h-8 md:w-auto" />
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden md:flex items-center gap-4">
            <button className="text-foreground text-sm md:text-base hover:text-primary flex items-center gap-1 transition-colors font-medium">
              Lucknow <ChevronDown className="w-4 h-4" />
            </button>
            {user ? (
              <div className="relative group">
                <button className="text-sm text-foreground hover:text-primary flex items-center gap-1 transition-colors font-medium">
                  <User className="w-4 h-4 mr-1" />
                  {user.name} <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground">My Profile</Link>
                  <Link href="/profile/liked" className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground">Liked Properties</Link>
                  <Link href="/profile/my-ads" className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground">My Ads</Link>
                  <div className="border-t my-2"></div>
                  <Button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <Button
                  className="
                    text-white
                    font-semibold
                    py-2
                    h-auto
                    transition-all
                    rounded-lg
                    bg-[#eb6239]
                    border-b-[4px] border-[#d6522f]
                    hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                    active:brightness-90 active:translate-y-[2px] active:border-b-[2px]
                  "
                >
                  Login / Sign Up
                </Button>
              </Link>
            )}
            {(!user || user.role !== 'agent') && (
              <Link href="/agent-registration">
                <Button className="bg-white text-foreground hover:bg-gray-100 border border-gray-200 text-sm font-semibold px-4 py-1 h-auto transition-all">
                  Register as Agent
                </Button>
              </Link>
            )}
            <Link href="/list-property">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-1 h-auto transition-all hover:scale-105 button-glow">
                Post Property{" "}
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs ml-1 font-bold">FREE</span>
              </Button>
            </Link>
          </div>

          {/* Mobile: List Property Button + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/list-property">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-2 h-auto transition-all">
                Post Property
                <span className="bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full text-[10px] ml-1 font-bold">FREE</span>
              </Button>
            </Link>
            <button
              className={`burger ${isOpen ? 'active' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle mobile menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="hidden md:flex border-t border-border relative bg-white">
        <div className="max-w-7xl w-full px-4 py-3 flex items-center justify-start gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-sm lg:text-base text-foreground">
          <StyledDropdown
            title="Buy"
            sections={[
              {
                title: "Popular Choices",
                items: [
                  { href: "#", label: "Ready to Move" },
                  { href: "#", label: "Owner Properties" },
                  { href: "#", label: "Budget Homes" },
                  { href: "#", label: "New Projects" }
                ]
              },
              {
                title: "Property Types",
                items: [
                  { href: "#", label: "Flats in Lucknow" },
                  { href: "#", label: "House for sale in Lucknow" },
                  { href: "#", label: "Villa in Lucknow" },
                  { href: "#", label: "Plot in Lucknow" }
                ]
              },
              {
                title: "Budget",
                items: [
                  { href: "#", label: "Under ₹ 50 Lac" },
                  { href: "#", label: "₹ 50 Lac - ₹ 1 Cr" },
                  { href: "#", label: "₹ 1 Cr - ₹ 1.5 Cr" },
                  { href: "#", label: "Above ₹ 1.5 Cr" }
                ]
              },
              {
                title: "Explore",
                items: [
                  { href: "#", label: "Localities in Lucknow" },
                  { href: "#", label: "Projects in Lucknow" },
                  { href: "#", label: "Find an Agent" }
                ]
              }
            ]}
          />
          <StyledDropdown
            title="Rent"
            sections={[
              {
                title: "Popular Choices",
                items: [
                  { href: "#", label: "Owner Properties" },
                  { href: "#", label: "Verified Properties" },
                  { href: "#", label: "Furnished Homes" },
                  { href: "#", label: "Bachelor Friendly Homes" },
                  { href: "#", label: "Immediately Available" }
                ]
              },
              {
                title: "Property Types",
                items: [
                  { href: "#", label: "Flat for rent in Lucknow" },
                  { href: "#", label: "House for rent in Lucknow" },
                  { href: "#", label: "Villa for rent in Lucknow" },
                  { href: "#", label: "PG in Lucknow" },
                  { href: "#", label: "Office Space in Lucknow" },
                  { href: "#", label: "Commercial Space in Lucknow" },
                  { href: "#", label: "Coworking Space in Lucknow" },
                  { href: "#", label: "Coliving Space in Lucknow" },
                  { href: "#", label: "Student Hostels in Lucknow" },
                  { href: "#", label: "Luxury PG in Lucknow" }
                ]
              },
              {
                title: "Budget",
                items: [
                  { href: "#", label: "Under ₹ 10,000" },
                  { href: "#", label: "₹ 10,000 - ₹ 15,000" },
                  { href: "#", label: "₹ 15,000 - ₹ 25,000" },
                  { href: "#", label: "Above ₹ 25,000" }
                ]
              },
              {
                title: "Explore",
                items: [
                  { href: "#", label: "Localities" },
                  { href: "#", label: "Buy Vs Rent" },
                  { href: "#", label: "Find an Agent" },
                  { href: "#", label: "Share Requirement" },
                  { href: "#", label: "Property Services" },
                  { href: "#", label: "Rent Agreement" }
                ]
              }
            ]}
          />
          <StyledDropdown
            title="Sell"
            sections={[
              {
                title: "For Owner",
                items: [
                  {
                    href: "/list-property",
                    label: "Post Property FREE"
                  },
                  { href: "#", label: "My Dashboard" },
                  { href: "#", label: "Liked Properties" }
                ]
              }
            ]}
          />
          <StyledDropdown
            title="Blogs"
            sections={[
              {
                title: "Property Ganj Insights",
                items: [
                  { href: "/blog/1", label: "Understanding Circle Rates" },
                  { href: "/blog/2", label: "Vastu Shastra Guidelines" },
                  { href: "/blog/3", label: "Stamp Duty & Registration" },
                  { href: "/blog/4", label: "Metro Network Impact" },
                  { href: "/blog/5", label: "LDA vs RERA" },
                  { href: "/blog/6", label: "Top Investment Areas" }
                ]
              },
              {
                title: "Loan & Finance",
                items: [
                  { href: "/blog/1", label: "Home Loan Eligibility" },
                  { href: "/blog/2", label: "Interest Rates & EMI" },
                  { href: "/blog/3", label: "Top Banks for Home Loans" },
                  { href: "/blog/4", label: "Home Loan Documents" },
                  { href: "/blog/5", label: "Pre-EMI vs Full EMI" },
                  { href: "/blog/6", label: "Tax Benefits on Home Loans" }
                ]
              }
            ]}
          />
          <Link href="/home-loan" className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors border-b border-transparent hover:border-primary py-1 px-2 rounded">
            Home Loans
          </Link>
          <Link href="/builders" className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors border-b border-transparent hover:border-primary py-1 px-2 rounded">
            Builders
          </Link>
          <Link href="/projects" className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors border-b border-transparent hover:border-primary py-1 px-2 rounded">
            Projects
          </Link>
          <Link href="/about" className="whitespace-nowrap hover:text-primary font-medium transition-colors border-b border-transparent hover:border-primary py-1 px-2 rounded">
            About
          </Link>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div
        className={`mobile-menu-backdrop ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mobile-menu-header">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Image src="/logo.jpg" alt="PropertyGanj Logo" width={32} height={32} className="rounded" />
            <Image src="/logotext.png" alt="PropertyGanj" width={120} height={24} className="h-6 w-auto" />
          </Link>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mobile-menu-content">
          <nav className="space-y-1">
            {/* Primary Navigation Links */}
            <Link
              href="/"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/buy"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Buy
            </Link>

            <Link
              href="/rent"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Rent
            </Link>

            <Link
              href="/sell"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Sell
            </Link>

            <Link
              href="/blog"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Blogs
            </Link>

            <Link
              href="/home-loan"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Home Loans
            </Link>

            <Link
              href="/builders"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Builders
            </Link>

            <Link
              href="/projects"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>

            <Link
              href="/about"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {user ? (
              <div className="space-y-3">
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Signed in as</p>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                >
                  My Profile
                </Link>

                <Link
                  href="/profile/my-ads"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                >
                  My Ads
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 rounded-lg bg-[#eb6239] text-white hover:brightness-110 transition-all font-semibold"
                >
                  Login / Sign Up
                </Link>

                <Link
                  href="/agent-registration"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Register as Agent
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
