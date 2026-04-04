'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import {
  Plus, Trash2, Edit3, Loader2, Database, Upload, Link as LinkIcon,
  Users, Building2, LayoutDashboard, Star, Shield, Search, ChevronDown,
  TrendingUp, Home, UserCheck, AlertCircle, Eye, MoreVertical, X
} from 'lucide-react';
import Link from 'next/link';
import ListPropertyForm from '@/components/listing/ListPropertyForm';
import {
  PROPERTY_GANJ_DEFAULT_SUBDIVISION,
  PROPERTY_GANJ_SUBDIVISIONS,
  type PropertyGanjSubdivision,
  getPropertyGanjSubdivisionFromProperty,
  getPropertyGanjSubdivisionMeta,
  getPropertyTypeFromListingForm,
  isFeaturedAddressLine2,
  isPropertyGanjAddressLine2,
  makePropertyGanjAddressLine2,
} from '@/lib/property-ganj';

interface FeaturedProject {
  id: string;
  name: string;
  location: string;
  type: string;
  price: string;
  builder: string;
  image: string;
  category: 'regular' | 'pg_listing';
  subdivision: PropertyGanjSubdivision;
}

type AdminTab = 'overview' | 'inventory' | 'users' | 'featured' | 'leads' | 'analytics' | 'billing';

const DEFAULT_FEATURED_IMAGE = '/modern-apartment.jpg';

const createInitialFormData = () => ({
  name: '',
  location: '',
  type: '',
  price: '',
  builder: '',
  image: DEFAULT_FEATURED_IMAGE,
  category: 'regular' as 'regular' | 'pg_listing',
  subdivision: PROPERTY_GANJ_DEFAULT_SUBDIVISION as PropertyGanjSubdivision,
});

const parseIndianPriceInput = (value: string) => {
  const normalized = value.toLowerCase().replace(/,/g, ' ').trim();
  const numericToken = normalized.match(/\d+(?:\.\d+)?/);
  if (!numericToken) return 0;

  const numericValue = Number.parseFloat(numericToken[0]);
  if (!Number.isFinite(numericValue)) return 0;

  if (/(crore|cr)\b/.test(normalized)) return Math.round(numericValue * 10000000);
  if (/(lakh|lac)\b/.test(normalized)) return Math.round(numericValue * 100000);
  if (/\bk\b/.test(normalized)) return Math.round(numericValue * 1000);

  const digitsOnly = normalized.replace(/[^\d]/g, '');
  return Number.parseInt(digitsOnly || '0', 10);
};

const formatPriceLabel = (value?: number | null) =>
  value ? `₹${Number(value).toLocaleString('en-IN')}` : '';

