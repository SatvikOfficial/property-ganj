'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { createClient } from '@/utils/supabase/client';
import { Loader2, LayoutDashboard, Search, Lock, Timer, Users, IndianRupee, Hand, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

function formatMoneyINR(v: number | null | undefined) {
  if (!v || !Number.isFinite(v)) return '—';
  return `₹${Number(v).toLocaleString('en-IN')}`;
}

function msToRemaining(ms: number) {
  if (ms <= 0) return 'Expired';
  const totalMin = Math.floor(ms / 60000);
  const d = Math.floor(totalMin / (60 * 24));
  const h = Math.floor((totalMin % (60 * 24)) / 60);
  const m = totalMin % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function statusBadgeClass(status: InventoryRow['status']) {
  if (status === 'Available') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 'My Hold') return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-amber-100 text-amber-700 border-amber-200';
}

export default function AgentDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AgentTab>('overview');
  const [agentName, setAgentName] = useState<string>('Agent');
  const [agentId, setAgentId] = useState<string>('—');
  const [userId, setUserId] = useState<string | null>(null);

  // Filters
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<'all' | 'residential' | 'commercial'>('all');
  const [city, setCity] = useState('');
  const [holdFilter, setHoldFilter] = useState<'all' | 'on-hold' | 'not-on-hold' | 'my-hold'>('all');

  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  const myHolds = useMemo(() => inventory.filter(i => i.status === 'My Hold'), [inventory]);

  const clientsKey = useMemo(() => (userId ? `pg:agent:clients:${userId}` : null), [userId]);
  const [clients, setClients] = useState<{ name: string; phone?: string }[]>([]);
  const [newClient, setNewClient] = useState({ name: '', phone: '' });

  const stats = useMemo(() => {
    const now = Date.now();
    const activeHolds = myHolds
      .map(h => {
        const exp = h.hold.expiresAt ? new Date(h.hold.expiresAt).getTime() : 0;
        return { ...h, remainingMs: exp - now };
      })
      .filter(h => h.remainingMs > 0)
      .sort((a, b) => a.remainingMs - b.remainingMs);

    return {
      activeHolds,
      dealsClosedMtd: 0,
      commissionsMtdAmount: 0,
      commissionsMtdDeals: 0,
      clientsCount: clients.length,
    };
  }, [myHolds, clients.length]);

  async function loadAgent() {
    const { data: { user } } = await supabase.auth.getUser();
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
      // best effort backfill for older agent profiles.
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
    params.set('hold', holdFilter);
    params.set('limit', '100');

    const res = await fetch(`/api/agent/inventory?${params.toString()}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to load inventory');
    }
    const data = await res.json();
    setInventory(data.inventory || []);
  }

  async function holdProperty(propertyId: string) {
    if (!confirm('Hold this property for 48 hours?')) return;
    const res = await fetch('/api/agent/holds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: 'Unable to hold', description: data?.error || 'Please try again', variant: 'destructive' });
      return;
    }
    toast({ title: 'Hold placed', description: 'Reserved for 48 hours.' });
    setRefreshTick(t => t + 1);
  }

  async function releaseHold(propertyId: string) {
    if (!confirm('Release your hold on this property?')) return;
    const res = await fetch('/api/agent/holds', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: 'Unable to release', description: data?.error || 'Please try again', variant: 'destructive' });
      return;
    }
    toast({ title: 'Hold released' });
    setRefreshTick(t => t + 1);
  }

  useEffect(() => {
    (async () => {
      try {
        await loadAgent();
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
        toast({ title: 'Error', description: e?.message || 'Failed to load agent profile', variant: 'destructive' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userId) return;
    if (clientsKey) {
      try {
        const raw = localStorage.getItem(clientsKey);
        setClients(raw ? JSON.parse(raw) : []);
      } catch {
        setClients([]);
      }
    }
  }, [clientsKey, userId]);

  useEffect(() => {
    if (clientsKey) localStorage.setItem(clientsKey, JSON.stringify(clients));
  }, [clients, clientsKey]);

  useEffect(() => {
    if (isLoading) return;
    loadInventory().catch((e) => {
      toast({ title: 'Inventory error', description: e?.message || 'Failed to load', variant: 'destructive' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, refreshTick]);

  // Live updates: refresh when properties change (hold fields/status)
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel('agent-inventory-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        setRefreshTick(t => t + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const tabs: { id: AgentTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'My Overview', icon: LayoutDashboard },
    { id: 'browse', label: 'Browse Inventory', icon: Search },
    { id: 'holds', label: 'My Holds', icon: Timer },
    { id: 'clients', label: 'My Clients', icon: Users },
    { id: 'commissions', label: 'My Commissions', icon: IndianRupee },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary w-10 h-10 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading agent dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border pt-8 px-4 sticky top-16 h-[calc(100vh-64px)]">
          <div className="mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-foreground truncate">{agentName}</h2>
                <p className="text-xs text-muted-foreground">Agent ID: {agentId}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-accent/20 hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 text-[10px] font-semibold transition ${
                activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-0.5" />
              {tab.label.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{agentName} · Overview</h1>
                <p className="text-muted-foreground mt-1">Track your holds, clients, and monthly performance.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'My Active Holds', value: stats.activeHolds.length, icon: Timer, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'With time remaining' },
                  { label: 'Deals Closed (MTD)', value: stats.dealsClosedMtd, icon: Hand, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'This month' },
                  { label: 'My Clients', value: stats.clientsCount, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Private to you' },
                  { label: 'Commissions (MTD)', value: formatMoneyINR(stats.commissionsMtdAmount), icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50', sub: `${stats.commissionsMtdDeals} deals closed` },
                ].map((card, i) => (
                  <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-xl ${card.bg}`}>
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{card.value}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{card.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">My Active Holds</h2>
                    <p className="text-xs text-muted-foreground mt-1">Reserved for 48 hours from hold time.</p>
                  </div>
                  <div className="p-5">
                    {stats.activeHolds.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No active holds.</p>
                    ) : (
                      <div className="space-y-3">
                        {stats.activeHolds.slice(0, 6).map(h => {
                          const exp = h.hold.expiresAt ? new Date(h.hold.expiresAt).getTime() : 0;
                          const remaining = exp - Date.now();
                          return (
                            <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/20">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground truncate">{h.project}</p>
                                <p className="text-xs text-muted-foreground">PG ID: {h.pgId} · {h.city}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-1 rounded-full inline-flex items-center gap-1">
                                  <Timer className="w-3 h-3" /> {msToRemaining(remaining)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">Browse Inventory (quick)</h2>
                    <p className="text-xs text-muted-foreground mt-1">Use filters and hold/release from the inventory tab.</p>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search project/city/locality…" className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
                      <button onClick={() => setRefreshTick(t => t + 1)} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                        Search
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setActiveTab('browse')} className="px-4 py-2.5 rounded-xl bg-accent/30 hover:bg-accent/40 border border-border text-sm font-bold">
                        Open Inventory
                      </button>
                      <button onClick={() => { setHoldFilter('my-hold'); setActiveTab('holds'); }} className="px-4 py-2.5 rounded-xl bg-accent/30 hover:bg-accent/40 border border-border text-sm font-bold">
                        View My Holds
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'browse' || activeTab === 'holds') && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  {activeTab === 'browse' ? 'Browse Inventory' : 'My Holds'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {activeTab === 'browse'
                    ? 'Hold a property for 48 hours to reserve it while you close.'
                    : 'Properties currently held by you.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search project / city / locality…"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <select value={category} onChange={e => setCategory(e.target.value as any)} className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold focus:ring-2 focus:ring-primary outline-none">
                  <option value="all">All</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="City filter" className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold focus:ring-2 focus:ring-primary outline-none" />
                <select
                  value={activeTab === 'holds' ? 'my-hold' : holdFilter}
                  onChange={e => setHoldFilter(e.target.value as any)}
                  className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                  disabled={activeTab === 'holds'}
                >
                  <option value="all">All</option>
                  <option value="not-on-hold">Not on hold</option>
                  <option value="on-hold">On hold</option>
                  <option value="my-hold">My hold</option>
                </select>
                <button onClick={() => setRefreshTick(t => t + 1)} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                  Apply
                </button>
              </div>

              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold text-muted-foreground">PG ID</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Project</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">City</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Type (BHK)</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Area</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Price</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                        <th className="text-right p-4 font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeTab === 'holds'
                        ? inventory.filter(i => i.status === 'My Hold')
                        : inventory
                      ).map((row) => {
                        const isMine = row.status === 'My Hold';
                        const locked = row.status === 'On Hold';
                        const exp = row.hold.expiresAt ? new Date(row.hold.expiresAt).getTime() : 0;
                        const remaining = exp - Date.now();
                        return (
                          <tr key={row.id} className="border-b border-border/30 hover:bg-accent/5 transition">
                            <td className="p-4 font-mono text-xs text-muted-foreground">{row.pgId}</td>
                            <td className="p-4">
                              <p className="font-semibold text-foreground truncate max-w-[260px]">{row.project}</p>
                              {isMine && row.hold.active && (
                                <p className="text-[11px] text-blue-700 font-bold mt-1 inline-flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                                  <Timer className="w-3 h-3" /> {msToRemaining(remaining)} left
                                </p>
                              )}
                            </td>
                            <td className="p-4 text-muted-foreground">{row.city}</td>
                            <td className="p-4 text-muted-foreground">{row.type}</td>
                            <td className="p-4 text-muted-foreground">{row.areaSqft ? `${row.areaSqft} sq.ft` : '—'}</td>
                            <td className="p-4 font-semibold text-foreground">{formatMoneyINR(row.price)}</td>
                            <td className="p-4">
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusBadgeClass(row.status)}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {row.status === 'Available' && (
                                <button
                                  onClick={() => holdProperty(row.id)}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90"
                                >
                                  <Hand className="w-4 h-4" />
                                  Hold
                                </button>
                              )}
                              {isMine && (
                                <button
                                  onClick={() => releaseHold(row.id)}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs hover:opacity-90"
                                >
                                  <Undo2 className="w-4 h-4" />
                                  Release
                                </button>
                              )}
                              {locked && (
                                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-muted-foreground font-bold text-xs border border-border">
                                  <Lock className="w-4 h-4" />
                                  Locked
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {(activeTab === 'holds'
                  ? inventory.filter(i => i.status === 'My Hold').length === 0
                  : inventory.length === 0) && (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="font-semibold">No results</p>
                    <p className="text-sm">Try adjusting filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Clients</h1>
                <p className="text-muted-foreground mt-1">Private to you (stored in this browser for now).</p>
              </div>

              <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} placeholder="Client name" className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <input value={newClient.phone} onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))} placeholder="Phone (optional)" className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <button
                    onClick={() => {
                      if (!newClient.name.trim()) return;
                      setClients(prev => [{ name: newClient.name.trim(), phone: newClient.phone.trim() || undefined }, ...prev]);
                      setNewClient({ name: '', phone: '' });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30 border border-border">
                      <tr>
                        <th className="text-left p-3 font-semibold text-muted-foreground">Client</th>
                        <th className="text-left p-3 font-semibold text-muted-foreground">Phone</th>
                        <th className="text-right p-3 font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((c, idx) => (
                        <tr key={`${c.name}-${idx}`} className="border-b border-border/30">
                          <td className="p-3 font-semibold text-foreground">{c.name}</td>
                          <td className="p-3 text-muted-foreground">{c.phone || '—'}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setClients(prev => prev.filter((_, i) => i !== idx))}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {clients.length === 0 && <p className="text-sm text-muted-foreground mt-4">No clients added yet.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commissions' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Commissions</h1>
                <p className="text-muted-foreground mt-1">MTD commission tracking will be wired once deals/commission records exist.</p>
              </div>
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <p className="text-sm text-muted-foreground">No commission records yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
