'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Hand,
  IndianRupee,
  LayoutDashboard,
  Loader2,
  Lock,
  type LucideIcon,
  Search,
  Sparkles,
  Timer,
  Undo2,
  Users,
} from 'lucide-react';

import Header from '@/components/header';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

type AgentTab = 'overview' | 'browse' | 'holds' | 'clients' | 'commissions';

type InventoryRow = {
  id: string;
  pgId: string;
  project: string;
  city: string;
  type: string;
  areaSqft: number | null;
  price: number | null;
  status: 'Available' | 'My Hold' | 'On Hold';
  hold: { active: boolean; byUserId: string | null; expiresAt: string | null };
};

type ClientRow = {
  name: string;
  phone?: string;
};

function formatMoneyINR(value: number | null | undefined) {
  if (!value || !Number.isFinite(value)) return '—';
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function msToRemaining(ms: number) {
  if (ms <= 0) return 'Expired';
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function statusBadgeClass(status: InventoryRow['status']) {
  if (status === 'Available') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'My Hold') return 'border-sky-200 bg-sky-50 text-sky-700';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function DashboardMetric({
  label,
  value,
  helper,
  icon: Icon,
  iconClassName,
  iconSurfaceClassName,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  iconClassName: string;
  iconSurfaceClassName: string;
}) {
  return (
    <div className="rounded-[28px] border border-[#eadcca] bg-white/90 p-5 shadow-[0_24px_70px_-44px_rgba(31,42,46,0.38)]">
      <div className={`inline-flex rounded-2xl p-3 ${iconSurfaceClassName}`}>
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-[#1f2a2e]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-[#1f2a2e]">{label}</p>
      <p className="mt-1 text-xs leading-5 text-[#667085]">{helper}</p>
    </div>
  );
}

function SectionCard({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f2a2e]">{title}</h2>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-7 text-[#667085]">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function AgentDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AgentTab>('overview');
  const [agentName, setAgentName] = useState('Agent');
  const [agentId, setAgentId] = useState('—');
  const [userId, setUserId] = useState<string | null>(null);

  const [q, setQ] = useState('');
  const [category, setCategory] = useState<'all' | 'residential' | 'commercial'>('all');
  const [city, setCity] = useState('');
  const [holdFilter, setHoldFilter] = useState<'all' | 'on-hold' | 'not-on-hold' | 'my-hold'>('all');

  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  const [clients, setClients] = useState<ClientRow[]>([]);
  const [newClient, setNewClient] = useState({ name: '', phone: '' });

  const myHolds = useMemo(() => inventory.filter((item) => item.status === 'My Hold'), [inventory]);

  const clientsKey = useMemo(() => (userId ? `pg:agent:clients:${userId}` : null), [userId]);

  const overviewStats = useMemo(() => {
    const now = Date.now();
    const activeHolds = myHolds
      .map((hold) => {
        const expiresAt = hold.hold.expiresAt ? new Date(hold.hold.expiresAt).getTime() : 0;
        return { ...hold, remainingMs: expiresAt - now };
      })
      .filter((hold) => hold.remainingMs > 0)
      .sort((left, right) => left.remainingMs - right.remainingMs);

    const availableUnits = inventory.filter((item) => item.status === 'Available');
    const otherAgentHolds = inventory.filter((item) => item.status === 'On Hold');
    const myHoldValue = myHolds.reduce((sum, item) => sum + (item.price || 0), 0);

    return {
      activeHolds,
      availableUnits: availableUnits.length,
      otherAgentHolds: otherAgentHolds.length,
      myHoldValue,
      clientsCount: clients.length,
    };
  }, [clients.length, inventory, myHolds]);

  const inventoryView = useMemo(() => {
    return activeTab === 'holds' ? inventory.filter((item) => item.status === 'My Hold') : inventory;
  }, [activeTab, inventory]);

  const tabs: Array<{ id: AgentTab; label: string; icon: LucideIcon }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'browse', label: 'Browse Inventory', icon: Search },
    { id: 'holds', label: 'My Holds', icon: Timer },
    { id: 'clients', label: 'My Clients', icon: Users },
    { id: 'commissions', label: 'My Commissions', icon: IndianRupee },
  ];

  async function loadAgent() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth');
      return;
    }

    setUserId(user.id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role,full_name,agent_id')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'agent') {
      router.push('/');
      return;
    }

    const computedAgentId = profile?.agent_id || `AG-${String(user.id).slice(0, 6).toUpperCase()}`;
    setAgentName(profile?.full_name || user.user_metadata?.full_name || user.email || 'Agent');
    setAgentId(computedAgentId);

    if (!profile?.agent_id) {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: computedAgentId }),
      }).catch(() => undefined);
    }
  }

  async function loadInventory() {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (city) params.set('city', city);
    params.set('category', category);
    params.set('hold', activeTab === 'holds' ? 'my-hold' : holdFilter);
    params.set('limit', '100');

    const response = await fetch(`/api/agent/inventory?${params.toString()}`);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to load inventory');
    }

    const data = await response.json();
    setInventory(data.inventory || []);
  }

  async function holdProperty(propertyId: string) {
    if (!confirm('Hold this property for 48 hours?')) return;

    const response = await fetch('/api/agent/holds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast({
        title: 'Unable to hold',
        description: data?.error || 'Please try again',
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Hold placed', description: 'Reserved for 48 hours.' });
    setRefreshTick((current) => current + 1);
  }

  async function releaseHold(propertyId: string) {
    if (!confirm('Release your hold on this property?')) return;

    const response = await fetch('/api/agent/holds', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast({
        title: 'Unable to release',
        description: data?.error || 'Please try again',
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Hold released' });
    setRefreshTick((current) => current + 1);
  }

  useEffect(() => {
    (async () => {
      try {
        await loadAgent();
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load agent profile',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userId || !clientsKey) return;
    try {
      const raw = localStorage.getItem(clientsKey);
      setClients(raw ? JSON.parse(raw) : []);
    } catch {
      setClients([]);
    }
  }, [clientsKey, userId]);

  useEffect(() => {
    if (clientsKey) {
      localStorage.setItem(clientsKey, JSON.stringify(clients));
    }
  }, [clients, clientsKey]);

  useEffect(() => {
    if (isLoading) return;
    loadInventory().catch((error) => {
      toast({
        title: 'Inventory error',
        description: error instanceof Error ? error.message : 'Failed to load inventory',
        variant: 'destructive',
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isLoading, refreshTick]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('agent-inventory-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        setRefreshTick((current) => current + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#fffdf8_46%,#f6efe8_100%)]">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#eb6239]" />
            <p className="mt-4 text-sm font-medium text-[#667085]">Loading agent dashboard…</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#fffdf8_46%,#f6efe8_100%)]">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-72 shrink-0 flex-col border-r border-[#efd9c8] bg-[linear-gradient(180deg,#fff8f0_0%,#fff2e5_100%)] px-4 pb-6 pt-6 text-[#1f2a2e] shadow-[24px_0_80px_-56px_rgba(126,85,44,0.35)] md:flex">
          <div className="rounded-[28px] border border-[#eadcca] bg-white/90 p-5 shadow-[0_24px_70px_-46px_rgba(31,42,46,0.42)]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1ea] text-xl font-black text-[#eb6239]">
                {agentName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">Agent Dashboard</p>
                <h2 className="truncate text-xl font-black tracking-tight text-[#1f2a2e]">{agentName}</h2>
                <p className="truncate text-xs text-[#667085]">Agent ID: {agentId}</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-sm font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-[#1f2a2e] text-white shadow-[0_18px_48px_-30px_rgba(31,42,46,0.9)]'
                    : 'text-[#52606d] hover:bg-white/80 hover:text-[#1f2a2e]'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-[28px] border border-[#eadcca] bg-white/88 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9ca3af]">Quick actions</p>
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#eb6239] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-20px_rgba(235,98,57,0.55)] transition hover:bg-[#d95c36]"
            >
              <Search className="h-4 w-4" />
              Browse Inventory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('holds')}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#eadcca] bg-white px-4 py-3 text-sm font-bold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
            >
              <Timer className="h-4 w-4" />
              Open My Holds
            </button>
          </div>
        </aside>

        <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mb-6 flex flex-wrap gap-2 md:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-[#1f2a2e] text-white'
                    : 'border border-[#eadcca] bg-white text-[#1f2a2e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-8">
              <section className="rounded-[34px] border border-[#eadcca] bg-[linear-gradient(135deg,rgba(255,248,241,0.96),rgba(255,255,255,0.97))] p-6 shadow-[0_32px_100px_-52px_rgba(31,42,46,0.4)] md:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#9ca3af]">Agent command center</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1f2a2e] md:text-4xl">
                  Overview for {agentName}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
                  Track live inventory access, your active holds, private client book, and the properties you are currently closing.
                </p>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DashboardMetric
                  label="My Active Holds"
                  value={overviewStats.activeHolds.length}
                  helper="Properties currently reserved under your ID."
                  icon={Timer}
                  iconClassName="text-sky-600"
                  iconSurfaceClassName="bg-sky-50"
                />
                <DashboardMetric
                  label="Available Inventory"
                  value={overviewStats.availableUnits}
                  helper="Units you can still place on hold right now."
                  icon={Building2}
                  iconClassName="text-emerald-600"
                  iconSurfaceClassName="bg-emerald-50"
                />
                <DashboardMetric
                  label="My Hold Value"
                  value={formatMoneyINR(overviewStats.myHoldValue)}
                  helper="Combined value of inventory reserved by you."
                  icon={Hand}
                  iconClassName="text-[#eb6239]"
                  iconSurfaceClassName="bg-[#fff1ea]"
                />
                <DashboardMetric
                  label="My Clients"
                  value={overviewStats.clientsCount}
                  helper="Your private browser-saved client list."
                  icon={Users}
                  iconClassName="text-amber-600"
                  iconSurfaceClassName="bg-amber-50"
                />
              </section>

              <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
                <SectionCard
                  eyebrow="Hold Tracker"
                  title="Countdown on your active inventory holds"
                  description="Each hold is reserved for 48 hours. Release it when the buyer drops off so the unit goes live again."
                  action={
                    <button
                      type="button"
                      onClick={() => setActiveTab('holds')}
                      className="inline-flex items-center gap-2 rounded-full bg-[#1f2a2e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2d3c40]"
                    >
                      <Timer className="h-4 w-4" />
                      View holds
                    </button>
                  }
                >
                  {overviewStats.activeHolds.length > 0 ? (
                    <div className="space-y-4">
                      {overviewStats.activeHolds.slice(0, 5).map((hold) => (
                        <div
                          key={hold.id}
                          className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[#f1e2d4] bg-[#fffaf5] p-4"
                        >
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9ca3af]">{hold.city}</p>
                            <h3 className="mt-1 text-lg font-black text-[#1f2a2e]">{hold.project}</h3>
                            <p className="mt-1 text-sm text-[#667085]">
                              {hold.type} {hold.areaSqft ? `· ${hold.areaSqft} sq.ft` : ''} {hold.pgId ? `· ${hold.pgId}` : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                              {msToRemaining(hold.remainingMs)} left
                            </span>
                            <p className="mt-2 text-sm font-semibold text-[#1f2a2e]">{formatMoneyINR(hold.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-6 py-10 text-center">
                      <Timer className="mx-auto h-8 w-8 text-[#eb6239]" />
                      <p className="mt-4 text-lg font-bold text-[#1f2a2e]">No active holds right now</p>
                      <p className="mt-2 text-sm text-[#667085]">Browse live inventory and reserve a unit when a client is ready.</p>
                    </div>
                  )}
                </SectionCard>

                <SectionCard
                  eyebrow="Pipeline Snapshot"
                  title="What the inventory looks like from your desk"
                  description="Quick view of what is available versus already locked by other agents."
                >
                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-[#f1e2d4] bg-[#fffaf5] p-5">
                      <p className="text-sm font-semibold text-[#1f2a2e]">Available to hold</p>
                      <p className="mt-2 text-3xl font-black text-emerald-600">{overviewStats.availableUnits}</p>
                    </div>
                    <div className="rounded-[24px] border border-[#f1e2d4] bg-[#fffaf5] p-5">
                      <p className="text-sm font-semibold text-[#1f2a2e]">Locked by other agents</p>
                      <p className="mt-2 text-3xl font-black text-amber-600">{overviewStats.otherAgentHolds}</p>
                    </div>
                    <div className="rounded-[24px] border border-[#f1e2d4] bg-[#fffaf5] p-5">
                      <p className="text-sm font-semibold text-[#1f2a2e]">Clients saved</p>
                      <p className="mt-2 text-3xl font-black text-[#eb6239]">{overviewStats.clientsCount}</p>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </div>
          ) : null}

          {activeTab === 'browse' || activeTab === 'holds' ? (
            <div className="space-y-6">
              <section className="rounded-[34px] border border-[#eadcca] bg-[linear-gradient(135deg,rgba(255,248,241,0.96),rgba(255,255,255,0.97))] p-6 shadow-[0_32px_100px_-52px_rgba(31,42,46,0.4)] md:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#9ca3af]">
                  {activeTab === 'browse' ? 'Browse inventory' : 'My holds'}
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1f2a2e] md:text-4xl">
                  {activeTab === 'browse' ? 'Search and reserve inventory' : 'Monitor your reserved units'}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
                  {activeTab === 'browse'
                    ? 'Search by project, city, or category and place a 48-hour hold when a serious buyer is ready to move.'
                    : 'This view always pulls your own active holds first, so you can release units fast and keep your pipeline clean.'}
                </p>
              </section>

              <SectionCard
                eyebrow="Filters"
                title="Refine the agent inventory feed"
                description="Apply filters and refresh the feed whenever you need a fresh view."
                action={
                  <button
                    type="button"
                    onClick={() => setRefreshTick((current) => current + 1)}
                    className="rounded-full bg-[#eb6239] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#d95c36]"
                  >
                    Apply filters
                  </button>
                }
              >
                <div className="grid gap-3 lg:grid-cols-[1.4fr,180px,180px,180px]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                    <input
                      type="text"
                      value={q}
                      onChange={(event) => setQ(event.target.value)}
                      placeholder="Search project, city, locality or unit"
                      className="w-full rounded-[20px] border border-[#eadcca] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#eb6239]"
                    />
                  </div>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as 'all' | 'residential' | 'commercial')}
                    className="rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                  >
                    <option value="all">All categories</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Filter by city"
                    className="rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                  />
                  <select
                    value={activeTab === 'holds' ? 'my-hold' : holdFilter}
                    onChange={(event) =>
                      setHoldFilter(event.target.value as 'all' | 'on-hold' | 'not-on-hold' | 'my-hold')
                    }
                    disabled={activeTab === 'holds'}
                    className="rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239] disabled:cursor-not-allowed disabled:bg-[#f9f3ec]"
                  >
                    <option value="all">All statuses</option>
                    <option value="not-on-hold">Not on hold</option>
                    <option value="on-hold">On hold</option>
                    <option value="my-hold">My hold</option>
                  </select>
                </div>
              </SectionCard>

              <SectionCard
                eyebrow="Inventory Feed"
                title={activeTab === 'browse' ? 'Live property pool available to agents' : 'Units currently reserved by you'}
                description={`${inventoryView.length} record${inventoryView.length === 1 ? '' : 's'} in view.`}
              >
                {inventoryView.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] text-sm">
                      <thead className="border-b border-[#eadcca] bg-[#fff8f1] text-left">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-[#7a8793]">PG ID</th>
                          <th className="px-4 py-3 font-semibold text-[#7a8793]">Project</th>
                          <th className="px-4 py-3 font-semibold text-[#7a8793]">City</th>
                          <th className="px-4 py-3 font-semibold text-[#7a8793]">Type</th>
                          <th className="px-4 py-3 font-semibold text-[#7a8793]">Area</th>
                          <th className="px-4 py-3 font-semibold text-[#7a8793]">Price</th>
                          <th className="px-4 py-3 font-semibold text-[#7a8793]">Status</th>
                          <th className="px-4 py-3 text-right font-semibold text-[#7a8793]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryView.map((row) => {
                          const isMine = row.status === 'My Hold';
                          const locked = row.status === 'On Hold';
                          const expiresAt = row.hold.expiresAt ? new Date(row.hold.expiresAt).getTime() : 0;
                          const remaining = expiresAt - Date.now();

                          return (
                            <tr key={row.id} className="border-b border-[#f2e4d6] last:border-b-0">
                              <td className="px-4 py-4 font-mono text-xs text-[#7a8793]">{row.pgId}</td>
                              <td className="px-4 py-4">
                                <p className="font-semibold text-[#1f2a2e]">{row.project}</p>
                                {isMine && row.hold.active ? (
                                  <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">
                                    <Timer className="h-3 w-3" />
                                    {msToRemaining(remaining)} left
                                  </p>
                                ) : null}
                              </td>
                              <td className="px-4 py-4 text-[#667085]">{row.city}</td>
                              <td className="px-4 py-4 text-[#667085]">{row.type}</td>
                              <td className="px-4 py-4 text-[#667085]">
                                {row.areaSqft ? `${row.areaSqft.toLocaleString('en-IN')} sq.ft` : '—'}
                              </td>
                              <td className="px-4 py-4 font-semibold text-[#1f2a2e]">{formatMoneyINR(row.price)}</td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusBadgeClass(row.status)}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right">
                                {row.status === 'Available' ? (
                                  <button
                                    type="button"
                                    onClick={() => holdProperty(row.id)}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#eb6239] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#d95c36]"
                                  >
                                    <Hand className="h-4 w-4" />
                                    Hold
                                  </button>
                                ) : null}
                                {isMine ? (
                                  <button
                                    type="button"
                                    onClick={() => releaseHold(row.id)}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#eadcca] bg-white px-3 py-2 text-xs font-bold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                                  >
                                    <Undo2 className="h-4 w-4" />
                                    Release
                                  </button>
                                ) : null}
                                {locked ? (
                                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                                    <Lock className="h-4 w-4" />
                                    Locked
                                  </span>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-6 py-10 text-center">
                    <Search className="mx-auto h-8 w-8 text-[#eb6239]" />
                    <p className="mt-4 text-lg font-bold text-[#1f2a2e]">No inventory matches this view</p>
                    <p className="mt-2 text-sm text-[#667085]">Adjust the filters or refresh the feed to pull a different set.</p>
                  </div>
                )}
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'clients' ? (
            <div className="space-y-6">
              <section className="rounded-[34px] border border-[#eadcca] bg-[linear-gradient(135deg,rgba(255,248,241,0.96),rgba(255,255,255,0.97))] p-6 shadow-[0_32px_100px_-52px_rgba(31,42,46,0.4)] md:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#9ca3af]">Client desk</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1f2a2e] md:text-4xl">My Clients</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
                  Keep a lightweight private client list right inside the agent workspace. These entries stay local to your browser.
                </p>
              </section>

              <SectionCard eyebrow="Add Client" title="Save a buyer or investor lead">
                <div className="grid gap-3 md:grid-cols-[1fr,220px,auto]">
                  <input
                    value={newClient.name}
                    onChange={(event) => setNewClient((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Client name"
                    className="rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                  />
                  <input
                    value={newClient.phone}
                    onChange={(event) => setNewClient((current) => ({ ...current, phone: event.target.value }))}
                    placeholder="Phone (optional)"
                    className="rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newClient.name.trim()) return;
                      setClients((current) => [
                        { name: newClient.name.trim(), phone: newClient.phone.trim() || undefined },
                        ...current,
                      ]);
                      setNewClient({ name: '', phone: '' });
                    }}
                    className="rounded-full bg-[#eb6239] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#d95c36]"
                  >
                    Add client
                  </button>
                </div>
              </SectionCard>

              <SectionCard
                eyebrow="Client List"
                title="Private client book"
                description={`${clients.length} client${clients.length === 1 ? '' : 's'} saved in this browser.`}
              >
                {clients.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead className="border-b border-[#eadcca] bg-[#fff8f1] text-left">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-[#7a8793]">Client</th>
                          <th className="px-4 py-3 font-semibold text-[#7a8793]">Phone</th>
                          <th className="px-4 py-3 text-right font-semibold text-[#7a8793]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client, index) => (
                          <tr key={`${client.name}-${index}`} className="border-b border-[#f2e4d6] last:border-b-0">
                            <td className="px-4 py-4 font-semibold text-[#1f2a2e]">{client.name}</td>
                            <td className="px-4 py-4 text-[#667085]">{client.phone || '—'}</td>
                            <td className="px-4 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => setClients((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                                className="rounded-full border border-[#f0c9c0] bg-[#fff5f2] px-3 py-2 text-xs font-bold text-[#b55334] transition hover:border-[#df8b76]"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-6 py-10 text-center">
                    <Users className="mx-auto h-8 w-8 text-[#eb6239]" />
                    <p className="mt-4 text-lg font-bold text-[#1f2a2e]">No clients saved yet</p>
                    <p className="mt-2 text-sm text-[#667085]">Add a client above to start keeping follow-up details handy.</p>
                  </div>
                )}
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'commissions' ? (
            <div className="space-y-6">
              <section className="rounded-[34px] border border-[#eadcca] bg-[linear-gradient(135deg,rgba(255,248,241,0.96),rgba(255,255,255,0.97))] p-6 shadow-[0_32px_100px_-52px_rgba(31,42,46,0.4)] md:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#9ca3af]">Commission desk</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1f2a2e] md:text-4xl">My Commissions</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
                  This section is ready for live commission and deal records once those tables are wired into the agent workflow.
                </p>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <DashboardMetric
                  label="Booked This Month"
                  value="—"
                  helper="Will populate from closed deal records."
                  icon={IndianRupee}
                  iconClassName="text-[#eb6239]"
                  iconSurfaceClassName="bg-[#fff1ea]"
                />
                <DashboardMetric
                  label="Deals Closed"
                  value="—"
                  helper="Waiting on transaction tracking."
                  icon={Hand}
                  iconClassName="text-emerald-600"
                  iconSurfaceClassName="bg-emerald-50"
                />
                <DashboardMetric
                  label="Payout Status"
                  value="Pending setup"
                  helper="Commission reporting will appear here next."
                  icon={Sparkles}
                  iconClassName="text-amber-600"
                  iconSurfaceClassName="bg-amber-50"
                />
              </section>

              <SectionCard
                eyebrow="Coming Next"
                title="Commission reporting is scaffolded"
                description="Once deal capture is connected, this area can show closed inventory, payout status, and month-to-date earnings."
              >
                <div className="rounded-[24px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-6 py-10 text-center">
                  <IndianRupee className="mx-auto h-8 w-8 text-[#eb6239]" />
                  <p className="mt-4 text-lg font-bold text-[#1f2a2e]">No commission records yet</p>
                  <p className="mt-2 text-sm text-[#667085]">The theme is aligned now, and the data section is ready for the next backend pass.</p>
                </div>
              </SectionCard>
            </div>
          ) : null}

          <div className="mt-8 flex items-center gap-2 text-sm text-[#667085]">
            <Sparkles className="h-4 w-4 text-[#eb6239]" />
            Agent inventory, holds, and private client notes now live in the same dashboard visual system as admin and builder.
          </div>
        </div>
      </div>
    </main>
  );
}
