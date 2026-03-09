'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, Building2, Package, TrendingUp, Settings, LogOut, Plus } from 'lucide-react';
import BuildersTab from '@/components/admin/BuildersTab';
import ProjectsTab from '@/components/admin/ProjectsTab';
import InventoryTable from '@/components/admin/InventoryTable';

interface Project {
    id: string;
    name: string;
    city_id: string;
    cities?: {
        name: string;
    };
    status: string;
    promoter_id?: string;
    promoters?: {
        email: string;
        full_name: string;
    };
    created_at: string;
}

interface Profile {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    role: string;
    created_at: string;
}

interface DashboardProps {
    initialProjects: Project[];
    initialAgents: Profile[];
    stats: {
        totalProjects: number;
        totalUnits: number;
        totalUsers: number;
        totalAgents: number;
    };
}

export default function AdminDashboardClient({
    initialProjects,
    initialAgents,
    stats,
}: DashboardProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [agents, setAgents] = useState<Profile[]>(initialAgents);
    const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'agents' | 'builders' | 'projects'>('overview');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDeleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            setIsLoading(true);
            alert('Delete functionality to be implemented with server actions');
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveAgent = async (id: string) => {
        if (!confirm('Are you sure you want to remove this agent?')) return;
        try {
            setIsLoading(true);
            alert('Remove functionality to be implemented with server actions');
        } catch (error) {
            console.error('Error removing agent:', error);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">Manage your platform</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={() => router.push('/admin/projects')}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Project</span>
                            </button>
                            <button 
                                onClick={() => router.push('/admin/builders')}
                                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Builder</span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">Total Projects</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProjects}</p>
                            <p className="text-xs text-gray-400 mt-2">Active projects</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <Package className="w-6 h-6 text-purple-600" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">Total Units</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUnits}</p>
                            <p className="text-xs text-gray-400 mt-2">Available units</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">Total Agents</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAgents}</p>
                            <p className="text-xs text-gray-400 mt-2">Active agents</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                            <p className="text-xs text-gray-400 mt-2">Registered users</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50">
                        <nav className="flex -mb-px px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: BarChart3 },
                                { id: 'inventory', label: 'Inventory', icon: Package },
                                { id: 'agents', label: 'Agents', icon: Users },
                                { id: 'builders', label: 'Builders', icon: Building2 },
                                { id: 'projects', label: 'Projects', icon: Building2 },
                            ].map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`py-4 px-4 text-sm font-medium flex items-center space-x-2 border-b-2 transition-all ${
                                            activeTab === tab.id
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                        }`}
                                    >
                                        <TabIcon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-6 bg-white">
                        {activeTab === 'overview' ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                        <span>Recent Projects</span>
                                    </h2>
                                    {projects.length === 0 && (
                                        <p className="text-sm text-gray-500">No projects yet</p>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Promoter</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.map((project) => (
                                                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{project.name}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{project.cities?.name || 'Unknown'}</td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {project.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{project.promoters?.full_name || 'Unassigned'}</td>
                                                    <td className="px-4 py-4 text-right text-sm">
                                                        <button 
                                                            onClick={() => handleDeleteProject(project.id)}
                                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-colors font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : activeTab === 'inventory' ? (
                            <InventoryTable />
                        ) : activeTab === 'agents' ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                                        <Users className="w-5 h-5 text-green-600" />
                                        <span>Manage Agents</span>
                                    </h2>
                                    {agents.length === 0 && (
                                        <p className="text-sm text-gray-500">No agents found</p>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {agents.map((agent) => (
                                                <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{agent.full_name}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{agent.email}</td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {agent.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        {new Date(agent.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-4 text-right text-sm">
                                                        <button 
                                                            onClick={() => handleRemoveAgent(agent.id)}
                                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-colors font-medium"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : activeTab === 'builders' ? (
                            <BuildersTab />
                        ) : activeTab === 'projects' ? (
                            <ProjectsTab />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
