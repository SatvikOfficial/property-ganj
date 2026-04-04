"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Home, 
  PlusSquare, 
  Users, 
  Settings,
  ChevronRight, 
  AlertCircle,
  Building,
  Clock
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import './dashboard-theme.css';

interface NavItem {
  name: string;
  icon: any;
  count?: number;
}

interface InventoryItem {
  id: string;
  dbId?: string;
  projectName?: string;
  floor: string;
  type: string;
  area: string;
  price: string;
  status: 'Available' | 'On Hold' | 'Sold';
  holdBy?: { name: string; userId?: string; timeLeft?: string };
  holdExpiryTime?: number; // timestamp for 48-hour logic
  actions: string[];
}

// Initial Data with actual property numbers
const initialInventoryData: InventoryItem[] = [
  { id: 'U-101', floor: '4th', type: '3 BHK Flat', area: '1420 sqft', price: '₹1.2 Cr', status: 'Available', actions: ['Hold', 'Mark Sold'] },
  { 
    id: 'U-102', floor: '6th', type: '4 BHK Flat', area: '1820 sqft', price: '₹1.6 Cr', 
    status: 'On Hold', 
    holdBy: { name: 'Arvind Sharma (PGS-042)' }, 
    holdExpiryTime: Date.now() + (18 * 60 * 60 * 1000) + (22 * 60 * 1000), // ~18h 22m remaining
    actions: ['Release', 'Mark Sold'] 
  },
  { id: 'U-103', floor: '2nd', type: '2 BHK Flat', area: '980 sqft', price: '₹72 L', status: 'Sold', actions: ['Archive'] },
  { id: 'U-104', floor: '5th', type: '3 BHK Flat', area: '1540 sqft', price: '₹1.1 Cr', status: 'Available', actions: ['Hold', 'Mark Sold'] },
  { id: 'U-105', floor: '3rd', type: '2 BHK Flat', area: '1100 sqft', price: '₹88 L', status: 'Available', actions: ['Hold', 'Mark Sold'] },
  { id: 'U-106', floor: '7th', type: '4 BHK Penthouse', area: '2200 sqft', price: '₹2.0 Cr', status: 'Available', actions: ['Hold', 'Mark Sold'] },
  { id: 'U-107', floor: '1st', type: 'Office Space', area: '800 sqft', price: '₹65 L', status: 'Available', actions: ['Hold', 'Mark Sold'] }
];

const BuilderDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Ticker for real-time updates (triggering re-renders for the timers to change dynamically)
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [builderInfo, setBuilderInfo] = useState({
    userId: "",
    name: "Loading...",
    shortName: "--",
    type: "Premium Builder",
    badge: "BUILDER"
  });

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties/my-ads');
      const data = await response.json();
      if (data.properties) {
        const mapped: InventoryItem[] = data.properties.map((p: any) => {
          const status = p.status === 'sold' ? 'Sold' : (p.hold?.expiresAt && new Date(p.hold.expiresAt).getTime() > Date.now()) ? 'On Hold' : 'Available';
          
          let actions = ['Hold', 'Mark Sold'];
          if (status === 'On Hold') actions = ['Release', 'Mark Sold'];
          if (status === 'Sold') actions = ['Archive'];

          return {
            id: p.listingId || p._id.substring(0, 8),
            dbId: p._id,
            projectName: p.builder?.projectName || '',
            floor: p.specs?.floorNo ? `${p.specs.floorNo}th` : '--',
            type: p.propertyType,
            area: `${p.specs?.carpetArea || p.specs?.builtUpArea || '--'} ${p.specs?.areaUnit || 'sqft'}`,
            price: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.price),
            status,
            holdBy: p.hold?.byUserId ? { name: 'Agent', userId: p.hold.byUserId } : undefined,
            holdExpiryTime: p.hold?.expiresAt ? new Date(p.hold.expiresAt).getTime() : undefined,
            actions
          };
        });
        setInventoryData(mapped);
      }
    } catch (err) {
      console.error('Error fetching properties', err);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('propertyGanj_inventory');
    if (saved) {
      try {
        setInventoryData(JSON.parse(saved));
      } catch (e) {
        setInventoryData(initialInventoryData);
      }
    } else {
      setInventoryData(initialInventoryData);
    }
    setIsLoaded(true);

    // Fetch user profile for dynamic name
    async function loadBuilderProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
          if (profile) {
            const name = profile.company_name || profile.full_name || 'Builder Profile';
            const shortName = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'BP';
            setBuilderInfo({
              userId: user.id,
              name,
              shortName,
              type: "Premium Builder",
              badge: "BUILDER"
            });
          } else {
            setBuilderInfo({
              userId: user.id,
              name: "Generic Builder",
              shortName: "GB",
              type: "Premium Builder",
              badge: "BUILDER"
            });
          }
          // After getting user, fetch properties
          fetchProperties();
        } else {
          setBuilderInfo({
             userId: "",
             name: "Godrej Properties",
             shortName: "GP",
             type: "Premium Builder",
             badge: "BUILDER"
          });
          setInventoryData(initialInventoryData);
        }
      } catch (err) {
        console.error('Error fetching builder profile', err);
      }
    }
    loadBuilderProfile();
    setIsLoaded(true);
  }, []);

  // Sync state to localStorage only as fallback - we rely on API now
  useEffect(() => {
    if (isLoaded && inventoryData.length > 0) {
      localStorage.setItem('propertyGanj_inventory', JSON.stringify(inventoryData));
    }
  }, [inventoryData, isLoaded]);

  // 1-minute global timer interval for hold expiries and countdown updates
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      // Auto-expire holds logic!
      setInventoryData(prev => {
        let changed = false;
        const nextData = prev.map(item => {
          if (item.status === 'On Hold' && item.holdExpiryTime && now >= item.holdExpiryTime) {
            changed = true;
            return {
              ...item,
              status: 'Available',
              holdBy: undefined,
              holdExpiryTime: undefined,
              actions: ['Hold', 'Mark Sold']
            } as InventoryItem;
          }
          return item;
        });
        return changed ? nextData : prev;
      });
      
    }, 60000); // Trigger every 1 minute
    
    return () => clearInterval(timer);
  }, []);

  // Time formatting helpers for the UI components
  const getRemainingTimeStr = (expiryTime?: number) => {
    if (!expiryTime) return '0h 0m';
    const diff = expiryTime - currentTime;
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining - Auto-releases if not sold`;
  };

  const getShortRemainingTimeStr = (expiryTime?: number) => {
    if (!expiryTime) return '0h';
    const diff = expiryTime - currentTime;
    if (diff <= 0) return '0h';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h`;
  };

  // Functional action handler attached to the buttons
  const handleAction = async (action: string, id: string) => {
    // Find the item to get its dbId
    const item = inventoryData.find(i => i.id === id);
    if (!item || !item.dbId) {
       console.error("No database ID found for item", id);
       return;
    }

    let apiAction = '';
    if (action === 'Hold') apiAction = 'set_hold';
    else if (action === 'Release') apiAction = 'release_hold';
    else if (action === 'Mark Sold') apiAction = 'mark_sold';

    if (apiAction) {
      try {
        const response = await fetch(`/api/properties/${item.dbId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: apiAction })
        });
        if (response.ok) {
          fetchProperties(); // Refresh from DB
        } else {
          const error = await response.json();
          alert(`Error: ${error.error || 'Failed to update property'}`);
        }
      } catch (err) {
        console.error("Action failed", err);
      }
    }
  };

  // --- KPI CALCULATIONS dynamically drawn right from State Arrays ---
  const totalUnits = inventoryData.length;
  const availableUnits = inventoryData.filter(i => i.status === 'Available').length;
  const onHoldUnits = inventoryData.filter(i => i.status === 'On Hold').length;
  const soldUnits = inventoryData.filter(i => i.status === 'Sold').length;

  const inventoryHealth = {
    availablePct: totalUnits > 0 ? `${(availableUnits / totalUnits) * 100}%` : '0%',
    onHoldPct: totalUnits > 0 ? `${(onHoldUnits / totalUnits) * 100}%` : '0%',
    soldPct: totalUnits > 0 ? `${(soldUnits / totalUnits) * 100}%` : '0%'
  };

  // App UI Static Structure
  const appInfo = { name: "Property Ganj", subtitle: "YOUR'S TRULY", logoInitial: "PG" };
  const builderData = builderInfo;
  const platformInfo = { infoBannerText: "You see ONLY your own inventory • You can Hold, Release your units, and Mark Sold • You can override any hold on your units" };

  const navItems: NavItem[] = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Inventory', icon: Home },
    { name: 'Add / Edit Units', icon: PlusSquare },
    { name: 'My Leads', icon: Users },
    { name: 'Reports', icon: Settings }
  ];

  // Helper component for the form
  const AddUnitForm = () => {
    const [formData, setFormData] = useState({
      id: '',
      projectName: '',
      floor: '',
      type: '3 BHK Flat',
      area: '',
      price: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.id || !formData.area || !formData.price) return;
      
      const payload = {
        title: `${formData.projectName || 'New Unit'} - ${formData.id}`,
        propertyType: formData.type,
        purpose: 'sale',
        price: parseInt(formData.price.replace(/[^\d]/g, '')) || 0,
        specs: {
          floorNo: parseInt(formData.floor.replace(/[^\d]/g, '')) || 0,
          carpetArea: parseInt(formData.area.replace(/[^\d]/g, '')) || 0,
          areaUnit: 'sqft'
        },
        builder: {
          projectName: formData.projectName,
          unitLabel: formData.id
        },
        status: 'published'
      };

      try {
        const response = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          fetchProperties();
          setActiveTab('My Inventory');
        } else {
          const error = await response.json();
          alert(`Error: ${error.error || 'Failed to list property'}`);
        }
      } catch (err) {
        console.error("Listing failed", err);
      }
    };

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">List New Property</h3>
          <p className="text-sm text-slate-500 mt-1">Fill in the details to add a unit to your inventory.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Project Name</label>
              <input 
                type="text" 
                placeholder="e.g. Godrej Meridian"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-sans"
                value={formData.projectName}
                onChange={e => setFormData({...formData, projectName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Unit ID / Number</label>
              <input 
                type="text" 
                placeholder="e.g. U-108"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-sans"
                value={formData.id}
                onChange={e => setFormData({...formData, id: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Floor</label>
              <input 
                type="text" 
                placeholder="e.g. 8th"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-sans"
                value={formData.floor}
                onChange={e => setFormData({...formData, floor: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Property Type</label>
              <select 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white font-sans"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option>2 BHK Flat</option>
                <option>3 BHK Flat</option>
                <option>4 BHK Flat</option>
                <option>4 BHK Penthouse</option>
                <option>Office Space</option>
                <option>Studio Apartment</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Area (sqft)</label>
              <input 
                type="text" 
                placeholder="e.g. 1650 sqft"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-sans"
                value={formData.area}
                onChange={e => setFormData({...formData, area: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Listing Price</label>
              <input 
                type="text" 
                placeholder="e.g. ₹1.45 Cr"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-sans"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="pt-4 flex gap-4">
            <button 
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all shadow-md shadow-orange-500/20 font-sans"
            >
              List Property Directly
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('Overview')}
              className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-all font-sans"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const InventoryTableView = ({ fullScreen = false }: { fullScreen?: boolean }) => (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden ${fullScreen ? 'min-h-[600px]' : ''}`}>
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {fullScreen ? 'Complete Property Portfolio' : 'My Inventory'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {fullScreen ? 'Manage all your listed units, their pricing, and status from this centralized view.' : 'Only your units • You cannot see other builders\' inventory'}
          </p>
        </div>
        {fullScreen && (
          <div className="flex gap-3">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search units..."
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-sans"
                />
                <LayoutDashboard size={16} className="absolute left-3 top-2.5 text-slate-400" />
             </div>
             <button 
              onClick={() => setActiveTab('Add / Edit Units')}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm font-sans"
             >
               Add New Unit
             </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Unit ID</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Area</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Hold By</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {inventoryData.map((item) => (
              <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{item.id}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]">{item.projectName || '--'}</td>
                <td className="px-6 py-4 text-slate-600">{item.type}</td>
                <td className="px-6 py-4 text-slate-600">{item.area}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{item.price}</td>
                <td className="px-6 py-4">
                  {item.status === 'Available' && (
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Available
                    </span>
                  )}
                  {item.status === 'On Hold' && (
                    <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-yellow-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> On Hold
                    </span>
                  )}
                  {item.status === 'Sold' && (
                    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Sold
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {item.holdBy ? (
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-medium text-xs">{item.holdBy.name}</span>
                      <span className="text-orange-600 text-xs flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {getShortRemainingTimeStr(item.holdExpiryTime)} left
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {item.actions.map(action => (
                    <button 
                      key={action} 
                      onClick={() => handleAction(action, item.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border font-sans ${
                        action === 'Hold' ? 'bg-white border-orange-200 text-orange-600 hover:bg-orange-50' : 
                        action === 'Release' ? 'bg-white border-green-200 text-green-600 hover:bg-green-50' : 
                        action === 'Mark Sold' ? 'bg-slate-800 border-slate-800 text-white hover:bg-slate-700' :
                        'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex text-xs text-slate-500 justify-between items-center">
        <span>Showing {inventoryData.length} of {totalUnits} units</span>
        <div className="flex gap-1">
          <button className="px-2 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50 font-sans">Prev</button>
          <button className="px-2 py-1 border border-slate-200 rounded bg-white font-medium text-orange-600 font-sans">1</button>
          <button className="px-2 py-1 border border-slate-200 rounded hover:bg-white font-sans">Next</button>
        </div>
      </div>
    </div>
  );

  const LeadsView = () => {
    const onHoldLeads = inventoryData.filter(i => i.status === 'On Hold');

    return (
      <div className="space-y-6">
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">Active Leads & Unit Holds</h3>
          <p className="text-sm text-slate-600 mt-1">
            These are agents and clients who have expressed direct interest by putting units on hold. 
            Holds auto-expire after 48 hours unless marked as sold.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onHoldLeads.length === 0 ? (
            <div className="col-span-full bg-white border border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <Users size={48} className="text-slate-300 mb-4" />
              <h4 className="text-lg font-bold text-slate-700">No Active Leads</h4>
              <p className="text-slate-500 max-w-sm mt-1">When an agent puts a unit on hold, their contact and lead details will appear here.</p>
            </div>
          ) : (
            onHoldLeads.map(lead => (
              <div key={lead.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-orange-300 transition-colors">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <span className="font-bold text-slate-900 border-b-2 border-orange-500 pb-0.5">{lead.id}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold uppercase tracking-wider">Unit on Hold</span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{lead.holdBy?.name || 'Agent'}</h4>
                      <p className="text-xs text-orange-600 font-semibold flex items-center gap-1 mt-0.5 font-sans">
                        <Clock size={12} /> {getRemainingTimeStr(lead.holdExpiryTime)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Unit Details</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Project:</span>
                        <span className="font-medium text-slate-800 truncate ml-2 text-right">{lead.projectName || '--'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Type:</span>
                        <span className="font-medium text-slate-800">{lead.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Floor:</span>
                        <span className="font-medium text-slate-800">{lead.floor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Price:</span>
                        <span className="font-bold text-slate-800">{lead.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleAction('Release', lead.id)}
                      className="flex-1 px-3 py-2 bg-white border border-green-200 text-green-600 rounded-lg text-xs font-bold hover:bg-green-50 transition-colors shadow-sm font-sans"
                    >
                      Release Unit
                    </button>
                    <button 
                      onClick={() => handleAction('Mark Sold', lead.id)}
                      className="flex-1 px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors shadow-sm font-sans"
                    >
                      Mark Sold
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 dashboard-root">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col items-center py-6 shadow-sm shrink-0">
        <Link href="/" className="flex items-center gap-3 w-full px-6 mb-10 hover:opacity-80 transition-opacity">
          <div className="bg-orange-500 text-white font-bold p-2 rounded text-xl shadow-sm">
            {appInfo.logoInitial}
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">{appInfo.name}</h1>
            <p className="text-xs text-orange-600 font-medium">{appInfo.subtitle}</p>
          </div>
        </Link>

        <nav className="w-full flex-1 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all font-sans ${
                    activeTab === item.name
                      ? 'bg-orange-50 text-orange-600 font-semibold border border-orange-100 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={activeTab === item.name ? 'text-orange-500' : 'text-slate-400'} />
                    <span>{item.name}</span>
                  </div>
                  {item.name === 'My Leads' && onHoldUnits > 0 && (
                    <span className={`text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold bg-orange-500 text-white`}>
                      {onHoldUnits}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">{activeTab === 'Overview' ? `Builder Dashboard — ${builderData.name}` : activeTab}</h2>
            <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs border border-green-200">
              {builderData.badge}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{builderData.name}</p>
                <p className="text-xs text-slate-500">{builderData.type}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg border border-orange-200 shadow-sm">
                {builderData.shortName}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-8 space-y-6">
          
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-slate-500 gap-2 font-medium">
            <span className="text-orange-600">{builderData.name}</span>
            <ChevronRight size={14} className="text-slate-400"/>
            <span className="text-slate-700">Dashboard</span>
            <ChevronRight size={14} className="text-slate-400"/>
            <span>{activeTab}</span>
          </div>

          {activeTab === 'Overview' && (
            <>
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-5 py-3 rounded-lg flex items-center gap-3 text-sm shadow-sm">
                <AlertCircle size={18} className="text-blue-500"/>
                <p>{platformInfo.infoBannerText}</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Building size={64}/>
                  </div>
                  <h3 className="text-slate-500 text-sm font-semibold mb-1">My Total Units</h3>
                  <p className="text-3xl font-bold text-slate-800">{totalUnits}</p>
                  <p className="text-xs text-slate-400 mt-2">All listed units</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-green-500">
                  <h3 className="text-slate-500 text-sm font-semibold mb-1">Available</h3>
                  <p className="text-3xl font-bold text-green-600">{availableUnits}</p>
                  <p className="text-xs text-slate-400 mt-2">Ready to sell</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-yellow-400">
                  <h3 className="text-slate-500 text-sm font-semibold mb-1">On Hold</h3>
                  <p className="text-3xl font-bold text-yellow-500">{onHoldUnits}</p>
                  <p className="text-xs text-slate-400 mt-2">48-hr protection</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-red-500">
                  <h3 className="text-slate-500 text-sm font-semibold mb-1">Sold</h3>
                  <p className="text-3xl font-bold text-red-600">{soldUnits}</p>
                  <p className="text-xs text-slate-400 mt-2">This month</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                  <InventoryTableView />
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                  {/* Inventory Health */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="text-lg font-bold text-slate-800">Inventory Health</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-semibold text-slate-700">Available</span>
                          <span className="text-sm font-bold text-green-600">{availableUnits}/{totalUnits}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: inventoryHealth.availablePct }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-semibold text-slate-700">On Hold</span>
                          <span className="text-sm font-bold text-yellow-500">{onHoldUnits}/{totalUnits}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500" style={{ width: inventoryHealth.onHoldPct }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-semibold text-slate-700">Sold</span>
                          <span className="text-sm font-bold text-red-600">{soldUnits}/{totalUnits}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className="bg-red-500 h-2.5 rounded-full transition-all duration-500" style={{ width: inventoryHealth.soldPct }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Holds Section */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col max-h-[450px]">
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col shrink-0">
                      <h3 className="text-lg font-bold text-slate-800">Holds on My Units</h3>
                      <p className="text-xs text-slate-500 mt-1">You can release these anytime</p>
                    </div>
                    <div className="p-4 space-y-3 overflow-y-auto flex-1 text-center py-8">
                       {onHoldUnits === 0 ? (
                         <span className="text-slate-400 font-medium">No units currently on hold.</span>
                       ) : (
                         <div className="space-y-3">
                           {inventoryData.filter(i => i.status === 'On Hold').map(hold => (
                             <div key={hold.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left relative shadow-sm">
                               <div className="flex justify-between items-start">
                                 <div>
                                   <h4 className="font-bold text-slate-800">{hold.id} • {hold.type}</h4>
                                   <p className="text-sm text-slate-600 mt-0.5">Held by: {hold.holdBy?.name}</p>
                                 </div>
                                 <button 
                                   onClick={() => handleAction('Release', hold.id)}
                                   className="px-2 py-1 bg-white border border-green-200 text-green-600 rounded text-[10px] font-bold hover:bg-green-50 font-sans"
                                 >
                                   Release
                                 </button>
                               </div>
                               <div className="mt-2 text-orange-600 text-[10px] font-bold flex items-center gap-1">
                                 <Clock size={12} /> {getShortRemainingTimeStr(hold.holdExpiryTime)} left
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add Project CTA */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Direct Portal Listing</h3>
                  <p className="text-sm text-slate-500 mt-1">Upload inventory directly to the platform for instant visibility to agents</p>
                </div>
                <button 
                  onClick={() => setActiveTab('Add / Edit Units')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md shadow-orange-500/20 font-sans"
                >
                  <PlusSquare size={18} />
                  Add New Unit
                </button>
              </div>
            </>
          )}

          {activeTab === 'My Inventory' && (
            <InventoryTableView fullScreen={true} />
          )}

          {activeTab === 'Add / Edit Units' && (
            <AddUnitForm />
          )}

          {activeTab === 'My Leads' && (
            <LeadsView />
          )}

          {activeTab === 'Reports' && (
            <div className="bg-white border border-slate-200 border-dashed rounded-xl p-20 flex flex-col items-center justify-center text-center">
              <Settings size={64} className="text-slate-300 mb-6" />
              <h3 className="text-2xl font-bold text-slate-800">Advanced Reports</h3>
              <p className="text-slate-500 max-w-md mt-2">
                Sales analytics, agent performance metrics, and inventory turnover reports are being finalized for the next update.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default BuilderDashboardContent;
