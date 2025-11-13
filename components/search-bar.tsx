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
        <button 
          onClick={handleSearch}
          className="flex items-center text-white border-none rounded-full transition-all hover:scale-105 active:scale-95 group"
          style={{ 
            background: 'linear-gradient(to right, #eb6239, #d6522f)',
            padding: '0.8em 1.3em 0.8em 0.9em',
            fontSize: '17px',
            fontWeight: '500',
            letterSpacing: '0.05em'
          }}
        >
          <svg height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-1 group-hover:rotate-90">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor" />
          </svg>
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-1.5">Search</span>
        </button>
      </div>
    </div>
  )
}
