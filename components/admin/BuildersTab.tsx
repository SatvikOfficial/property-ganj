'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Builder {
    _id: string;
    name: string;
    reraId: string;
    logoUrl?: string;
    establishedYear?: number;
    headquarters?: {
        city?: string;
    };
    tags: string[];
}

export default function BuildersTab() {
    const [builders, setBuilders] = useState<Builder[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBuilder, setEditingBuilder] = useState<Builder | null>(null);

    useEffect(() => {
        fetchBuilders();
    }, []);

    const fetchBuilders = async () => {
        try {
            const res = await fetch('/api/builders?limit=100');
            const data = await res.json();
            if (res.ok) {
                setBuilders(data.builders || []);
            }
        } catch (error) {
            console.error('Error fetching builders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this builder?')) return;

        try {
            const res = await fetch(`/api/builders/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setBuilders(builders.filter((b) => b._id !== id));
                alert('Builder deleted successfully');
            } else {
                alert('Failed to delete builder');
            }
        } catch (error) {
            console.error('Error deleting builder:', error);
            alert('An error occurred');
        }
    };

    if (loading) {
        return <div className="p-6">Loading builders...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Builders Management</h2>
                <button
                    onClick={() => {
                        setEditingBuilder(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Builder
                </button>
            </div>

            {showForm && (
                <BuilderForm
                    builder={editingBuilder}
                    onClose={() => {
                        setShowForm(false);
                        setEditingBuilder(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingBuilder(null);
                        fetchBuilders();
                    }}
                />
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RERA ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Established
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {builders.map((builder) => (
                            <tr key={builder._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        {builder.logoUrl && (
                                            <img
                                                src={builder.logoUrl}
                                                alt={builder.name}
                                                className="w-10 h-10 rounded object-contain"
                                            />
                                        )}
                                        <div className="text-sm font-medium text-gray-900">
                                            {builder.name}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{builder.reraId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {builder.headquarters?.city || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {builder.establishedYear || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setEditingBuilder(builder);
                                            setShowForm(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(builder._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Simple inline form component
function BuilderForm({
    builder,
    onClose,
    onSuccess,
}: {
    builder: Builder | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        name: builder?.name || '',
        reraId: builder?.reraId || '',
        logoUrl: builder?.logoUrl || '',
        description: '',
        establishedYear: builder?.establishedYear || '',
        tags: builder?.tags?.join(', ') || '',
        city: builder?.headquarters?.city || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                reraId: formData.reraId,
                logoUrl: formData.logoUrl || undefined,
                description: formData.description || undefined,
                establishedYear: formData.establishedYear ? Number(formData.establishedYear) : undefined,
                tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
                headquarters: formData.city ? { city: formData.city } : undefined,
            };

            const url = builder ? `/api/builders/${builder._id}` : '/api/builders';
            const method = builder ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert(`Builder ${builder ? 'updated' : 'created'} successfully`);
                onSuccess();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save builder');
            }
        } catch (error) {
            console.error('Error saving builder:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">
                    {builder ? 'Edit Builder' : 'Add New Builder'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            RERA ID *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.reraId}
                            onChange={(e) => setFormData({ ...formData, reraId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Logo URL
                        </label>
                        <input
                            type="url"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Established Year
                        </label>
                        <input
                            type="number"
                            value={formData.establishedYear}
                            onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="Residential, Commercial, Luxury"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : builder ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
