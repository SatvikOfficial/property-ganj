'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { softBlockUnit, hardBlockUnit, markUnitSold } from '@/app/admin/actions';

export default function InventoryTable() {
    const [units, setUnits] = useState<any[]>([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchUnits();

        // Real-time subscription
        const channel = supabase
            .channel('realtime_units')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'units' },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchUnits(); // Re-fetch or update local state optimistically
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchUnits = async () => {
        const { data, error } = await supabase
            .from('units')
            .select(`
                *,
                towers (name),
                projects (name)
            `)
            .order('unit_number', { ascending: true });

        if (data) setUnits(data);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'soft_block': return 'bg-yellow-100 text-yellow-800';
            case 'hard_block': return 'bg-orange-100 text-orange-800';
            case 'sold': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSoftBlock = async (id: string) => {
        try {
            setLoadingAction(id);
            await softBlockUnit(id);
            alert('Unit Soft Blocked for 30 mins');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleHardBlock = async (id: string) => {
        const remarks = prompt('Enter remarks for Hard Block:');
        if (!remarks) return;
        try {
            setLoadingAction(id);
            await hardBlockUnit(id, remarks);
            alert('Unit Hard Blocked');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleMarkSold = async (id: string) => {
        const name = prompt('Enter Customer Name:');
        if (!name) return;
        try {
            setLoadingAction(id);
            await markUnitSold(id, name);
            alert('Unit Marked as Sold');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const filteredUnits = filterStatus === 'all'
        ? units
        : units.filter(u => u.status === filterStatus);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Real-time Inventory</h2>
                <div className="flex space-x-2">
                    {['all', 'available', 'soft_block', 'hard_block', 'sold'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1 rounded capitalize text-sm ${filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tower</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry/Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUnits.map((unit) => (
                            <tr key={unit.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.projects?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit.towers?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{unit.unit_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(unit.status)}`}>
                                        {unit.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {unit.status === 'soft_block' && unit.soft_block_expiry ? (
                                        <span className="text-red-600">
                                            {new Date(unit.soft_block_expiry).toLocaleTimeString()}
                                        </span>
                                    ) : unit.status === 'sold' ? (
                                        unit.sold_to_customer_name
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        {unit.status === 'available' && (
                                            <>
                                                <button
                                                    onClick={() => handleSoftBlock(unit.id)}
                                                    disabled={!!loadingAction}
                                                    className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 text-xs disabled:opacity-50"
                                                >
                                                    Soft Block
                                                </button>
                                                <button
                                                    onClick={() => handleHardBlock(unit.id)}
                                                    disabled={!!loadingAction}
                                                    className="bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 text-xs disabled:opacity-50"
                                                >
                                                    Hard Block
                                                </button>
                                            </>
                                        )}
                                        {unit.status === 'hard_block' && (
                                            <button
                                                onClick={() => handleMarkSold(unit.id)}
                                                disabled={!!loadingAction}
                                                className="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 text-xs disabled:opacity-50"
                                            >
                                                Mark Sold
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
