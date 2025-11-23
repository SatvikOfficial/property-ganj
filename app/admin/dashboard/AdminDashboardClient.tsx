'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Property {
    _id: string;
    title: string;
    location: {
        city: string;
        locality: string;
    };
    price: number;
    listedBy?: {
        name: string;
        email: string;
    };
}

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

interface DashboardProps {
    initialListings: Property[];
    initialAgents: User[];
    stats: {
        totalListings: number;
        totalAgents: number;
        totalUsers: number;
    };
}

export default function AdminDashboardClient({
    initialListings,
    initialAgents,
    stats,
}: DashboardProps) {
    const [listings, setListings] = useState<Property[]>(initialListings);
    const [agents, setAgents] = useState<User[]>(initialAgents);
    const [activeTab, setActiveTab] = useState<'listings' | 'agents'>('listings');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDeleteListing = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        try {
            setIsLoading(true);
            const res = await fetch(`/api/admin/listings/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setListings(listings.filter((l) => l._id !== id));
                alert('Listing deleted successfully');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete listing');
            }
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveAgent = async (id: string) => {
        if (!confirm('Are you sure you want to remove this agent?')) return;

        try {
            setIsLoading(true);
            const res = await fetch(`/api/admin/agents/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setAgents(agents.filter((a) => a._id !== id));
                alert('Agent removed successfully');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to remove agent');
            }
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
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium">Total Listings</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalListings}</p>
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
                                onClick={() => setActiveTab('listings')}
                                className={`py-4 px-6 text-sm font-medium ${activeTab === 'listings'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Listings
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
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'listings' ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Property
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Owner
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {listings.map((listing) => (
                                            <tr key={listing._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {listing.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {listing.location.locality}, {listing.location.city}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        ₹{listing.price.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {listing.listedBy?.email || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDeleteListing(listing._id)}
                                                        disabled={isLoading}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Phone
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {agents.map((agent) => (
                                            <tr key={agent._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {agent.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{agent.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{agent.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {agent.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleRemoveAgent(agent._id)}
                                                        disabled={isLoading}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
