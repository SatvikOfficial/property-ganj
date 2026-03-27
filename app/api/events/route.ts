import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

// Suggested table (to be created in Supabase):
// create table public.events (
//   id uuid primary key default gen_random_uuid(),
//   created_at timestamptz not null default now(),
//   user_id uuid references auth.users(id),
//   event_type text not null,
//   payload jsonb not null
// );

const ALLOWED_EVENT_TYPES = new Set<string>([
  "property_view",
  "property_click",
  "property_like",
  "property_unlike",
  "search",
  "filters_applied",
  "contact_click",
])

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { type, ...rest } = body

  if (!type || typeof type !== "string" || !ALLOWED_EVENT_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const payload = {
    ...rest,
  }

  const { error } = await supabase.from("events").insert({
    event_type: type,
    user_id: user?.id ?? null,
    payload,
  })

  if (error) {
    console.error("Failed to insert event", error)
    // Do not surface detailed error to client – tracking is best-effort
    return NextResponse.json({ ok: false }, { status: 200 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}

