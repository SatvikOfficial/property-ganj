'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Edit3,
  Home,
  IndianRupee,
  LayoutDashboard,
  Loader2,
  PackagePlus,
  PhoneCall,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';

import Header from '@/components/header';
import ListPropertyForm from '@/components/listing/ListPropertyForm';
import { useToast } from '@/hooks/use-toast';
import type { DbPropertyRecord } from '@/lib/property-listing';

type BuilderTab = 'overview' | 'inventory' | 'units' | 'leads' | 'reports';

type BuilderDashboardData = {
  builder: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatarUrl: string | null;
  };
  stats: {
    totalUnits: number;
    availableUnits: number;
    onHoldUnits: number;
    soldUnits: number;
    soldThisMonth: number;
  };
  projects: Array<{
    name: string;
    totalUnits: number;
    availableUnits: number;
    onHoldUnits: number;
    soldUnits: number;
    totalValue: number;
    latestUpdatedAt: string | null;
    coverImage: string | null;
  }>;
  inventory: Array<{
    id: string;
    title: string;
    unitId: string;
    projectName: string;
    unitLabel: string | null;
    tower: string | null;
    floorType: string;
    area: number | null;
    areaUnit: string;
    price: number | null;
    status: 'Available' | 'On Hold' | 'Sold' | 'Draft';
    imageUrl: string | null;
    hold: {
      active: boolean;
      byUserId: string | null;
      byName: string | null;
      byPhone: string | null;
      byRole: string | null;
      expiresAt: string | null;
    };
    createdAt: string | null;
    updatedAt: string | null;
  }>;
  holds: Array<{
    id: string;
    title: string;
    unitId: string;
    projectName: string;
    unitLabel: string | null;
    tower: string | null;
    floorType: string;
    area: number | null;
    areaUnit: string;
    price: number | null;
    status: 'Available' | 'On Hold' | 'Sold' | 'Draft';
    imageUrl: string | null;
    hold: {
      active: boolean;
      byUserId: string | null;
      byName: string | null;
      byPhone: string | null;
      byRole: string | null;
      expiresAt: string | null;
    };
    createdAt: string | null;
    updatedAt: string | null;
  }>;
  leads: Array<{
    id: string;
    name: string;
    email?: string;
    phone: string;
    property_title: string;
    projectName: string;
    unitId: string;
    created_at: string;
    assignedAgentName: string | null;
  }>;
  reports: {
    liveInventoryValue: number;
    soldInventoryValueThisMonth: number;
    averageTicketSize: number;
    averageArea: number;
    activeProjects: number;
    totalLeads: number;
    soldUnits: number;
  };
  properties: DbPropertyRecord[];
};

