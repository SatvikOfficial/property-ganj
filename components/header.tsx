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
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleLogout = async () => {
    try {
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Failed to logout", error)
    }
  }

  return (
    <header className="bg-gray-100/90 text-foreground sticky top-0 z-[9999] backdrop-blur-sm">
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

        /* Compact mobile menu styling */
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
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1rem 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .mobile-menu-content {
          padding: 1rem;
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/logo.jpg" alt="PropertyGanj Logo" width={40} height={40} className="rounded" />
          <Image src="/logotext.png" alt="PropertyGanj" width={200} height={40} className="hidden md:block h-8 w-auto" />
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
            <Link href="/list-property">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-1 h-auto transition-all hover:scale-105 button-glow">
                Post Property{" "}
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs ml-1 font-bold">FREE</span>
              </Button>
            </Link>
          </div>
          <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <div className={`burger ${isOpen ? 'active' : ''}`} onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling to parent onClick
              setIsOpen(!isOpen);
            }}>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="hidden md:flex border-t border-border relative bg-white">
        <div className="max-w-7xl w-full px-4 py-3 flex items-center justify-start gap-4 md:gap-8 text-sm md:text-base text-foreground">
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
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors">
            Home Loans <ChevronDown className="w-4 h-4" />
          </button>
          <Link href="/about" className="whitespace-nowrap hover:text-primary font-medium transition-colors">
            About
          </Link>
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors">
            Help <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="PropertyGanj Logo" width={30} height={30} className="rounded" />
            <Image src="/logotext.png" alt="PropertyGanj" width={150} height={30} className="h-6 w-auto" />
          </Link>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mobile-menu-content">
          <div className="space-y-6">
            {/* Navigation Items */}
            <div className="space-y-3">
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
                    ]
                  },
                  {
                    title: "Property Types",
                    items: [
                      { href: "#", label: "Flat for rent in Lucknow" },
                      { href: "#", label: "House for rent in Lucknow" },
                      { href: "#", label: "PG in Lucknow" },
                    ]
                  },
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
                    ]
                  }
                ]}
              />
              <div className="pt-2">
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
              </div>
              <button className="block w-full text-left text-foreground hover:text-primary transition-colors py-2 border-b border-gray-100">
                Home Loans
              </button>
              <Link href="/about" className="block text-foreground hover:text-primary transition-colors py-2 border-b border-gray-100">
                About
              </Link>
              <button className="block w-full text-left text-foreground hover:text-primary transition-colors py-2 border-b border-gray-100">
                Help
              </button>
            </div>

            {/* Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    My Profile
                  </Link>
                  <Link href="/profile/my-ads" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    My Ads
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-center py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/auth" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                    Login / Sign Up
                  </Link>
                </div>
              )}
              <Link href="/list-property" onClick={() => setIsOpen(false)} className="w-full block">
                <Button className="w-full bg-primary hover:bg-primary/90 py-3">
                  List Property
                  <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs ml-2 font-bold">FREE</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
