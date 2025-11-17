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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Failed to logout", error)
    }
  }

  return (
    <header className="bg-gray-100/90 text-foreground sticky top-0 z-[9999] backdrop-blur-sm">
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
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 space-y-4">
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
          <button className="block text-foreground hover:text-primary transition-colors">Home Loans</button>
          <Link href="/about" className="block text-foreground hover:text-primary transition-colors">About</Link>
          <button className="block text-foreground hover:text-primary transition-colors">Help</button>
          <div className="space-y-2 pt-4 border-t border-border">
            {user ? (
              <>
                <Link href="/profile">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Button>
                </Link>
                <Link href="/profile/my-ads">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setIsOpen(false)}
                  >
                    My Ads
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Sign Up
                </Button>
              </Link>
            )}
            <Link href="/list-property" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setIsOpen(false)}>List Property <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs ml-1 font-bold">FREE</span></Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
