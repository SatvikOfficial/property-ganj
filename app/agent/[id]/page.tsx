'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import { MapPin, Phone, Mail, Calendar, Award, Building2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import LeadFormModal from '@/components/LeadFormModal';

export default function AgentProfile() {
  const params = useParams();
  const [agent, setAgent] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        // Fetch Agent Details
        const agentRes = await fetch(`/api/agents/${params?.id}`);
        const agentData = await agentRes.json();

        if (agentRes.ok) {
          setAgent(agentData.agent);

          // Fetch Agent Properties
          // If dummy agent, we might not have real properties, so we skip or show placeholders
          if (params?.id && !params.id.toString().startsWith('dummy')) {
            const propsRes = await fetch(`/api/properties?userId=${params.id}&limit=100`);
            const propsData = await propsRes.json();
            if (propsRes.ok) {
              setProperties(propsData.properties || []);
            }
          } else {
            // Generate dummy properties for dummy agents
            setProperties(generateDummyProperties(agentData.agent.name));
          }
        }
      } catch (error) {
        console.error('Error fetching agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchAgentData();
    }
  }, [params?.id]);

  const generateDummyProperties = (agentName: string) => {
    return Array.from({ length: 4 }).map((_, i) => ({
      _id: `dummy-prop-${i}`,
      title: `Premium Property ${i + 1} by ${agentName}`,
      price: 5000000 + (i * 1000000),
      location: { locality: 'Gomti Nagar', city: 'Lucknow' },
      specs: { bedrooms: 3, bathrooms: 2, carpetArea: 1500 },
      propertyType: 'Apartment',
      purpose: 'sale',
      media: { photos: [{ url: '/modern-apartment.jpg' }] },
      isDummy: true
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Agent not found</h1>
          <Link href="/" className="text-red-600 hover:underline mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* Agent Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-gray-100 flex-shrink-0 relative">
              <img
                src={agent.agentProfile?.photoUrl || "/placeholder-user.jpg"}
                alt={agent.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {agent.name}
                    <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-50" />
                  </h1>
                  <p className="text-lg text-red-600 font-medium mt-1">
                    {Array.isArray(agent.agentProfile?.specialization)
                      ? agent.agentProfile.specialization.join(', ')
                      : (agent.agentProfile?.specialization || 'Real Estate Agent')}
                  </p>
                  {agent.agentProfile?.languages && agent.agentProfile.languages.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Speaks: {agent.agentProfile.languages.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowContact(true)}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Contact Agent
                  </button>
                </div>
              </div>

              <LeadFormModal
                isOpen={showContact}
                onClose={() => setShowContact(false)}
                type="agent_contact"
                targetId={agent._id}
                targetName={agent.name}
                title={`Contact ${agent.name}`}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{agent.agentProfile?.location || 'Lucknow'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Experience: {agent.agentProfile?.experience || 0} Years</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>Properties: {properties.length} Listed</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">About {agent.name}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {agent.agentProfile?.bio || `${agent.name} is a dedicated real estate professional specializing in ${agent.agentProfile?.specialization || 'residential properties'}. With over ${agent.agentProfile?.experience || 0} years of experience in the Lucknow market, they help clients find their dream properties with transparency and trust.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Properties Listed by {agent.name}</h2>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link
                href={property.isDummy ? '#' : `/property/${property._id}`}
                key={property._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.media?.photos?.[0]?.url || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900">
                    {property.propertyType}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {property.location?.locality}, {property.location?.city}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{property.title}</h3>
                  <p className="text-red-600 font-bold text-xl mb-3">{formatPrice(property.price)}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">{property.specs?.bedrooms}</span> BHK
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">{property.specs?.bathrooms}</span> Baths
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">{property.specs?.carpetArea}</span> Sq.Ft
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No properties listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
