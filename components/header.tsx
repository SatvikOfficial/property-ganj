"use client"

import { useState } from "react"
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false)
  const [rentDropdownOpen, setRentDropdownOpen] = useState(false)
  const [sellDropdownOpen, setSellDropdownOpen] = useState(false)
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false)

  return (
    <header className="bg-blue-50 text-foreground sticky top-0 z-[9999] border-b border-blue-200">
    {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/logo.jpg" alt="PropertyGanj Logo" width={40} height={40} className="rounded" />
          <Image src="/logotext.png" alt="PropertyGanj" width={200} height={40} className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          <button className="text-blue-600 text-sm md:text-base hover:text-blue-800 flex items-center gap-1 transition-colors font-medium">
            Lucknow <ChevronDown className="w-4 h-4" />
          </button>
          <div className="hidden md:flex items-center gap-4">
            <div
              className="relative"
              onMouseEnter={() => setLoginDropdownOpen(true)}
              onMouseLeave={() => setLoginDropdownOpen(false)}
            >
              <button
                className="text-sm hover:text-blue-600 flex items-center gap-1 transition-colors font-medium"
              >
                Login {loginDropdownOpen ? <ChevronUp className="w-4 h-4 transition-transform" /> : <ChevronDown className="w-4 h-4 transition-transform" />}
              </button>

              {loginDropdownOpen && (
                <div
                  className="absolute top-full right-0 pt-2 z-[1000]"
                >
                  <div className="bg-background border border-border rounded-lg shadow-lg p-4 w-48 animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="space-y-3 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors block">My Profile</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors block">Liked Properties</a></li>
                      <li className="pt-2 border-t border-border">
                        <Link href="/auth">
                          <Button
  className="
    w-full
    text-white
    font-semibold
    py-2
    h-auto
    transition-all
    rounded-lg
    bg-[#eb6239]               /* Flamingo base */
    border-b-[4px] border-[#d6522f]  /* darker Flamingo for depth */
    hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
    active:brightness-90 active:translate-y-[2px] active:border-b-[2px]
  "
>
  Login / Sign Up
</Button>

                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-1 h-auto transition-all hover:scale-105">
              Post Property{" "}
              <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs ml-1 font-bold">FREE</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-border relative bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 md:gap-8 text-sm md:text-base">
          <div 
            className="relative"
            onMouseEnter={() => setBuyDropdownOpen(true)}
            onMouseLeave={() => setBuyDropdownOpen(false)}
          >
            <button 
              className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors group"
            >
              Buy {buyDropdownOpen ? <ChevronUp className="w-4 h-4 transition-transform" /> : <ChevronDown className="w-4 h-4 transition-transform" />}
            </button>
            
            {buyDropdownOpen && (
              <div 
                className="absolute top-full left-0 pt-2 z-[1000]"
              >
                <div className="bg-background border border-border rounded-lg shadow-lg p-6 w-[800px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Popular Choices</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Ready to Move</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Owner Properties</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Budget Homes</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">New Projects</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Property Types</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Flats in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">House for sale in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Villa in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Plot in Lucknow</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Budget</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Under ₹ 50 Lac</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">₹ 50 Lac - ₹ 1 Cr</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">₹ 1 Cr - ₹ 1.5 Cr</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Above ₹ 1.5 Cr</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Explore</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Localities in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Projects in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Find an Agent</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={() => setRentDropdownOpen(true)}
            onMouseLeave={() => setRentDropdownOpen(false)}
          >
            <button
              className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors group"
            >
              Rent {rentDropdownOpen ? <ChevronUp className="w-4 h-4 transition-transform" /> : <ChevronDown className="w-4 h-4 transition-transform" />}
            </button>

            {rentDropdownOpen && (
              <div
                className="absolute top-full left-0 pt-2 z-[1000]"
              >
                <div className="bg-background border border-border rounded-lg shadow-lg p-6 w-[800px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Popular Choices</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Owner Properties</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Verified Properties</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Furnished Homes</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Bachelor Friendly Homes</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Immediately Available</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Property Types</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Flat for rent in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">House for rent in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Villa for rent in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">PG in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Office Space in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Commercial Space in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Coworking Space in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Coliving Space in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Student Hostels in Lucknow</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Luxury PG in Lucknow</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Budget</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Under ₹ 10,000</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">₹ 10,000 - ₹ 15,000</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">₹ 15,000 - ₹ 25,000</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Above ₹ 25,000</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Explore</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Localities</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Buy Vs Rent</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Find an Agent</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Share Requirement</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Property Services</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Rent Agreement</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={() => setSellDropdownOpen(true)}
            onMouseLeave={() => setSellDropdownOpen(false)}
          >
            <button
              className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors group"
            >
              Sell {sellDropdownOpen ? <ChevronUp className="w-4 h-4 transition-transform" /> : <ChevronDown className="w-4 h-4 transition-transform" />}
            </button>

            {sellDropdownOpen && (
              <div
                className="absolute top-full left-0 pt-2 z-[1000]"
              >
                <div className="bg-background border border-border rounded-lg shadow-lg p-6 w-[400px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="font-bold text-foreground mb-3">For Owner</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-between pr-8">
                        Post Property <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-bold">FREE</span>
                      </a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">My Dashboard</a></li>
                      <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Liked Properties</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>
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
          <button className="block text-foreground hover:text-primary transition-colors">Buy</button>
          <button className="block text-foreground hover:text-primary transition-colors">Rent</button>
          <button className="block text-foreground hover:text-primary transition-colors">Sell</button>
          <button className="block text-foreground hover:text-primary transition-colors">Home Loans</button>
          <Link href="/about" className="block text-foreground hover:text-primary transition-colors">About</Link>
          <button className="block text-foreground hover:text-primary transition-colors">Help</button>
          <div className="space-y-2">
            <Link href="/auth">
              <Button 
                variant="outline" 
                className="w-full bg-transparent"
                onClick={() => setIsOpen(false)} // Close mobile menu
              >
                Sign In
              </Button>
            </Link>
            <Button className="w-full bg-primary hover:bg-primary/90">List Property</Button>
          </div>
        </div>
      )}
      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </header>
  )
}
