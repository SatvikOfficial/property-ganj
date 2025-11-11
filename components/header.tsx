"use client"

import { useState } from "react"
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false)

  return (
    <header className="bg-background text-foreground sticky top-0 z-[9999] border-b border-border">
    {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/logo.jpg" alt="PropertyGanj Logo" width={40} height={40} className="rounded" />
          <Image src="/logotext.png" alt="PropertyGanj" width={200} height={40} className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          <button className="text-muted-foreground text-sm md:text-base hover:text-primary flex items-center gap-1 transition-colors">
            Lucknow <ChevronDown className="w-4 h-4" />
          </button>
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm hover:text-primary flex items-center gap-1 transition-colors">
              Login <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-1 h-auto transition-all hover:scale-105">
            Post Property{" "}
            <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs ml-1 font-bold">FREE</span>
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-border relative">
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
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors">
            Rent <ChevronDown className="w-4 h-4" />
          </button>
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium transition-colors">
            Sell <ChevronDown className="w-4 h-4" />
          </button>
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
            <Button variant="outline" className="w-full bg-transparent">
              Sign In
            </Button>
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
