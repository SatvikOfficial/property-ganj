"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

type AgentCard = {
  id: string | number
  name: string
  company: string
  since: number
  buyers: string
  propertiesSale: number
  propertiesRent: number
  image: string
}

export default function HomeAgentsSection() {
  const [agents, setAgents] = useState<AgentCard[]>([])

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents")
        const data = await res.json()
        if (data.agents && data.agents.length > 0) {
          const formattedAgents: AgentCard[] = data.agents.map((agent: any) => ({
            id: agent._id,
            name: agent.name,
            company: agent.agentProfile?.specialization || "Real Estate Agent",
            since: new Date().getFullYear() - (agent.agentProfile?.experience || 0),
            buyers: "50+",
            propertiesSale: 10,
            propertiesRent: 5,
            image:
              agent.agentProfile?.photoUrl ||
              agent.agentProfile?.profileImage ||
              agent.agentProfile?.profileImageUrl ||
              "/agent-profile-photo.jpg",
          }))
          setAgents(formattedAgents)
        } else {
          setAgents([
            {
              id: 1,
              name: "Vivid Infra",
              company: "Vivid Infra Land Pvt Ltd",
              since: 2012,
              buyers: "1000+",
              propertiesSale: 65,
              propertiesRent: 0,
              image: "/agent-profile-photo.jpg",
            },
            {
              id: 2,
              name: "Saurabh Gupta",
              company: "Safe Invest Realty",
              since: 2012,
              buyers: "100+",
              propertiesSale: 56,
              propertiesRent: 0,
              image: "/agent-profile.png",
            },
            {
              id: 3,
              name: "Rahul Juyal",
              company: "Pratham Realty Solutions",
              since: 2011,
              buyers: "4000+",
              propertiesSale: 71,
              propertiesRent: 0,
              image: "/agent-photo.jpg",
            },
            {
              id: 4,
              name: "Shiyaram Singh",
              company: "S.R. Broker LLP",
              since: 2017,
              buyers: "4000+",
              propertiesSale: 144,
              propertiesRent: 10,
              image: "/agent-profile-photo.jpg",
            },
          ])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchAgents()
  }, [])

  return (
    <section className="bg-gradient-to-br from-accent/20 via-accent/10 to-accent/20 py-8 md:py-12">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ganj Trusted Agents in Lucknow</h2>
          <Link
            href="/search?ownerType=agent"
            className="text-primary font-semibold hover:gap-2 flex items-center gap-1 transition-all text-sm md:text-base"
          >
            See all →
          </Link>
        </div>

        <div className="relative">
          <div
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-0 snap-x snap-mandatory"
            data-agent-scroll
          >
            {agents.map((agent, index) => (
              <Link
                key={agent.id || `agent-${index}`}
                href={`/agent/${agent.id}`}
                className="card-premium p-6 min-w-[320px] snap-start group flex-shrink-0"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative">
                    <img
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-primary text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">{agent.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-border">
                  <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-transparent rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Operating Since</p>
                    <p className="font-bold text-foreground text-lg">{agent.since}</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-secondary/5 to-transparent rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Buyers Served</p>
                    <p className="font-bold text-foreground text-lg">{agent.buyers}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="font-bold text-primary text-2xl mb-1">{agent.propertiesSale}</p>
                    <p className="text-xs text-muted-foreground">For Sale</p>
                  </div>
                  {agent.propertiesRent > 0 && (
                    <div className="text-center">
                      <p className="font-bold text-secondary text-2xl mb-1">{agent.propertiesRent}</p>
                      <p className="text-xs text-muted-foreground">For Rent</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => {
              const container = document.querySelector("[data-agent-scroll]")
              if (container) {
                container.scrollBy({ left: 300, behavior: "smooth" })
              }
            }}
            className="hidden md:flex absolute right-0 md:-right-4 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-3 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 z-10 transition-all items-center justify-center border border-border"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  )
}

