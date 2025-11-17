"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Eye, Edit, Trash2, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import Image from 'next/image';

type Property = {
  _id: string;
  title: string;
  price: number;
  purpose: 'sale' | 'rent';
  propertyType: string;
  status: 'draft' | 'published';
  location: {
    city: string;
    locality?: string;
  };
  media?: {
    photos?: Array<{ url: string }>;
  };
  createdAt: string;
};

export default function MyAdsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties/my-ads');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data.properties || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your properties',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish property');
      }

      toast({
        title: 'Success',
        description: 'Property published successfully',
      });

      fetchProperties();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish property',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      toast({
        title: 'Success',
        description: 'Property deleted successfully',
      });

      fetchProperties();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredProperties = properties.filter((property) => {
    if (activeTab === 'all') return true;
    return property.status === activeTab;
  });

  const publishedCount = properties.filter((p) => p.status === 'published').length;
  const draftCount = properties.filter((p) => p.status === 'draft').length;

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Ads</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'all'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'published'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'draft'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {activeTab === 'all' ? 'No properties yet' : `No ${activeTab} properties`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'all'
                ? 'Start by listing your first property'
                : `You don't have any ${activeTab} properties`}
            </p>
            <Link href="/list-property">
              <Button>List a Property</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const image = property.media?.photos?.[0]?.url || '/placeholder.svg';
              const location = [property.location.locality, property.location.city]
                .filter(Boolean)
                .join(', ');

              return (
                <div
                  key={property._id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-muted">
                    <Image
                      src={image}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {property.status === 'published' ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Live
                        </span>
                      ) : (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1 line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{location}</p>
                    <p className="text-lg font-bold text-primary mb-4">
                      {formatCurrency(property.price)}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/property/${property._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      {property.status === 'draft' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handlePublish(property._id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Publish
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(property._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

