'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [builders, setBuilders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        builderId: '',
        name: '',
        reraId: '',
        locality: '',
        city: 'Lucknow',
        description: '',
        category: 'Apartment',
        minPrice: '',
        maxPrice: '',
        totalUnits: '',
        status: 'Ongoing',
        coverImage: '',
        possessionDate: '',
        amenities: ''
    });

    useEffect(() => {
        fetchProjects();
        fetchBuilders();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const fetchBuilders = async () => {
        try {
            const res = await fetch('/api/builders');
            const data = await res.json();
            setBuilders(data);
        } catch (error) {
            console.error('Error fetching builders:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                minPrice: parseFloat(formData.minPrice),
                maxPrice: parseFloat(formData.maxPrice),
                totalUnits: formData.totalUnits ? parseInt(formData.totalUnits) : undefined,
                location: {
                    locality: formData.locality,
                    city: formData.city
                },
                amenities: formData.amenities.split(',').map(tag => tag.trim()).filter(Boolean)
            };

            if (currentProject) {
                await fetch(`/api/projects/${currentProject._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            setIsDialogOpen(false);
            fetchProjects();
            resetForm();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const openEditDialog = (project: any) => {
        setCurrentProject(project);
        setFormData({
            builderId: project.builderId?._id || project.builderId || '',
            name: project.name,
            reraId: project.reraId || '',
            locality: project.location.locality,
            city: project.location.city,
            description: project.description || '',
            category: project.category,
            minPrice: project.minPrice.toString(),
            maxPrice: project.maxPrice.toString(),
            totalUnits: project.totalUnits?.toString() || '',
            status: project.status,
            coverImage: project.coverImage || '',
            possessionDate: project.possessionDate || '',
            amenities: project.amenities?.join(', ') || ''
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setCurrentProject(null);
        setFormData({
            builderId: '',
            name: '',
            reraId: '',
            locality: '',
            city: 'Lucknow',
            description: '',
            category: 'Apartment',
            minPrice: '',
            maxPrice: '',
            totalUnits: '',
            status: 'Ongoing',
            coverImage: '',
            possessionDate: '',
            amenities: ''
        });
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Projects</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{currentProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="builderId">Builder *</Label>
                                    <Select name="builderId" value={formData.builderId} onValueChange={(val) => handleSelectChange('builderId', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Builder" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {builders.map(b => (
                                                <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Project Name *</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select name="category" value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Apartment">Apartment</SelectItem>
                                            <SelectItem value="Villa">Villa</SelectItem>
                                            <SelectItem value="Plot">Plot</SelectItem>
                                            <SelectItem value="Commercial">Commercial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select name="status" value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                                            <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                                            <SelectItem value="New Launch">New Launch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="locality">Locality *</Label>
                                    <Input id="locality" name="locality" value={formData.locality} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="minPrice">Min Price (₹) *</Label>
                                    <Input id="minPrice" name="minPrice" type="number" value={formData.minPrice} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxPrice">Max Price (₹) *</Label>
                                    <Input id="maxPrice" name="maxPrice" type="number" value={formData.maxPrice} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reraId">RERA ID</Label>
                                    <Input id="reraId" name="reraId" value={formData.reraId} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="totalUnits">Total Units</Label>
                                    <Input id="totalUnits" name="totalUnits" type="number" value={formData.totalUnits} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="coverImage">Cover Image URL</Label>
                                    <Input id="coverImage" name="coverImage" value={formData.coverImage} onChange={handleInputChange} placeholder="/path/to/image.jpg" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="possessionDate">Possession Date</Label>
                                    <Input id="possessionDate" name="possessionDate" value={formData.possessionDate} onChange={handleInputChange} placeholder="e.g. Dec 2025" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amenities">Amenities (comma separated)</Label>
                                <Input id="amenities" name="amenities" value={formData.amenities} onChange={handleInputChange} placeholder="Pool, Gym, Park" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">{currentProject ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center mb-6 bg-white p-2 rounded-lg border shadow-sm max-w-md">
                <Search className="w-5 h-5 text-gray-400 ml-2" />
                <Input
                    placeholder="Search projects..."
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
                            <TableHead>Builder</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price Range</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : filteredProjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">No projects found</TableCell>
                            </TableRow>
                        ) : (
                            filteredProjects.map((project) => (
                                <TableRow key={project._id}>
                                    <TableCell className="font-medium">{project.name}</TableCell>
                                    <TableCell>{project.builderId?.name || 'Unknown'}</TableCell>
                                    <TableCell>{project.location.locality}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${project.status === 'Ready to Move' ? 'bg-green-100 text-green-800' :
                                                project.status === 'New Launch' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>₹{(project.minPrice / 100000).toFixed(1)}L - {(project.maxPrice / 100000).toFixed(1)}L</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                                                <Pencil className="w-4 h-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(project._id)}>
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