export default function AdminDashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Data
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({ users: 0, agents: 0, builders: 0, properties: 0, propertiesSale: 0, propertiesRent: 0, leads: 0 });
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [leadAssignees, setLeadAssignees] = useState<Record<string, string>>({});

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('all');

  // Featured form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(createInitialFormData);

  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const agentUsers = useMemo(
    () => allUsers.filter((user: any) => user.role === 'agent'),
    [allUsers],
  );

  const refreshAdminData = async () => {
    const dashRes = await fetch('/api/admin/dashboard');
    if (!dashRes.ok) {
      const data = await dashRes.json().catch(() => ({} as any));
      throw new Error(data?.error || 'Unable to fetch admin data.');
    }

    const dash = await dashRes.json();
    const allProfiles = dash.profiles || [];
    const allProps = dash.properties || [];
    const fData = dash.featured || [];
    const interestLeadData = dash.interestLeads || [];
    const applicationData = dash.agentApplications || [];
    const uCount = allProfiles.length;
    const pCount = allProps.length;

    setProjects((fData || []).map((p: any) => {
      const isPropertyGanjListing = isPropertyGanjAddressLine2(p.address_line2);
      const subdivision = getPropertyGanjSubdivisionFromProperty({
        addressLine2: p.address_line2,
        propertyType: p.property_type,
        title: p.title,
        description: p.description,
      }) ?? PROPERTY_GANJ_DEFAULT_SUBDIVISION;

      return {
        id: p.id,
        name: p.title,
        location: p.locality || p.formatted_address || '',
        type: p.property_type || '',
        price: formatPriceLabel(p.price || p.rent),
        builder: isPropertyGanjListing ? 'PROPERTY_GANJ_LISTING' : (p.description || ''),
        image: p.provider || DEFAULT_FEATURED_IMAGE,
        category: isPropertyGanjListing ? 'pg_listing' : 'regular',
        subdivision,
      } satisfies FeaturedProject;
    }));

    setAllUsers(allProfiles);
    setAllProperties(allProps);

    const interestLeads = interestLeadData.map((lead: any) => ({
      ...lead,
      assigned_agent_id:
        lead.assigned_agent_id ||
        allProps.find((item: any) => item.id === lead.property_id)?.hold_by_user_id,
      assigned_agent_expires_at:
        lead.assigned_agent_expires_at ||
        allProps.find((item: any) => item.id === lead.property_id)?.hold_expires_at,
    }));

    const mappedAgentApplications = applicationData.map((application: any) => {
      let appData: any = {};
      try {
        appData = JSON.parse(application.company_name);
      } catch {
        appData = {};
      }

      return {
        id: application.user_id,
        kind: 'agent_application',
        agent_id: application.user_id,
        name: application.full_name || 'Prospect',
        email: application.email,
        phone: application.phone,
        status: 'agent_application',
        created_at: appData.applied_at || application.created_at,
        message: `Specialties: ${(appData.specialties || []).join(', ')}. Languages: ${(appData.languages || []).join(', ')}. Bio: ${appData.bio?.slice(0, 50)}...`,
      };
    });

    const combinedLeads = [...interestLeads, ...mappedAgentApplications].sort(
      (left: any, right: any) =>
        new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime(),
    );
    setAllLeads(combinedLeads);

    const agentCount = allProfiles.filter((user: any) => user.role === 'agent').length;
    const builderCount = allProfiles.filter((user: any) => user.role === 'builder').length;
    const saleCount = allProps.filter((property: any) => property.for_sale).length;
    const rentCount = allProps.filter((property: any) => property.for_rent).length;
    setAnalytics({
      users: uCount || 0,
      agents: agentCount,
      builders: builderCount,
      properties: pCount || 0,
      propertiesSale: saleCount,
      propertiesRent: rentCount,
      leads: combinedLeads.length,
    });

    const activities: any[] = [];
    activities.push(
      ...allProfiles.slice(0, 8).map((profile: any) => ({
        type: 'user',
        data: profile,
        time: new Date(profile.created_at).getTime(),
        action: `Registered as ${profile.role || 'user'}`,
      })),
    );
    activities.push(
      ...allProps
        .slice(0, 8)
        .filter((property: any) => !isFeaturedAddressLine2(property.address_line2) && !isPropertyGanjAddressLine2(property.address_line2))
        .map((property: any) => ({
          type: 'property',
          data: property,
          time: new Date(property.created_at).getTime(),
          action: `Posted new ${property.property_type || 'listing'}: ${property.title}`,
        })),
    );
    activities.sort((left, right) => right.time - left.time);
    setActivityFeed(activities.slice(0, 15));
  };

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
      if (profile?.role !== 'admin') { router.push('/'); return; }
      setIsAdmin(true);

      try {
        await refreshAdminData();
      } catch (error: any) {
        setIsLoading(false);
        toast({ title: 'Admin load failed', description: error?.message || 'Unable to fetch admin data.', variant: 'destructive' });
        return;
      }
      setIsLoading(false);
    };

    checkAdminAndFetchData();
  }, [router, supabase, toast]);

  // === Agent Approval ===
  const handleApproveAgent = async (lead: any) => {
    if (!lead.agent_id) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: lead.agent_id, role: 'agent', company_name: 'PropertyGanj Certified Agent' })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to approve');
      }

      toast({ title: 'Agent Approved', description: 'User upgraded to Agent status.' });
      await refreshAdminData();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleAssignLeadToAgent = async (lead: any) => {
    const agentUserId = leadAssignees[lead.id] || lead.assigned_agent_id;
    if (!agentUserId) {
      toast({ title: 'Choose an agent', description: 'Select an agent before assigning this lead.', variant: 'destructive' });
      return;
    }

    try {
      const res = await fetch('/api/admin/holds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: lead.property_id, agentUserId, holdHours: 48 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Unable to assign property to agent');
      }

      toast({ title: 'Lead assigned', description: 'The property is now routed to the selected agent.' });
      await refreshAdminData();
    } catch (error: any) {
      toast({ title: 'Assignment failed', description: error?.message || 'Please try again.', variant: 'destructive' });
    }
  };

  // === Featured Projects CRUD ===
  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPg = formData.category === 'pg_listing';
    const subdivision = isPg ? formData.subdivision : PROPERTY_GANJ_DEFAULT_SUBDIVISION;
    const payload = {
      title: formData.name,
      locality: formData.location,
      formatted_address: formData.location,
      property_type: getPropertyTypeFromListingForm(formData.category, subdivision, formData.type),
      status: 'published',
      address_line2: isPg ? makePropertyGanjAddressLine2(subdivision) : 'featured',
      description: isPg ? null : formData.builder,
      provider: formData.image,
      for_sale: true,
      price: parseIndianPriceInput(formData.price),
    };

    if (editingId) {
      const res = await fetch('/api/admin/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: editingId, payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({ title: 'Error updating', description: data?.error || 'Unable to update listing', variant: 'destructive' });
      } else {
        toast({ title: 'Updated successfully' });
        await refreshAdminData();
        resetFeaturedForm();
      }
    } else {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({ title: 'Error creating', description: data?.error || 'Unable to create listing', variant: 'destructive' });
      } else if (data?.property) {
        toast({ title: 'Created successfully' });
        await refreshAdminData();
        resetFeaturedForm();
      }
    }
  };

  const handleDeleteFeatured = async (id: string) => {
    if (!confirm('Delete this featured project?')) return;
    const res = await fetch(`/api/admin/properties?propertyId=${id}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) toast({ title: 'Error', description: data?.error || 'Unable to delete listing', variant: 'destructive' });
    else {
      toast({ title: 'Deleted' });
      await refreshAdminData();
      resetFeaturedForm();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Under 2MB please', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        toast({ title: 'Image loaded' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFeatured = (p: FeaturedProject) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      location: p.location,
      type: p.type,
      price: p.price,
      builder: p.builder === 'PROPERTY_GANJ_LISTING' ? '' : p.builder,
      image: p.image,
      category: p.category,
      subdivision: p.subdivision,
    });
  };

  const resetFeaturedForm = () => {
    setEditingId(null);
    setFormData(createInitialFormData());
  };

  // === User Management ===
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user and all their data?')) return;
    const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
    if (res.ok) {
      toast({ title: 'User deleted' });
      setAllUsers(allUsers.filter(u => u.user_id !== userId));
      setAllProperties(allProperties.filter(p => p.owner_user_id !== userId));
    } else {
      const data = await res.json();
      toast({ title: 'Error', description: data.error, variant: 'destructive' });
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole })
    });
    if (res.ok) {
      toast({ title: 'Role updated' });
      setAllUsers(allUsers.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    } else {
      toast({ title: 'Error updating role', variant: 'destructive' });
    }
  };

  // === Property Management ===
  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Delete this property?')) return;
    const res = await fetch(`/api/admin/properties?propertyId=${propertyId}`, { method: 'DELETE' });
    if (res.ok) {
      toast({ title: 'Property deleted' });
      setAllProperties(allProperties.filter(p => p.id !== propertyId));
    } else {
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  const handleChangePropertyStatus = async (propertyId: string, status: string) => {
    const res = await fetch('/api/admin/properties', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, status })
    });
    if (res.ok) {
      toast({ title: 'Status updated' });
      setAllProperties(allProperties.map(p => p.id === propertyId ? { ...p, status } : p));
    } else {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  // Filtered data
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = (u.full_name || u.email || '').toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredProperties = allProperties.filter(p => {
    const matchesSearch = (p.title || p.locality || '').toLowerCase().includes(propertySearch.toLowerCase());
    const matchesStatus = propertyStatusFilter === 'all' || p.status === propertyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const featuredProjects = projects.filter((project) => project.category === 'regular');
  const propertyGanjProjects = projects.filter((project) => project.category === 'pg_listing');
  const propertyGanjBreakdown = PROPERTY_GANJ_SUBDIVISIONS
    .map((section) => ({ ...section, count: propertyGanjProjects.filter((project) => project.subdivision === section.id).length }))
    .filter((section) => section.count > 0);
  const activeListingCount = allProperties.filter((property: any) => property.status !== 'sold').length;
  const selectedPgProperty =
    formData.category === 'pg_listing' && editingId
      ? allProperties.find((property: any) => property.id === editingId) || null
      : null;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary w-10 h-10 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">Loading admin panel...</p>
      </div>
    </div>
  );
  if (!isAdmin) return null;

  const tabs: { id: AdminTab, label: string, icon: any, count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Live Inventory', icon: Building2, count: allProperties.length },
    { id: 'users', label: 'Users & Roles', icon: Users, count: allUsers.length },
    { id: 'featured', label: 'Featured & PG', icon: Star, count: projects.length },
    { id: 'leads', label: 'Leads & CRM', icon: AlertCircle, count: allLeads.length },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'billing', label: 'Billing', icon: Database },
  ];

  const dashboardMeta: Record<AdminTab, { title: string; description: string }> = {
    overview: {
      title: 'Operations Command Center',
      description: 'Track platform health, listing activity, and critical actions from one high-signal dashboard.',
    },
    inventory: {
      title: 'Inventory Control',
      description: 'Moderate live supply, inspect status changes, and release holds before they block revenue.',
    },
    users: {
      title: 'User Administration',
      description: 'Manage builders, agents, and customer accounts without leaving the admin workflow.',
    },
    featured: {
      title: 'Curated Placement Studio',
      description: 'Place featured projects and Property Ganj inventory into the exact subdivision shown on the landing page.',
    },
    leads: {
      title: 'Lead Desk',
      description: 'Keep inbound interest visible so approvals and follow-ups do not get stuck in queue.',
    },
    analytics: {
      title: 'Performance Analytics',
      description: 'Review top-level platform trends while the deeper reporting layer is still being built out.',
    },
    billing: {
      title: 'Billing Workspace',
      description: 'Reserved for monetization, invoices, and premium placement controls.',
    },
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const activeDashboardMeta = dashboardMeta[activeTab];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#fffdf8_46%,#f6efe8_100%)]">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">

        {/* Sidebar */}
        <aside className="hidden md:flex sticky top-16 h-[calc(100vh-64px)] w-72 shrink-0 flex-col border-r border-[#efd9c8] bg-[linear-gradient(180deg,#fff8f0_0%,#fff2e5_100%)] px-4 pb-6 pt-6 text-[#1f2a2e] shadow-[24px_0_80px_-56px_rgba(126,85,44,0.35)]">
          <div className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_80px_-56px_rgba(126,85,44,0.35)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-300 to-orange-300 p-3 text-slate-950 shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b6a53]">Property Ganj</p>
                <h2 className="text-xl font-black tracking-tight">Admin Console</h2>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border border-[#f2dfcf] bg-[#fff7f1] px-3 py-3">
                <p className="text-[11px] font-medium text-[#8b6a53]">Live listings</p>
                <p className="mt-1 text-2xl font-black">{activeListingCount}</p>
              </div>
              <div className="rounded-2xl border border-[#f2dfcf] bg-[#fff7f1] px-3 py-3">
                <p className="text-[11px] font-medium text-[#8b6a53]">Curated</p>
                <p className="mt-1 text-2xl font-black">{projects.length}</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-2 flex-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-[#eb6239]/35 bg-white text-[#1f2a2e] shadow-[0_20px_40px_-30px_rgba(235,98,57,0.5)]'
                    : 'border-[#f0ddcc] bg-white/70 text-[#6b7280] hover:border-[#eb6239]/30 hover:bg-white hover:text-[#1f2a2e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                      activeTab === tab.id ? 'bg-[#1f2a2e] text-white' : 'bg-[#f7ede4] text-[#8b6a53]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-[#f0ddcc] bg-white/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8b6a53]">Active tab</p>
              <p className="mt-2 text-lg font-bold text-[#1f2a2e]">{activeDashboardMeta.title}</p>
              <p className="mt-1 text-sm leading-6 text-[#6b7280]">{activeDashboardMeta.description}</p>
            </div>
            <Link href="/" className="flex items-center justify-between rounded-2xl border border-[#f0ddcc] bg-white/80 px-4 py-3 text-sm font-semibold text-[#1f2a2e] transition hover:border-[#eb6239]/30 hover:bg-white">
              <span>Back to site</span>
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-3 left-3 right-3 z-50 rounded-[28px] border border-slate-200 bg-white/95 p-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="grid grid-cols-4 gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl px-2 py-2 text-[10px] font-bold transition ${
                  activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-slate-500'
                }`}
              >
                <tab.icon className="mx-auto mb-1 h-4 w-4" />
                {tab.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-10 lg:p-10">
          <div className="mx-auto max-w-7xl space-y-8">
            <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="grid gap-0 lg:grid-cols-[1.45fr,0.95fr]">
                <div className="bg-[linear-gradient(135deg,#fff1df_0%,#fff9ef_48%,#eef6ef_100%)] px-6 py-7 text-[#1f2a2e] md:px-8 md:py-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8b6a53]">Admin workspace</p>
                  <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">{activeDashboardMeta.title}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f6b70] md:text-base">{activeDashboardMeta.description}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab('featured')} className="rounded-2xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">Manage curated listings</button>
                    <button onClick={() => setActiveTab('inventory')} className="rounded-2xl border border-[#1f2a2e]/10 bg-white/80 px-4 py-2 text-sm font-bold text-[#1f2a2e] transition hover:bg-white">Open inventory</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 p-6 md:p-8">
                  {[
                    { label: 'Live listings', value: activeListingCount, tone: 'from-emerald-500/15 to-emerald-100' },
                    { label: 'Curated entries', value: projects.length, tone: 'from-orange-500/15 to-orange-100' },
                    { label: 'Registered users', value: analytics.users, tone: 'from-sky-500/15 to-sky-100' },
                    { label: 'Open leads', value: allLeads.length, tone: 'from-violet-500/15 to-violet-100' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-[24px] border border-slate-200 bg-gradient-to-br ${item.tone} px-4 py-4 shadow-sm`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          {/* ==================== OVERVIEW TAB ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-1">Welcome back, Admin. Here's what's happening.</p>
              </div>

              {/* Inventory + operations cards */}
              {(() => {
                const now = Date.now();
                const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
                const activeHolds = allProperties.filter((p: any) => {
                  const exp = p.hold_expires_at ? new Date(p.hold_expires_at).getTime() : 0;
                  return !!p.hold_by_user_id && exp > now;
                });
                const soldMtd = allProperties.filter((p: any) => {
                  const ts = p.updated_at ? new Date(p.updated_at).getTime() : (p.created_at ? new Date(p.created_at).getTime() : 0);
                  return (p.status === 'sold') && ts >= monthStart;
                });
                const available = allProperties.filter((p: any) => {
                  const exp = p.hold_expires_at ? new Date(p.hold_expires_at).getTime() : 0;
                  const onHold = !!p.hold_by_user_id && exp > now;
                  return p.status !== 'sold' && !onHold;
                });

                return (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Inventory Available', value: available.length, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Not on hold · Not sold' },
                        { label: 'Inventory On Hold', value: activeHolds.length, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Active holds' },
                        { label: 'Sold (This Month)', value: soldMtd.length, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Status = sold' },
                        { label: 'Total Users', value: analytics.users, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', sub: `${analytics.agents} agents · ${analytics.builders} builders` },
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-border flex items-center justify-between">
                          <div>
                            <h2 className="text-lg font-bold text-foreground">Live Inventory</h2>
                            <p className="text-xs text-muted-foreground mt-1">All units · Available / On Hold / Sold</p>
                          </div>
                          <button
                            onClick={() => setActiveTab('inventory')}
                            className="text-xs font-bold bg-primary/10 text-primary px-3 py-2 rounded-xl hover:bg-primary/15 transition"
                          >
                            Open full table →
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/30 border-b border-border">
                              <tr>
                                <th className="text-left p-4 font-semibold text-muted-foreground">Property</th>
                                <th className="text-left p-4 font-semibold text-muted-foreground">City</th>
                                <th className="text-left p-4 font-semibold text-muted-foreground">Type</th>
                                <th className="text-left p-4 font-semibold text-muted-foreground">Price</th>
                                <th className="text-left p-4 font-semibold text-muted-foreground">Hold</th>
                                <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allProperties.slice(0, 8).map((p: any) => {
                                const exp = p.hold_expires_at ? new Date(p.hold_expires_at).getTime() : 0;
                                const onHold = !!p.hold_by_user_id && exp > now;
                                return (
                                  <tr key={p.id} className="border-b border-border/30 hover:bg-accent/5 transition">
                                    <td className="p-4">
                                      <p className="font-semibold text-foreground truncate max-w-[260px]">{p.title || '—'}</p>
                                      <p className="text-xs text-muted-foreground">ID: {p.pg_id || String(p.id).slice(0, 8).toUpperCase()}</p>
                                    </td>
                                    <td className="p-4 text-muted-foreground text-xs">{p.city || p.locality || '—'}</td>
                                    <td className="p-4 text-muted-foreground capitalize">{p.property_type || '—'}</td>
                                    <td className="p-4 font-semibold text-foreground">
                                      {p.price ? `₹${Number(p.price).toLocaleString('en-IN')}` : p.rent ? `₹${Number(p.rent).toLocaleString('en-IN')}/mo` : '—'}
                                    </td>
                                    <td className="p-4">
                                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${onHold ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-muted text-muted-foreground border-border'}`}>
                                        {onHold ? 'On hold' : '—'}
                                      </span>
                                    </td>
                                    <td className="p-4">
                                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                                        p.status === 'sold' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                        'bg-emerald-100 text-emerald-700 border-emerald-200'
                                      }`}>
                                        {p.status || 'published'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                          <div className="p-5 border-b border-border">
                            <h2 className="text-lg font-bold text-foreground">Active Holds</h2>
                            <p className="text-xs text-muted-foreground mt-1">Admin can override a hold.</p>
                          </div>
                          <div className="p-5 space-y-3">
                            {activeHolds.slice(0, 6).map((p: any) => (
                              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/20">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-foreground truncate">{p.title || '—'}</p>
                                  <p className="text-xs text-muted-foreground">Expires: {p.hold_expires_at ? new Date(p.hold_expires_at).toLocaleString() : '—'}</p>
                                </div>
                                <button
                                  onClick={async () => {
                                    if (!confirm('Override and release this hold?')) return;
                                    const res = await fetch('/api/admin/holds', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ propertyId: p.id }),
                                    });
                                    if (res.ok) {
                                      toast({ title: 'Hold released', description: 'Override applied.' });
                                      await refreshAdminData();
                                    } else {
                                      const data = await res.json().catch(() => ({}));
                                      toast({ title: 'Override failed', description: data?.error || 'Try again.', variant: 'destructive' });
                                    }
                                  }}
                                  className="text-xs font-bold px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition"
                                >
                                  Override
                                </button>
                              </div>
                            ))}
                            {activeHolds.length === 0 && <p className="text-sm text-muted-foreground">No active holds.</p>}
                          </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                          <div className="p-5 border-b border-border">
                            <h2 className="text-lg font-bold text-foreground">Agent Performance</h2>
                            <p className="text-xs text-muted-foreground mt-1">Based on active holds (for now).</p>
                          </div>
                          <div className="p-5 space-y-3">
                            {(() => {
                              const byAgent: Record<string, number> = {};
                              activeHolds.forEach((p: any) => {
                                const id = p.hold_by_user_id;
                                if (!id) return;
                                byAgent[id] = (byAgent[id] || 0) + 1;
                              });
                              const nameById = new Map<string, string>();
                              allUsers.forEach((u: any) => {
                                if (u.user_id) nameById.set(u.user_id, u.full_name || u.email || u.user_id);
                              });
                              const rows = Object.entries(byAgent)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 6)
                                .map(([id, count]) => ({ id, name: nameById.get(id) || id, count }));

                              if (rows.length === 0) return <p className="text-sm text-muted-foreground">No agent holds yet.</p>;
                              return rows.map(r => (
                                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20">
                                  <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                                  <span className="text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">
                                    {r.count} holds
                                  </span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Add Featured Project', icon: Plus, action: () => setActiveTab('featured') },
                  { label: 'Manage Users', icon: Users, action: () => setActiveTab('users') },
                  { label: 'View Inventory', icon: Building2, action: () => setActiveTab('inventory') },
                  { label: 'View Leads/CRM', icon: AlertCircle, action: () => setActiveTab('leads') },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} className="bg-card border border-border rounded-xl p-4 text-left hover:bg-accent/10 transition group">
                    <item.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  </button>
                ))}
              </div>

              {/* Activity Feed */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h2 className="text-lg font-bold text-foreground">Live Platform Activity</h2>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {activityFeed.map((act, idx) => (
                    <Link href={act.type === 'property' ? `/property/${act.data.id}` : '#'} key={idx} className="block group">
                      <div className="flex gap-3 text-sm items-start p-4 hover:bg-accent/5 transition border-b border-border/30 last:border-0">
                        <div className="mt-0.5">
                          {act.type === 'user'
                            ? <span className="bg-green-100 text-green-700 px-2 rounded-full text-[10px] font-bold py-1">USER</span>
                            : <span className="bg-blue-100 text-blue-700 px-2 rounded-full text-[10px] font-bold py-1">LISTING</span>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-semibold group-hover:text-primary transition-colors truncate">
                            {act.type === 'user' ? act.data.full_name || act.data.email : act.data.title}
                          </p>
                          <p className="text-muted-foreground text-xs truncate">{act.action}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-muted/50 px-2 py-0.5 rounded-full">
                          {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </Link>
                  ))}
                  {activityFeed.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">No recent activity.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ==================== USERS TAB ==================== */}
          {activeTab === 'users' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Users & Roles</h1>
                <p className="text-muted-foreground mt-1">Manage all registered users, agents, and builders.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text" placeholder="Search by name or email..."
                    value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <select
                  value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="agent">Agents</option>
                  <option value="builder">Builders</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold text-muted-foreground">User</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Phone</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">City</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Role</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Joined</th>
                        <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.user_id || user.id} className="border-b border-border/30 hover:bg-accent/5 transition">
                          <td className="p-4">
                            {user.role === 'agent' ? (
                              <Link href={`/agent/${user.user_id}`} className="hover:text-primary transition-colors">
                                <p className="font-semibold text-foreground hover:underline">{user.full_name || '—'}</p>
                                {user.company_name && <p className="text-xs text-muted-foreground">{user.company_name}</p>}
                                <p className="text-xs text-muted-foreground">{user.email || '—'}</p>
                              </Link>
                            ) : (
                              <>
                                <p className="font-semibold text-foreground">{user.full_name || '—'}</p>
                                <p className="text-xs text-muted-foreground">{user.email || '—'}</p>
                              </>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground">{user.phone || '—'}</td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {user.city ? user.city.split(',').map((c: string) => c.trim()).join(', ') : '—'}
                          </td>
                          <td className="p-4">
                            <select
                              value={user.role || 'user'}
                              onChange={e => handleChangeRole(user.user_id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${
                                user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                user.role === 'agent' ? 'bg-blue-100 text-blue-700' :
                                user.role === 'builder' ? 'bg-amber-100 text-amber-700' :
                                'bg-green-100 text-green-700'
                              }`}
                            >
                              <option value="user">User</option>
                              <option value="agent">Agent</option>
                              <option value="builder">Builder</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">{user.created_at ? formatDate(user.created_at) : '—'}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.user_id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No users found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== PROPERTIES TAB ==================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Live Inventory</h1>
                <p className="text-muted-foreground mt-1">View, manage, and moderate all listed properties (including hold state).</p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text" placeholder="Search by title or locality..."
                    value={propertySearch} onChange={e => setPropertySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <select
                  value={propertyStatusFilter} onChange={e => setPropertyStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              {/* Properties Table */}
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Property</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Type</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Price</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Location</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Hold</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                        <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.map((prop) => (
                        <tr key={prop.id} className="border-b border-border/30 hover:bg-accent/5 transition">
                          <td className="p-4">
                            <p className="font-semibold text-foreground truncate max-w-[200px]">{prop.title || '—'}</p>
                            <p className="text-xs text-muted-foreground">{prop.for_rent ? 'Rent' : 'Sale'}</p>
                          </td>
                          <td className="p-4 text-muted-foreground capitalize">{prop.property_type || '—'}</td>
                          <td className="p-4 font-semibold text-foreground">
                            {prop.price ? `₹${Number(prop.price).toLocaleString('en-IN')}` : prop.rent ? `₹${Number(prop.rent).toLocaleString('en-IN')}/mo` : '—'}
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">{prop.locality || prop.city || '—'}</td>
                          <td className="p-4">
                            {(() => {
                              const exp = prop.hold_expires_at ? new Date(prop.hold_expires_at).getTime() : 0;
                              const onHold = !!prop.hold_by_user_id && exp > Date.now();
                              return (
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                                  onHold ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-muted text-muted-foreground border-border'
                                }`}>
                                  {onHold ? 'On hold' : '—'}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="p-4">
                            <select
                              value={prop.status || 'published'}
                              onChange={e => handleChangePropertyStatus(prop.id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${
                                prop.status === 'published' ? 'bg-green-100 text-green-700' :
                                prop.status === 'sold' ? 'bg-amber-100 text-amber-700' :
                                prop.status === 'archived' ? 'bg-gray-100 text-gray-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                              <option value="archived">Archived</option>
                              <option value="sold">Sold</option>
                            </select>
                          </td>
                          <td className="p-4 text-right flex gap-1 justify-end">
                            <Link href={`/property/${prop.id}`} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition" title="View">
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProperty(prop.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition" title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredProperties.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No properties found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== FEATURED TAB ==================== */}
          {activeTab === 'featured' && (
            <div className="space-y-6 max-w-6xl">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-[0_28px_70px_-38px_rgba(15,23,42,0.28)]">
                <div className="grid gap-6 p-6 md:grid-cols-[1.15fr,0.85fr] md:p-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Curated placement control</p>
                    <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Featured & Property Ganj Listings</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Use the category toggle and subdivision dropdown to decide exactly where curated entries surface on the landing page. Featured projects stay in the featured strip. Property Ganj listings can now be routed to PG, flats, villa, plot, office, shop, or commercial land sections.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Featured', value: featuredProjects.length },
                      { label: 'PG inventory', value: propertyGanjProjects.length },
                      { label: 'Live curated', value: projects.length },
                    ].map((card) => (
                      <div key={card.label} className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                        <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{card.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {propertyGanjBreakdown.length > 0 && (
                  <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-4 md:px-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Live subdivision mix</span>
                      {propertyGanjBreakdown.map((section) => (
                        <span key={section.id} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {section.label} · {section.count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px,minmax(0,1fr)]">
                {/* Form */}
                <div className="h-fit rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_28px_70px_-38px_rgba(15,23,42,0.28)] lg:sticky lg:top-24">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Placement form</p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{editingId ? 'Edit listing placement' : 'Add curated listing'}</h2>
                    </div>
                    <div className="rounded-2xl bg-[#1f2a2e] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                      {formData.category === 'pg_listing' ? 'Property Ganj' : 'Featured'}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-800">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as 'regular' | 'pg_listing' })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                      >
                        <option value="regular">Featured Project</option>
                        <option value="pg_listing">Property Ganj Listing</option>
                      </select>
                    </div>

                    {formData.category === 'pg_listing' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">Landing page subdivision</label>
                          <select
                            value={formData.subdivision}
                            onChange={e => setFormData({ ...formData, subdivision: e.target.value as PropertyGanjSubdivision })}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                          >
                            {PROPERTY_GANJ_SUBDIVISIONS.map((section) => (
                              <option key={section.id} value={section.id}>{section.label}</option>
                            ))}
                          </select>
                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            {getPropertyGanjSubdivisionMeta(formData.subdivision).description}
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                          Property Ganj listings now use the full property composer below so the detail page has complete pricing, specs, location, media, and private seller-contact data.
                        </div>
                        <ListPropertyForm
                          user={null}
                          mode="admin"
                          initialProperty={selectedPgProperty}
                          defaultSubdivision={formData.subdivision}
                          submitLabel={editingId ? 'Update Property Ganj Listing' : 'Publish Property Ganj Listing'}
                          onSuccess={async () => {
                            await refreshAdminData();
                            resetFeaturedForm();
                          }}
                        />
                      </div>
                    ) : (
                      <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">Name</label>
                          <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white" placeholder="E.g. Kalyan Garden View" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">Location</label>
                          <input required type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white" placeholder="E.g. Indira Nagar, Lucknow" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">Type label</label>
                          <input required type="text" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white" placeholder="E.g. 3 BHK Flats" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">Price label</label>
                          <input required type="text" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white" placeholder="E.g. ₹80.3 Lac onwards" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-800">Builder / owner</label>
                          <input required type="text" value={formData.builder} onChange={e => setFormData({ ...formData, builder: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white" placeholder="E.g. Krishna Colonisers" />
                        </div>
                        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
                          <label className="mb-2 block text-sm font-semibold text-slate-800">Image</label>
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#1f2a2e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2d3c40]">
                            <Upload className="h-4 w-4" /> Upload image
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                          <p className="mt-3 text-xs leading-5 text-slate-500">Use a square or landscape cover. Data URLs work too for quick admin curation.</p>
                          {formData.image.length > 50 && <span className="mt-2 block text-xs font-bold text-emerald-600">Image attached</span>}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1f2a2e] py-3 text-sm font-bold text-white transition hover:bg-[#2d3c40]">
                            {editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            {editingId ? 'Update placement' : 'Publish listing'}
                          </button>
                          {editingId && (
                            <button type="button" onClick={resetFeaturedForm} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-950">Live curated inventory</h2>
                      <p className="mt-1 text-sm text-slate-500">Each card shows where it lands on the homepage and what section it is feeding.</p>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">{projects.length} total</div>
                  </div>
                  {projects.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
                      <Star className="mx-auto mb-4 h-10 w-10 opacity-40" />
                      <p className="text-lg font-bold text-slate-900">No curated listings yet</p>
                      <p className="mt-2 text-sm">Create your first featured project or Property Ganj listing from the placement form.</p>
                    </div>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                      {projects.map((project) => {
                        const placement = getPropertyGanjSubdivisionMeta(project.subdivision);
                        const isPropertyGanj = project.category === 'pg_listing';

                        return (
                          <div key={project.id} className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_32px_70px_-34px_rgba(15,23,42,0.3)]">
                            <div className="relative h-44 overflow-hidden">
                              <img src={project.image} alt={project.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                                <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                                  isPropertyGanj ? 'bg-white text-slate-950' : 'bg-orange-500 text-white'
                                }`}>
                                  {isPropertyGanj ? 'Property Ganj' : 'Featured'}
                                </span>
                                {isPropertyGanj && (
                                  <span className="rounded-full bg-emerald-300 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-950">
                                    {placement.label}
                                  </span>
                                )}
                              </div>
                              <div className="absolute inset-x-4 bottom-4 text-white">
                                <h3 className="text-xl font-black tracking-tight">{project.name}</h3>
                                <p className="mt-1 text-sm text-white/80">{project.location}</p>
                              </div>
                            </div>
                            <div className="space-y-4 p-5">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Placement</p>
                                  <p className="mt-1 text-sm font-bold text-slate-900">{isPropertyGanj ? placement.label : 'Featured projects strip'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-black tracking-tight text-slate-950">{project.price || 'Price hidden'}</p>
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{project.type}</p>
                                </div>
                              </div>
                              <div className="rounded-[22px] bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                                {isPropertyGanj
                                  ? placement.description
                                  : (project.builder || 'Curated featured project visible under the featured projects section.')}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEditFeatured(project)} className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
                                  <span className="inline-flex items-center gap-2"><Edit3 className="h-4 w-4" /> Edit</span>
                                </button>
                                <button onClick={() => handleDeleteFeatured(project.id)} className="flex-1 rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100">
                                  <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== LEADS TAB ==================== */}
          {activeTab === 'leads' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Leads & Inquiries</h1>
                <p className="text-muted-foreground mt-1">Interest requests from listing pages and inbound agent applications show up here.</p>
              </div>

              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {allLeads.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No leads yet</p>
                    <p className="text-sm">Buyer interest requests and agent applications will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30 border-b border-border">
                        <tr>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Contact</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Message</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Property</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Date</th>
                          <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allLeads.map((lead: any) => (
                          <tr key={lead.id} className="border-b border-border/30 hover:bg-accent/5 transition">
                            <td className="p-4">
                              <p className="font-semibold text-foreground">{lead.name || '—'}</p>
                              <p className="text-xs text-muted-foreground">{lead.phone || lead.email || '—'}</p>
                              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                {lead.kind === 'interest' ? 'Buyer interest' : 'Agent application'}
                              </p>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs max-w-[200px] truncate">{lead.message || '—'}</td>
                            <td className="p-4">
                              {lead.property_id ? (
                                <div className="space-y-1">
                                  <Link href={`/property/${lead.property_id}`} className="text-primary text-xs font-semibold hover:underline">
                                    {lead.property_title || 'View Property'}
                                  </Link>
                                  {lead.assigned_agent_id ? (
                                    <p className="text-[11px] text-muted-foreground">
                                      Assigned to {allUsers.find((user: any) => user.user_id === lead.assigned_agent_id)?.full_name || 'agent'}
                                    </p>
                                  ) : null}
                                </div>
                              ) : lead.status === 'agent_application' || lead.status === 'approved_agent' ? (
                                <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Application</span>
                              ) : '—'}
                            </td>
                            <td className="p-4 text-xs text-muted-foreground">{lead.created_at ? formatDate(lead.created_at) : '—'}</td>
                            <td className="p-4 text-right">
                              {lead.kind === 'interest' ? (
                                <div className="flex flex-col items-end gap-2">
                                  <select
                                    value={leadAssignees[lead.id] || lead.assigned_agent_id || ''}
                                    onChange={(event) =>
                                      setLeadAssignees((prev) => ({ ...prev, [lead.id]: event.target.value }))
                                    }
                                    className="min-w-[180px] rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none"
                                  >
                                    <option value="">Assign to agent</option>
                                    {agentUsers.map((agent: any) => (
                                      <option key={agent.user_id} value={agent.user_id}>
                                        {agent.full_name || agent.email || agent.user_id}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => handleAssignLeadToAgent(lead)}
                                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-primary/90"
                                  >
                                    {lead.assigned_agent_id ? 'Reassign' : 'Assign'}
                                  </button>
                                </div>
                              ) : lead.status === 'agent_application' ? (
                                <button
                                  onClick={() => handleApproveAgent(lead)}
                                  className="text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                >
                                  Approve
                                </button>
                              ) : lead.status === 'approved_agent' ? (
                                <span className="text-green-600 text-xs font-semibold bg-green-100 px-3 py-1.5 rounded-lg border border-green-200">Approved</span>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== ANALYTICS TAB ==================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">High-level metrics (events tracking integration can be expanded next).</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Properties', value: analytics.properties, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', sub: `${analytics.propertiesSale} sale · ${analytics.propertiesRent} rent` },
                  { label: 'Total Users', value: analytics.users, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: `${analytics.agents} agents · ${analytics.builders} builders` },
                  { label: 'Featured Listings', value: projects.length, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Featured & PG' },
                  { label: 'Applications', value: analytics.leads, icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Agent applications' },
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
            </div>
          )}

          {/* ==================== BILLING TAB ==================== */}
          {activeTab === 'billing' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Billing</h1>
                <p className="text-muted-foreground mt-1">Billing UI will be connected once payment records/subscriptions exist.</p>
              </div>
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <p className="text-sm text-muted-foreground">No billing records configured yet.</p>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>
    </main>
  );
}
