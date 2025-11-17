import { notFound } from 'next/navigation';
import Header from '@/components/header';
import { MapPin, Phone, Mail, Calendar, Users, Home, Star } from 'lucide-react';
import Link from 'next/link';

// Mock agent data - in production, fetch from database
const agents = [
  {
    id: 1,
    name: "Vivid Infra",
    company: "Vivid Infra Land Pvt Ltd",
    since: 2012,
    buyers: "1000+",
    propertiesSale: 65,
    propertiesRent: 0,
    image: "/agent-profile-photo.jpg",
    phone: "+91 98765 43210",
    email: "vividinfra@example.com",
    location: "Gomti Nagar, Lucknow",
    rating: 4.8,
    reviews: 127,
    description: "With over 12 years of experience in real estate, Vivid Infra has helped thousands of clients find their dream properties. We specialize in residential and commercial properties across Lucknow.",
    specialties: ["Residential Properties", "Commercial Spaces", "Land Development"],
    languages: ["Hindi", "English"],
  },
  {
    id: 2,
    name: "Saurabh Gupta",
    company: "Safe Invest Realty",
    since: 2012,
    buyers: "100+",
    propertiesSale: 56,
    propertiesRent: 0,
    image: "/agent-profile.png",
    phone: "+91 98765 43211",
    email: "saurabh@safeinvest.com",
    location: "Hazratganj, Lucknow",
    rating: 4.6,
    reviews: 89,
    description: "Dedicated real estate professional committed to providing exceptional service. Specializing in investment properties and first-time homebuyers.",
    specialties: ["Investment Properties", "First-time Buyers", "Property Consultation"],
    languages: ["Hindi", "English"],
  },
  {
    id: 3,
    name: "Rahul Juyal",
    company: "Pratham Realty Solutions",
    since: 2011,
    buyers: "4000+",
    propertiesSale: 71,
    propertiesRent: 0,
    image: "/agent-photo.jpg",
    phone: "+91 98765 43212",
    email: "rahul@prathamrealty.com",
    location: "Indira Nagar, Lucknow",
    rating: 4.9,
    reviews: 234,
    description: "Leading real estate expert with a proven track record. Known for transparent dealings and customer satisfaction.",
    specialties: ["Luxury Properties", "Commercial Real Estate", "Property Management"],
    languages: ["Hindi", "English", "Urdu"],
  },
  {
    id: 4,
    name: "Shiyaram Singh",
    company: "S.R. Broker LLP",
    since: 2017,
    buyers: "4000+",
    propertiesSale: 144,
    propertiesRent: 10,
    image: "/agent-profile-photo.jpg",
    phone: "+91 98765 43213",
    email: "shiyaram@srbroker.com",
    location: "Aliganj, Lucknow",
    rating: 4.7,
    reviews: 156,
    description: "Experienced broker with expertise in both residential and rental properties. Committed to finding the perfect match for every client.",
    specialties: ["Residential Sales", "Rental Properties", "Property Valuation"],
    languages: ["Hindi", "English"],
  },
];

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = agents.find((a) => a.id === Number(id));

  if (!agent) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="relative">
                  <img
                    src={agent.image || "/placeholder.svg"}
                    alt={agent.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-background shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded">
                      MB Preferred
                    </span>
                    <span className="bg-foreground text-background text-xs px-2 py-1 rounded">✓</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{agent.name}</h1>
                  <p className="text-lg text-muted-foreground mb-3">{agent.company}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-accent fill-current" />
                      <span className="font-bold text-foreground">{agent.rating}</span>
                      <span className="text-sm text-muted-foreground">({agent.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{agent.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="p-6 md:p-8 border-b border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 active:bg-muted/60 transition-colors touch-manipulation"
                >
                  <div className="bg-primary/10 rounded-full p-2">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold text-foreground">{agent.phone}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 active:bg-muted/60 transition-colors touch-manipulation"
                >
                  <div className="bg-secondary/10 rounded-full p-2">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">{agent.email}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* About Section */}
            <div className="p-6 md:p-8 border-b border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{agent.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Operating Since</p>
                    <p className="font-bold text-foreground">{agent.since}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 rounded-full p-3">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Buyers Served</p>
                    <p className="font-bold text-foreground">{agent.buyers}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-accent/20 rounded-full p-3">
                    <Home className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Properties</p>
                    <p className="font-bold text-foreground">{agent.propertiesSale + agent.propertiesRent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties & Languages */}
            <div className="p-6 md:p-8 border-b border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-foreground mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="bg-muted text-foreground px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Stats */}
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Property Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-foreground mb-1">{agent.propertiesSale}</p>
                  <p className="text-sm text-muted-foreground">Properties for Sale</p>
                </div>
                {agent.propertiesRent > 0 && (
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-foreground mb-1">{agent.propertiesRent}</p>
                    <p className="text-sm text-muted-foreground">Properties for Rent</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline active:opacity-70 touch-manipulation"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8 px-4 mt-10">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2025 PropertyGanj. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

