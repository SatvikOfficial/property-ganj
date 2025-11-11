"use client"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-background text-foreground sticky top-0 z-50 border-b border-border">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">magicbricks</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <button className="text-muted-foreground text-sm md:text-base hover:text-primary flex items-center gap-1">
            Lucknow <ChevronDown className="w-4 h-4" />
          </button>
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm hover:text-primary flex items-center gap-1">
              MB Prime <ChevronDown className="w-4 h-4" />
            </button>
            <button className="text-sm hover:text-primary flex items-center gap-1">
              Login <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-1 h-auto">
            Post Property{" "}
            <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs ml-1 font-bold">FREE</span>
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 md:gap-8 text-sm md:text-base overflow-x-auto">
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium">
            Buy <ChevronDown className="w-4 h-4" />
          </button>
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium">
            Rent <ChevronDown className="w-4 h-4" />
          </button>
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium">
            Sell <ChevronDown className="w-4 h-4" />
          </button>
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium">
            Home Loans <ChevronDown className="w-4 h-4" />
          </button>
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium">
            Home Interiors <ChevronDown className="w-4 h-4" />
          </button>
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium">
            MB Advice <ChevronDown className="w-4 h-4" />{" "}
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded ml-1">NEW</span>
          </button>
          <button className="whitespace-nowrap hover:text-primary flex items-center gap-1 font-medium">
            Help <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 space-y-4">
          <button className="block text-foreground hover:text-primary">Buy</button>
          <button className="block text-foreground hover:text-primary">Rent</button>
          <button className="block text-foreground hover:text-primary">Sell</button>
          <button className="block text-foreground hover:text-primary">Home Loans</button>
          <button className="block text-foreground hover:text-primary">Home Interiors</button>
          <button className="block text-foreground hover:text-primary">MB Advice</button>
          <button className="block text-foreground hover:text-primary">Help</button>
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
