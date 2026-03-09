'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="space-x-4">
                        <button 
                            onClick={() => router.push('/admin/projects')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Manage Projects
                        </button>
                        <button 
                            onClick={() => router.push('/admin/builders')}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            Manage Builders
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProjects}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Total Units</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUnits}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Total Agents</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAgents}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-4 px-6 text-sm font-medium ${activeTab === 'overview'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={`py-4 px-6 text-sm font-medium ${activeTab === 'inventory'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Inventory
                            </button>
                            <button
                                onClick={() => setActiveTab('agents')}
                                className={`py-4 px-6 text-sm font-medium ${activeTab === 'agents'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Agents
                            </button>
                            <button
                                onClick={() => setActiveTab('builders')}
                                className={`py-4 px-6 text-sm font-medium ${activeTab === 'builders'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Builders
                            </button>
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`py-4 px-6 text-sm font-medium ${activeTab === 'projects'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Projects
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' ? (
                            <div className="overflow-x-auto">
                                <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promoter</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {projects.map((project) => (
                                            <tr key={project.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.cities?.name || 'Unknown'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{project.status}</span></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.promoters?.full_name || 'Unassigned'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : activeTab === 'inventory' ? (
                            <InventoryTable />
                        ) : activeTab === 'agents' ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {agents.map((agent) => (
                                            <tr key={agent.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent.full_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap max-w-[100px] overflow-hidden text-ellipsis"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{agent.role}</span></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleRemoveAgent(agent.id)} className="text-red-600 hover:text-red-900">Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
