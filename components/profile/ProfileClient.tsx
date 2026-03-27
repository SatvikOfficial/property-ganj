'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, User as UserIcon, LogOut, ShieldCheck, Clock, Briefcase, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AgentApplicationModal from '@/components/AgentApplicationModal';

type ProfileUser = {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  role: string;
  created_at?: string;
};

interface ProfileClientProps {
  user: ProfileUser;
}

export function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const hasChanges = useMemo(() => {
    return (
      formData.name.trim() !== (user.name || '') ||
      (formData.email || '').trim() !== (user.email || '') ||
      formData.phone.trim() !== (user.phone || '')
    );
  }, [formData, user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!hasChanges) {
      toast({
        title: 'No changes detected',
        description: 'Update a field before saving.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Please try again.');
      }

      toast({
        title: 'Profile updated',
        description: 'Your account details were saved successfully.',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  useEffect(() => {
    // Populate form data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
  }, [user]);

  const handleApplyAgent = async (applicationData: any) => {
    setIsApplying(true);
    try {
      const response = await fetch('/api/profile/agent-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Please try again later.');
      }

      toast({ title: 'Submitted', description: 'Your application has been sent for admin approval.' });
    } catch (error) {
      toast({
        title: 'Application Failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: 'Logged out', description: 'See you soon!' });
      router.push('/');
      router.refresh();
    } catch {
      toast({ title: 'Logout failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const memberYear = user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Profile Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center shadow-lg relative z-10">
            <span className="text-4xl shadow-sm text-primary font-bold">
              {(formData.name || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground relative z-10">{formData.name || 'User'}</h2>
          <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold mt-2 relative z-10">
            {user.role === 'admin' ? 'Administrator' : user.role === 'agent' ? 'Certified Agent' : user.role === 'builder' ? 'Builder' : 'Member'}
          </p>

          <div className="w-full h-px bg-border my-6 relative z-10" />

          <div className="w-full space-y-4 relative z-10 text-left">
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-muted-foreground">Account Status: <strong className="text-foreground">Active</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-muted-foreground">Member Since: <strong className="text-foreground">{memberYear}</strong></span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center gap-2 text-sm font-semibold text-destructive border border-destructive/30 bg-destructive/5 px-4 py-3 rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 relative z-10 focus:ring-4 focus:ring-destructive/20 outline-none"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Register as Agent Box - Only for users */}
        {user.role === 'user' && (
          <div className="bg-gradient-to-br from-primary to-[#d6522f] rounded-3xl p-8 shadow-lg text-white relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
            <Briefcase className="w-10 h-10 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Become an Agent</h3>
            <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
              Unlock exclusive tools, priority listings, and earn trust with the Ganj Certified badge.
            </p>
            <button
              onClick={() => setIsAgentModalOpen(true)}
              disabled={isApplying}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-[0_8px_20px_rgba(235,98,57,0.25)] hover:shadow-[0_12px_25px_rgba(235,98,57,0.35)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <span>Apply Now</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Right Column - Edit Form */}
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold text-foreground">Personal Details</h3>
            <p className="text-muted-foreground text-sm mt-1">Update your information to keep your profile current.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-foreground group-focus-within:text-primary transition-colors">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background focus:bg-background focus:border-primary outline-none transition-all duration-300 shadow-sm focus:shadow-md"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-foreground group-focus-within:text-primary transition-colors">
                Email Address <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background focus:bg-background focus:border-primary outline-none transition-all duration-300 shadow-sm focus:shadow-md"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-foreground group-focus-within:text-primary transition-colors">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-border rounded-xl bg-background focus:bg-background focus:border-primary outline-none transition-all duration-300 shadow-sm focus:shadow-md"
                  placeholder="9876543210"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Your phone securely links to your properties and inquiries.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              disabled={isSaving || !hasChanges}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-[0_8px_20px_rgba(235,98,57,0.25)] hover:shadow-[0_12px_25px_rgba(235,98,57,0.35)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <AgentApplicationModal 
        isOpen={isAgentModalOpen} 
        onClose={() => setIsAgentModalOpen(false)} 
        onSubmit={handleApplyAgent} 
        user={user} 
      />
    </div>
  );
}
