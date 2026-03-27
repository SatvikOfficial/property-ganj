export type AnalyticsEvent =
  | {
      type: "property_view"
      propertyId: string
      purpose?: string
      city?: string
      locality?: string
    }
  | {
      type: "property_click"
      propertyId: string
      source?: string
    }
  | {
      type: "property_like" | "property_unlike"
      propertyId: string
    }
  | {
      type: "search"
      query: string
      purpose: string
      location?: string
      locality?: string
      propertyTypes?: string[]
      budgetMin?: number | null
      budgetMax?: number | null
    }
  | {
      type: "filters_applied"
      purpose: string
      location?: string
      locality?: string
      propertyTypes?: string[]
      budgetMin?: number | null
      budgetMax?: number | null
      bhk?: string[]
      ownerType?: string
      tags?: string[]
      sortBy?: string
    }
  | {
      type: "contact_click"
      propertyId: string
      channel: "phone" | "whatsapp" | "email"
    }

export async function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return

  try {
    const payload = {
      ...event,
      path: window.location.pathname,
      referrer: document.referrer || null,
      ts: new Date().toISOString(),
    }

    const url = "/api/events"
    const body = JSON.stringify(payload)

    if ("sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" })
      navigator.sendBeacon(url, blob)
      return
    }

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    })
  } catch {
    // Tracking must never break UX
  }
}

