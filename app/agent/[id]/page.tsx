import { notFound } from 'next/navigation';
import Header from '@/components/header';
import { MapPin, Phone, Mail, Calendar, Users, Home, Star, ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch agent profile from DB
  const { data: agent, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', id)
    .eq('role', 'agent')
    .single();

  if (error || !agent) {
    notFound();
  }

  // Fetch agent's properties
  const { data: properties } = await supabase
    .from('properties')
    .select('_id, title, price, locality, city, property_type, purpose, status, carpet_area_sqft, media')
    .eq('owner_user_id', id)
    .order('created_at', { ascending: false })
    .limit(20);

  const agentProps = properties || [];
  const saleCount = agentProps.filter(p => p.status !== 'draft' && p.purpose !== 'rent').length;
  const rentCount = agentProps.filter(p => p.purpose === 'rent').length;
  const totalProps = agentProps.length;
  const since = agent.created_at ? new Date(agent.created_at).getFullYear() : 2024;
  const operatingCities = agent.city ? agent.city.split(',').map((c: string) => c.trim()) : [];

  const fallbackImages = ["/agent-profile-photo.jpg", "/agent-profile.png", "/agent-photo.jpg"];
  const avatarIdx = Math.abs((agent.user_id?.charCodeAt(0) || 0)) % fallbackImages.length;
  const agentImage = agent.avatar_url || fallbackImages[avatarIdx];

  // Parse specialties from agent_application if present
  const application = agent.agent_application as any;
  const specialties = application?.specialties || [];
  const languages = application?.languages || ['Hindi', 'English'];
  const bio = application?.bio || agent.agent_bio || `Verified real estate professional on PropertyGanj. Operating in ${operatingCities.join(', ') || 'multiple cities'}.`;

  const formatCurrency = (value?: number) => {
    if (!value) return '₹ —';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <Header />
      
      <section className="py-6 md:py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Agent Header Card */}
          <div className="rounded-[30px] border border-[#eadcca] bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.22)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1f2a2e] to-[#2d3c42] p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="relative">
                  <img
                    src={agentImage}
                    alt={agent.full_name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-[22px] object-cover border-4 border-white/20 shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-xs shadow-lg ring-2 ring-white">
                    ✓
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                      Ganj Verified
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{agent.full_name}</h1>
                  <p className="text-white/60 font-medium mt-1">{agent.company_name || 'Independent Agent'}</p>
                  {operatingCities.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      <MapPin className="w-3.5 h-3.5 text-white/40" />
                      {operatingCities.map((city: string) => (
                        <span key={city} className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/80">
                          {city}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-4 md:gap-6 text-center">
                  <div className="rounded-[18px] bg-white/10 px-5 py-3">
                    <p className="text-2xl font-black text-white">{since}</p>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Since</p>
                  </div>
                  <div className="rounded-[18px] bg-white/10 px-5 py-3">
                    <p className="text-2xl font-black text-[#eb6239]">{totalProps}</p>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Listings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="p-5 md:p-8 border-b border-[#eadcca]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-3 rounded-[18px] bg-[#faf8f5] p-4 hover:bg-[#f5f0ea] transition"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eb6239]/10">
                      <Phone className="w-5 h-5 text-[#eb6239]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">Phone</p>
                      <p className="font-semibold text-[#1f2a2e]">{agent.phone}</p>
                    </div>
                  </a>
                )}
                {agent.email && !agent.email.includes('propertyganj.seed') && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-3 rounded-[18px] bg-[#faf8f5] p-4 hover:bg-[#f5f0ea] transition"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                      <Mail className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">Email</p>
                      <p className="font-semibold text-[#1f2a2e]">{agent.email}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* About */}
            <div className="p-5 md:p-8 border-b border-[#eadcca]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-2">About</p>
              <p className="text-[#667085] leading-7">{bio}</p>
            </div>

            {/* Stats Grid */}
            <div className="p-5 md:p-8 border-b border-[#eadcca]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-4">Property Portfolio</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="rounded-[18px] bg-[#faf8f5] p-4 text-center">
                  <p className="text-3xl font-black text-[#eb6239]">{saleCount}</p>
                  <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mt-1">For Sale</p>
                </div>
                <div className="rounded-[18px] bg-[#faf8f5] p-4 text-center">
                  <p className="text-3xl font-black text-sky-600">{rentCount}</p>
                  <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mt-1">For Rent</p>
                </div>
                <div className="rounded-[18px] bg-[#faf8f5] p-4 text-center col-span-2 md:col-span-1">
                  <p className="text-3xl font-black text-emerald-600">{totalProps}</p>
                  <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mt-1">Total</p>
                </div>
              </div>
            </div>

            {/* Specialties & Languages */}
            {(specialties.length > 0 || languages.length > 0) && (
              <div className="p-5 md:p-8 border-b border-[#eadcca]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {specialties.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-3">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {specialties.map((spec: string) => (
                          <span key={spec} className="rounded-full bg-[#eb6239]/10 text-[#eb6239] px-3 py-1.5 text-xs font-bold">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-3">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((lang: string) => (
                          <span key={lang} className="rounded-full bg-[#faf8f5] border border-[#eadcca] text-[#1f2a2e] px-3 py-1.5 text-xs font-bold">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Agent Listings */}
          {agentProps.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground mb-2">Agent listings</p>
              <h2 className="text-2xl font-black tracking-tight text-foreground mb-6">Properties by {agent.full_name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agentProps.slice(0, 12).map((prop: any) => {
                  const image = prop.media?.photos?.[0]?.url || '/modern-apartment.jpg';
                  return (
                    <Link
                      key={prop._id}
                      href={`/property/${prop._id}`}
                      className="group rounded-[22px] border border-[#eadcca] bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="relative h-40 bg-muted overflow-hidden">
                        <img src={image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                          {prop.purpose === 'rent' ? 'Rent' : 'Sale'}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#1f2a2e] text-sm truncate group-hover:text-[#eb6239] transition-colors">{prop.title || prop.property_type}</h3>
                        <p className="text-xs text-[#9ca3af] mt-1">{[prop.locality, prop.city].filter(Boolean).join(', ')}</p>
                        <p className="text-base font-black text-[#1f2a2e] mt-2">{formatCurrency(prop.price)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
