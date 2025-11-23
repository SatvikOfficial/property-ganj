'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminBuildersPage() {
    const [builders, setBuilders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentBuilder, setCurrentBuilder] = useState<any>(null);
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        reraId: '',
        logoUrl: '',
        description: '',
        establishedYear: '',
        contactPhone: '',
        website: '',
        tags: '',
        headquarters: ''
    });

    useEffect(() => {
        fetchBuilders();
    }, []);

    const fetchBuilders = async () => {
        try {
            const res = await fetch('/api/builders');
            const data = await res.json();
            setBuilders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching builders:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : undefined,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            };

            if (currentBuilder) {
                await fetch(`/api/builders/${currentBuilder._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch('/api/builders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            setIsDialogOpen(false);
            fetchBuilders();
            resetForm();
        } catch (error) {
            console.error('Error saving builder:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this builder?')) return;
        try {
            await fetch(`/api/builders/${id}`, { method: 'DELETE' });
            fetchBuilders();
        } catch (error) {
            console.error('Error deleting builder:', error);
        }
    };

    const openEditDialog = (builder: any) => {
        setCurrentBuilder(builder);
        setFormData({
            name: builder.name,
            reraId: builder.reraId || '',
            logoUrl: builder.logoUrl || '',
            description: builder.description || '',
            establishedYear: builder.establishedYear?.toString() || '',
            contactPhone: builder.contactPhone || '',
            website: builder.website || '',
            tags: builder.tags?.join(', ') || '',
            headquarters: builder.headquarters || ''
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setCurrentBuilder(null);
        setFormData({
            name: '',
            reraId: '',
            logoUrl: '',
            description: '',
            establishedYear: '',
            contactPhone: '',
            website: '',
            tags: '',
            headquarters: ''
        });
    };

    const filteredBuilders = builders.filter(builder =>
        builder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Builders</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Builder
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{currentBuilder ? 'Edit Builder' : 'Add New Builder'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reraId">RERA ID</Label>
                                    <Input id="reraId" name="reraId" value={formData.reraId} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="logoUrl">Logo URL</Label>
                                    <Input id="logoUrl" name="logoUrl" value={formData.logoUrl} onChange={handleInputChange} placeholder="/path/to/image.jpg" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="establishedYear">Established Year</Label>
                                    <Input id="establishedYear" name="establishedYear" type="number" value={formData.establishedYear} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone">Contact Phone</Label>
                                    <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input id="website" name="website" value={formData.website} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="headquarters">Headquarters</Label>
                                    <Input id="headquarters" name="headquarters" value={formData.headquarters} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma separated)</Label>
                                    <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Luxury, Affordable" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">{currentBuilder ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center mb-6 bg-white p-2 rounded-lg border shadow-sm max-w-md">
                <Search className="w-5 h-5 text-gray-400 ml-2" />
                <Input
                    placeholder="Search builders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0"
                />
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>RERA ID</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Projects</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : filteredBuilders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">No builders found</TableCell>
                            </TableRow>
                        ) : (
                            filteredBuilders.map((builder) => (
                                <TableRow key={builder._id}>
                                    <TableCell className="font-medium">{builder.name}</TableCell>
                                    <TableCell>{builder.reraId || '-'}</TableCell>
                                    <TableCell>{builder.contactPhone || '-'}</TableCell>
                                    <TableCell>{builder.totalProjects || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(builder)}>
                                                <Pencil className="w-4 h-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(builder._id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