function formatMoney(value?: number | null) {
  if (!value || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function timeUntil(value?: string | null) {
  if (!value) return 'No expiry';
  const diff = new Date(value).getTime() - Date.now();
  if (diff <= 0) return 'Expired';

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

function statusBadgeClass(status: BuilderDashboardData['inventory'][number]['status']) {
  if (status === 'Available') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'On Hold') return 'border-amber-200 bg-amber-50 text-amber-700';
  if (status === 'Sold') return 'border-rose-200 bg-rose-50 text-rose-700';
  return 'border-slate-200 bg-slate-100 text-slate-700';
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
  icon: any;
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

function InventoryTable({
  rows,
  onEdit,
  onDelete,
}: {
  rows: BuilderDashboardData['inventory'];
  onEdit: (propertyId: string, projectName: string) => void;
  onDelete: (propertyId: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-sm">
        <thead className="border-b border-[#eadcca] bg-[#fff8f1] text-left">
          <tr>
            <th className="px-4 py-3 font-semibold text-[#7a8793]">Unit ID</th>
            <th className="px-4 py-3 font-semibold text-[#7a8793]">Project</th>
            <th className="px-4 py-3 font-semibold text-[#7a8793]">Floor Type</th>
            <th className="px-4 py-3 font-semibold text-[#7a8793]">Area</th>
            <th className="px-4 py-3 font-semibold text-[#7a8793]">Price</th>
            <th className="px-4 py-3 font-semibold text-[#7a8793]">Status</th>
            <th className="px-4 py-3 font-semibold text-[#7a8793]">Hold By</th>
            <th className="px-4 py-3 font-semibold text-right text-[#7a8793]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[#f2e4d6] last:border-b-0">
              <td className="px-4 py-4">
                <p className="font-semibold text-[#1f2a2e]">{row.unitLabel || row.unitId}</p>
                <p className="text-xs text-[#7a8793]">{row.unitId}</p>
              </td>
              <td className="px-4 py-4">
                <p className="font-semibold text-[#1f2a2e]">{row.projectName}</p>
                <p className="text-xs text-[#7a8793]">{row.tower || row.title}</p>
              </td>
              <td className="px-4 py-4 text-[#667085]">{row.floorType}</td>
              <td className="px-4 py-4 text-[#667085]">
                {row.area ? `${row.area.toLocaleString('en-IN')} ${row.areaUnit}` : '—'}
              </td>
              <td className="px-4 py-4 font-semibold text-[#1f2a2e]">{formatMoney(row.price)}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusBadgeClass(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-4 text-[#667085]">
                {row.hold.active ? row.hold.byName || 'Assigned agent' : '—'}
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(row.id, row.projectName)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#eadcca] bg-white px-3 py-2 text-xs font-bold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(row.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#f0c9c0] bg-[#fff5f2] px-3 py-2 text-xs font-bold text-[#b55334] transition hover:border-[#df8b76]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BuilderDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<BuilderDashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<BuilderTab>('overview');
  const [inventorySearch, setInventorySearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [projectDraftName, setProjectDraftName] = useState('');

  const propertyMap = useMemo(() => {
    return new Map((dashboard?.properties || []).map((property) => [property.id, property]));
  }, [dashboard?.properties]);

  const selectedProperty = selectedPropertyId ? propertyMap.get(selectedPropertyId) || null : null;
  const builderDefaults = useMemo(
    () => (projectDraftName ? { projectName: projectDraftName } : undefined),
    [projectDraftName],
  );

  const filteredInventory = useMemo(() => {
    const rows = dashboard?.inventory || [];
    return rows.filter((row) => {
      const projectMatches = projectFilter ? row.projectName === projectFilter : true;
      const searchNeedle = inventorySearch.trim().toLowerCase();
      const searchMatches = !searchNeedle
        ? true
        : [
            row.projectName,
            row.title,
            row.unitId,
            row.unitLabel,
            row.tower,
            row.floorType,
          ]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(searchNeedle));

      return projectMatches && searchMatches;
    });
  }, [dashboard?.inventory, inventorySearch, projectFilter]);

  const inventoryHealth = useMemo(() => {
    const total = dashboard?.stats.totalUnits || 0;
    const available = dashboard?.stats.availableUnits || 0;
    const onHold = dashboard?.stats.onHoldUnits || 0;
    const sold = dashboard?.stats.soldUnits || 0;

    if (total === 0) {
      return [
        { label: 'Available', value: 0, width: 34, className: 'bg-emerald-400' },
        { label: 'On Hold', value: 0, width: 33, className: 'bg-amber-400' },
        { label: 'Sold', value: 0, width: 33, className: 'bg-rose-400' },
      ];
    }

    return [
      { label: 'Available', value: available, width: (available / total) * 100, className: 'bg-emerald-500' },
      { label: 'On Hold', value: onHold, width: (onHold / total) * 100, className: 'bg-amber-500' },
      { label: 'Sold', value: sold, width: (sold / total) * 100, className: 'bg-rose-500' },
    ];
  }, [dashboard?.stats]);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/builder/dashboard', { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.push('/auth');
        return;
      }

      if (response.status === 403) {
        router.push('/profile');
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to load builder dashboard');
      }

      setDashboard(data);
      setSelectedPropertyId((current) => {
        if (!current) return current;
        return data.properties?.some((property: DbPropertyRecord) => property.id === current) ? current : null;
      });
    } catch (error) {
      toast({
        title: 'Builder dashboard unavailable',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mutateProperty = async (
    propertyId: string,
    init: RequestInit,
    successMessage: string,
  ) => {
    const response = await fetch(`/api/properties/${propertyId}`, init);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.error || 'Unable to update unit');
    }

    toast({
      title: 'Inventory updated',
      description: successMessage,
    });
    await loadDashboard();
  };

  const handleEdit = (propertyId: string, projectName: string) => {
    setSelectedPropertyId(propertyId);
    setProjectDraftName(projectName);
    setActiveTab('units');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddUnit = (projectName = '') => {
    setSelectedPropertyId(null);
    setProjectDraftName(projectName);
    setActiveTab('units');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Delete this unit from your inventory?')) return;

    try {
      await mutateProperty(propertyId, { method: 'DELETE' }, 'The unit has been removed from your builder inventory.');
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReleaseHold = async (propertyId: string) => {
    try {
      await mutateProperty(
        propertyId,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'release_hold' }),
        },
        'The active hold has been cleared from this unit.',
      );
    } catch (error) {
      toast({
        title: 'Release failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMarkSold = async (propertyId: string) => {
    try {
      await mutateProperty(
        propertyId,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'mark_sold' }),
        },
        'The unit is now marked sold and removed from active holds.',
      );
    } catch (error) {
      toast({
        title: 'Unable to mark sold',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const tabs: Array<{ id: BuilderTab; label: string; icon: any }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'My Inventory', icon: Home },
    { id: 'units', label: 'Add / Edit Units', icon: PackagePlus },
    { id: 'leads', label: 'My Leads', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#fffdf8_46%,#f6efe8_100%)]">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#eb6239]" />
            <p className="mt-4 text-sm font-medium text-[#667085]">Loading builder dashboard…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#fffdf8_46%,#f6efe8_100%)]">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden md:flex sticky top-16 h-[calc(100vh-64px)] w-72 shrink-0 flex-col border-r border-[#efd9c8] bg-[linear-gradient(180deg,#fff8f0_0%,#fff2e5_100%)] px-4 pb-6 pt-6 text-[#1f2a2e] shadow-[24px_0_80px_-56px_rgba(126,85,44,0.35)]">
          <div className="rounded-[28px] border border-[#eadcca] bg-white/90 p-5 shadow-[0_24px_70px_-46px_rgba(31,42,46,0.42)]">
            <div className="flex items-center gap-4">
              {dashboard.builder.avatarUrl ? (
                <img
                  src={dashboard.builder.avatarUrl}
                  alt={dashboard.builder.name}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1ea] text-xl font-black text-[#eb6239]">
                  {(dashboard.builder.name || 'B').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">Builder Dashboard</p>
                <h2 className="truncate text-xl font-black tracking-tight text-[#1f2a2e]">{dashboard.builder.name}</h2>
                <p className="truncate text-xs text-[#667085]">{dashboard.builder.email}</p>
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
              onClick={() => handleAddUnit()}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#eb6239] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-20px_rgba(235,98,57,0.55)] transition hover:bg-[#d95c36]"
            >
              <PackagePlus className="h-4 w-4" />
              Add New Unit
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
                <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#9ca3af]">Builder command center</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1f2a2e] md:text-4xl">
                  Overview for {dashboard.builder.name}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
                  Track live inventory, active holds, routed leads, and project performance from one builder-focused workspace.
                </p>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DashboardMetric
                  label="Total Units"
                  value={dashboard.stats.totalUnits}
                  helper="Across all of your builder projects."
                  icon={Building2}
                  iconClassName="text-[#eb6239]"
                  iconSurfaceClassName="bg-[#fff1ea]"
                />
                <DashboardMetric
                  label="Available"
                  value={dashboard.stats.availableUnits}
                  helper="Ready for callbacks and conversion."
                  icon={CheckCircle2}
                  iconClassName="text-emerald-600"
                  iconSurfaceClassName="bg-emerald-50"
                />
                <DashboardMetric
                  label="On Hold"
                  value={dashboard.stats.onHoldUnits}
                  helper="Reserved by assigned agents or teams."
                  icon={Clock3}
                  iconClassName="text-amber-600"
                  iconSurfaceClassName="bg-amber-50"
                />
                <DashboardMetric
                  label="Sold This Month"
                  value={dashboard.stats.soldThisMonth}
                  helper="Units marked sold in the current month."
                  icon={IndianRupee}
                  iconClassName="text-rose-600"
                  iconSurfaceClassName="bg-rose-50"
                />
              </section>

              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">Inventory Health</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f2a2e]">Availability mix across your units</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddUnit()}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1f2a2e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2d3c40]"
                  >
                    <PackagePlus className="h-4 w-4" />
                    Add unit
                  </button>
                </div>

                <div className="mt-6 overflow-hidden rounded-full bg-[#f2e6da]">
                  <div className="flex h-5 w-full">
                    {inventoryHealth.map((segment) => (
                      <div
                        key={segment.label}
                        className={segment.className}
                        style={{ width: `${segment.width}%` }}
                        title={`${segment.label}: ${segment.value}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {inventoryHealth.map((segment) => (
                    <div key={segment.label} className="rounded-[22px] border border-[#f1e2d4] bg-[#fffaf5] px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-3 w-3 rounded-full ${segment.className}`} />
                        <p className="text-sm font-semibold text-[#1f2a2e]">{segment.label}</p>
                      </div>
                      <p className="mt-3 text-2xl font-black text-[#1f2a2e]">{segment.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">My Inventory</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f2a2e]">Units under your control</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className="inline-flex items-center gap-2 rounded-full border border-[#eadcca] bg-white px-4 py-2.5 text-sm font-bold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                  >
                    Open inventory
                  </button>
                </div>
                <div className="mt-6">
                  {dashboard.inventory.length > 0 ? (
                    <InventoryTable rows={dashboard.inventory} onEdit={handleEdit} onDelete={handleDelete} />
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-6 py-10 text-center">
                      <Building2 className="mx-auto h-8 w-8 text-[#eb6239]" />
                      <p className="mt-4 text-lg font-bold text-[#1f2a2e]">No units yet</p>
                      <p className="mt-2 text-sm text-[#667085]">Create your first project unit to start the builder workflow.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">Holds On My Units</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f2a2e]">Release holds or close the sale</h2>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {dashboard.holds.length > 0 ? (
                    dashboard.holds.map((hold) => (
                      <div key={hold.id} className="rounded-[24px] border border-[#f1e2d4] bg-[#fffaf5] p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9ca3af]">{hold.projectName}</p>
                            <h3 className="mt-2 text-lg font-black text-[#1f2a2e]">{hold.unitLabel || hold.unitId}</h3>
                            <p className="mt-1 text-sm text-[#667085]">{hold.floorType}</p>
                          </div>
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                            {timeUntil(hold.hold.expiresAt)}
                          </span>
                        </div>
                        <div className="mt-4 space-y-1 text-sm text-[#667085]">
                          <p>Hold by: <span className="font-semibold text-[#1f2a2e]">{hold.hold.byName || 'Assigned agent'}</span></p>
                          <p>Phone: <span className="font-semibold text-[#1f2a2e]">{hold.hold.byPhone || '—'}</span></p>
                          <p>Price: <span className="font-semibold text-[#1f2a2e]">{formatMoney(hold.price)}</span></p>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleReleaseHold(hold.id)}
                            className="rounded-full border border-[#eadcca] bg-white px-4 py-2 text-xs font-bold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                          >
                            Release Hold
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkSold(hold.id)}
                            className="rounded-full bg-[#1f2a2e] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2d3c40]"
                          >
                            Mark Sold
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-6 py-10 text-center md:col-span-2">
                      <Clock3 className="mx-auto h-8 w-8 text-[#eb6239]" />
                      <p className="mt-4 text-lg font-bold text-[#1f2a2e]">No active holds</p>
                      <p className="mt-2 text-sm text-[#667085]">When agents reserve your units, you can manage them here.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">Projects</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f2a2e]">Add new projects and manage existing ones</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddUnit()}
                    className="inline-flex items-center gap-2 rounded-full bg-[#eb6239] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#d95c36]"
                  >
                    <PackagePlus className="h-4 w-4" />
                    Add New Project
                  </button>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {dashboard.projects.map((project) => (
                    <div key={project.name} className="rounded-[26px] border border-[#f1e2d4] bg-[#fffaf5] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9ca3af]">Project</p>
                      <h3 className="mt-2 text-xl font-black tracking-tight text-[#1f2a2e]">{project.name}</h3>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-[18px] bg-white px-3 py-3">
                          <p className="text-lg font-black text-[#1f2a2e]">{project.totalUnits}</p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a8793]">Units</p>
                        </div>
                        <div className="rounded-[18px] bg-white px-3 py-3">
                          <p className="text-lg font-black text-emerald-600">{project.availableUnits}</p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a8793]">Available</p>
                        </div>
                        <div className="rounded-[18px] bg-white px-3 py-3">
                          <p className="text-lg font-black text-amber-600">{project.onHoldUnits}</p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a8793]">On Hold</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-[#667085]">Inventory value: <span className="font-semibold text-[#1f2a2e]">{formatMoney(project.totalValue)}</span></p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProjectFilter(project.name);
                            setActiveTab('inventory');
                          }}
                          className="rounded-full border border-[#eadcca] bg-white px-4 py-2 text-xs font-bold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                        >
                          Manage Project
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddUnit(project.name)}
                          className="rounded-full bg-[#1f2a2e] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2d3c40]"
                        >
                          Add Unit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === 'inventory' ? (
            <div className="space-y-6">
              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">My Inventory</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1f2a2e]">Builder inventory table</h1>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddUnit(projectFilter)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#eb6239] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#d95c36]"
                  >
                    <PackagePlus className="h-4 w-4" />
                    Add Unit
                  </button>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-[1fr,260px,auto]">
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(event) => setInventorySearch(event.target.value)}
                    placeholder="Search project, tower, unit or floor type"
                    className="rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                  />
                  <select
                    value={projectFilter}
                    onChange={(event) => setProjectFilter(event.target.value)}
                    className="rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                  >
                    <option value="">All projects</option>
                    {dashboard.projects.map((project) => (
                      <option key={project.name} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setInventorySearch('');
                      setProjectFilter('');
                    }}
                    className="rounded-full border border-[#eadcca] bg-white px-4 py-3 text-sm font-bold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                  >
                    Clear
                  </button>
                </div>
              </section>

              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                {filteredInventory.length > 0 ? (
                  <InventoryTable rows={filteredInventory} onEdit={handleEdit} onDelete={handleDelete} />
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-6 py-10 text-center">
                    <Home className="mx-auto h-8 w-8 text-[#eb6239]" />
                    <p className="mt-4 text-lg font-bold text-[#1f2a2e]">No matching units</p>
                    <p className="mt-2 text-sm text-[#667085]">Try a different search or clear the project filter.</p>
                  </div>
                )}
              </section>
            </div>
          ) : null}

          {activeTab === 'units' ? (
            <div className="space-y-6">
              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">Add / Edit Units</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1f2a2e]">
                      {selectedProperty ? 'Edit builder unit' : 'Add a new builder unit'}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
                      Create new units under a project, or update an existing one without leaving the builder dashboard.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPropertyId(null);
                          setProjectDraftName('');
                        }}
                        className="rounded-full border border-[#eadcca] bg-white px-4 py-2.5 text-sm font-bold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                      >
                        Switch to new unit
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPropertyId(null);
                        setProjectDraftName('');
                        setActiveTab('inventory');
                      }}
                      className="rounded-full border border-[#eadcca] bg-white px-4 py-2.5 text-sm font-bold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                    >
                      Back to inventory
                    </button>
                  </div>
                </div>

                {(selectedProperty || projectDraftName) ? (
                  <div className="mt-5 rounded-[24px] border border-[#f1e2d4] bg-[#fffaf5] px-5 py-4 text-sm text-[#667085]">
                    {selectedProperty ? (
                      <p>
                        Editing <span className="font-semibold text-[#1f2a2e]">{selectedProperty.title}</span>.
                        Any saved changes will update the live builder inventory immediately.
                      </p>
                    ) : (
                      <p>
                        New unit will be prefilled under <span className="font-semibold text-[#1f2a2e]">{projectDraftName}</span>.
                        You can still change the project name before publishing.
                      </p>
                    )}
                  </div>
                ) : null}
              </section>

              <ListPropertyForm
                user={{
                  name: dashboard.builder.name,
                  phone: dashboard.builder.phone,
                  email: dashboard.builder.email,
                }}
                mode="public"
                initialProperty={selectedProperty}
                defaultOwnerType="builder"
                lockOwnerType
                showBuilderFields
                builderDefaults={builderDefaults}
                submitLabel={selectedProperty ? 'Update Unit' : 'Publish Unit'}
                onSuccess={async () => {
                  await loadDashboard();
                  setSelectedPropertyId(null);
                  setActiveTab('inventory');
                }}
              />
            </div>
          ) : null}

          {activeTab === 'leads' ? (
            <div className="space-y-6">
              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">My Leads</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1f2a2e]">Inbound callback requests</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
                  These are the buyers who expressed interest on your public property pages.
                </p>
              </section>

              <div className="grid gap-4 md:grid-cols-2">
                {dashboard.leads.length > 0 ? (
                  dashboard.leads.map((lead) => (
                    <div key={lead.id} className="rounded-[28px] border border-[#eadcca] bg-white/90 p-5 shadow-[0_24px_70px_-46px_rgba(31,42,46,0.32)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9ca3af]">{lead.projectName}</p>
                          <h3 className="mt-2 text-xl font-black text-[#1f2a2e]">{lead.name}</h3>
                          <p className="mt-1 text-sm text-[#667085]">{lead.property_title}</p>
                        </div>
                        <span className="rounded-full border border-[#eadcca] bg-[#fffaf5] px-3 py-1 text-xs font-bold text-[#667085]">
                          {formatDate(lead.created_at)}
                        </span>
                      </div>
                      <div className="mt-5 space-y-2 text-sm text-[#667085]">
                        <p className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-[#eb6239]" /> {lead.phone}</p>
                        <p>Unit: <span className="font-semibold text-[#1f2a2e]">{lead.unitId}</span></p>
                        <p>Email: <span className="font-semibold text-[#1f2a2e]">{lead.email || 'Not shared'}</span></p>
                        <p>Assigned agent: <span className="font-semibold text-[#1f2a2e]">{lead.assignedAgentName || 'Unassigned'}</span></p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-6 py-10 text-center md:col-span-2">
                    <Users className="mx-auto h-8 w-8 text-[#eb6239]" />
                    <p className="mt-4 text-lg font-bold text-[#1f2a2e]">No leads yet</p>
                    <p className="mt-2 text-sm text-[#667085]">When buyers request callbacks on your units, they will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {activeTab === 'reports' ? (
            <div className="space-y-6">
              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">Reports</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1f2a2e]">Builder performance snapshot</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
                  Watch live inventory value, average ticket size, and project mix without leaving your dashboard.
                </p>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DashboardMetric
                  label="Live Inventory Value"
                  value={formatMoney(dashboard.reports.liveInventoryValue)}
                  helper="Unsold units currently in your pipeline."
                  icon={IndianRupee}
                  iconClassName="text-[#eb6239]"
                  iconSurfaceClassName="bg-[#fff1ea]"
                />
                <DashboardMetric
                  label="Sold Value This Month"
                  value={formatMoney(dashboard.reports.soldInventoryValueThisMonth)}
                  helper="Value of units marked sold this month."
                  icon={CheckCircle2}
                  iconClassName="text-emerald-600"
                  iconSurfaceClassName="bg-emerald-50"
                />
                <DashboardMetric
                  label="Average Ticket Size"
                  value={formatMoney(dashboard.reports.averageTicketSize)}
                  helper="Average pricing across your units."
                  icon={BarChart3}
                  iconClassName="text-amber-600"
                  iconSurfaceClassName="bg-amber-50"
                />
                <DashboardMetric
                  label="Average Area"
                  value={dashboard.reports.averageArea ? `${dashboard.reports.averageArea} sqft` : '—'}
                  helper="Average unit area across your stock."
                  icon={Home}
                  iconClassName="text-sky-600"
                  iconSurfaceClassName="bg-sky-50"
                />
              </section>

              <section className="rounded-[30px] border border-[#eadcca] bg-white/90 p-6 shadow-[0_28px_80px_-46px_rgba(31,42,46,0.32)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">Project Report</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f2a2e]">Performance by project</h2>
                  </div>
                  <div className="rounded-full border border-[#eadcca] bg-[#fffaf5] px-4 py-2 text-sm font-semibold text-[#667085]">
                    {dashboard.reports.activeProjects} active project{dashboard.reports.activeProjects === 1 ? '' : 's'}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {dashboard.projects.map((project) => (
                    <div key={project.name} className="rounded-[24px] border border-[#f1e2d4] bg-[#fffaf5] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9ca3af]">Project</p>
                      <h3 className="mt-2 text-lg font-black text-[#1f2a2e]">{project.name}</h3>
                      <div className="mt-4 space-y-2 text-sm text-[#667085]">
                        <p>Total units: <span className="font-semibold text-[#1f2a2e]">{project.totalUnits}</span></p>
                        <p>Available: <span className="font-semibold text-[#1f2a2e]">{project.availableUnits}</span></p>
                        <p>On hold: <span className="font-semibold text-[#1f2a2e]">{project.onHoldUnits}</span></p>
                        <p>Sold: <span className="font-semibold text-[#1f2a2e]">{project.soldUnits}</span></p>
                        <p>Inventory value: <span className="font-semibold text-[#1f2a2e]">{formatMoney(project.totalValue)}</span></p>
                        <p>Last updated: <span className="font-semibold text-[#1f2a2e]">{formatDate(project.latestUpdatedAt)}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}

          <div className="mt-8 flex items-center gap-2 text-sm text-[#667085]">
            <Sparkles className="h-4 w-4 text-[#eb6239]" />
            Builder inventory, holds, leads, and reporting all run on the same live property records used by the public site.
          </div>
        </div>
      </div>
    </main>
  );
}
