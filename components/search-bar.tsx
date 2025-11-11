"use client"

import { useState } from "react"
import { MapPin, ChevronDown, Search, Mic, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const [location, setLocation] = useState("Lucknow")
  const [propertyType, setPropertyType] = useState("Flat +2")
  const [budget, setBudget] = useState("Budget")
  const [isListening, setIsListening] = useState(false)
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams({
      location,
      type: propertyType,
      budget,
    })
    router.push(`/search?${params.toString()}`)
  }

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      setLocation("Detecting location...")
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const city = data.address?.city || data.address?.town || data.address?.village || "Unknown Location"
            setLocation(city)
          } catch (error) {
            console.error("Error reverse geocoding:", error)
            setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
          }
        },
        (error) => {
          console.error("Error detecting location:", error)
          setLocation("Lucknow")
          alert("Unable to detect location. Please enable location services.")
        }
      )
    } else {
      alert("Geolocation is not supported by your browser")
    }
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = 'en-US'
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setLocation(transcript)
      }
      
      recognition.start()
    } else {
      alert('Voice recognition is not supported in your browser')
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center bg-background rounded-full border-2 border-black shadow-sm hover:shadow-md transition-shadow p-1.5">
        {/* Location Input */}
        <div className="flex items-center gap-2 px-3 flex-1">
          <MapPin className="w-4 h-4 text-primary" />
          <input
            type="text"
            placeholder="Lucknow"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 outline-none text-foreground bg-transparent text-sm"
          />
          <Button
            onClick={handleAutoDetect}
            variant="ghost"
            size="sm"
            className="h-7 px-2 hover:bg-secondary/20 rounded-md transition-all group"
            title="Auto-detect location"
          >
            <Locate className="w-3.5 h-3.5 text-muted-foreground group-hover:text-secondary group-hover:scale-110 transition-all duration-200" />
          </Button>
          <Button
            onClick={handleVoiceInput}
            variant="ghost"
            size="sm"
            className="h-7 px-2 hover:bg-primary/10 rounded-md transition-all group"
            title="Voice input"
          >
            <Mic className={`w-3.5 h-3.5 transition-all duration-200 ${isListening ? 'text-primary animate-pulse scale-110' : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'}`} />
          </Button>
        </div>

        {/* Property Type Dropdown */}
        <div className="flex items-center gap-2 px-3 border-l border-border">
          <input
            type="text"
            placeholder="Flat +2"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="outline-none text-foreground bg-transparent w-20 text-sm"
          />
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        {/* Budget Dropdown */}
        <div className="flex items-center gap-2 px-3 border-l border-border">
          <input
            type="text"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="outline-none text-foreground bg-transparent w-16 text-sm"
          />
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2 h-9 transition-all hover:scale-105 active:scale-95">
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
