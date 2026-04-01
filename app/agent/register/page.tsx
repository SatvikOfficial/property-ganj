'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  Upload,
  Shield,
  Star,
  Users,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

const specialtyOptions = [
  'Residential Sales',
  'Commercial Spaces',
  'Land Development',
  'Investment Properties',
  'Luxury Properties',
  'Rental Properties',
  'Property Valuation',
  'First-time Buyers',
];
const languageOptions = ['English', 'Hindi'];

export default function AgentRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    specialties: [] as string[],
    languages: [] as string[],
    experience: '',
    image: '',
  });

  useEffect(() => {
    (async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role,full_name')
        .eq('user_id', authUser.id)
        .single();

      if (profile?.role === 'agent') {
        router.push('/agent');
        return;
      }

      setUser(authUser);
      setFormData((prev) => ({
        ...prev,
        fullName: profile?.full_name || authUser.user_metadata?.full_name || authUser.email || '',
      }));
      setIsLoading(false);
    })();
  }, [supabase, router]);

  const handleToggle = (field: 'specialties' | 'languages', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast({ title: 'Full name required', variant: 'destructive' });
      return;
    }
    if (formData.specialties.length === 0) {
      toast({ title: 'Select at least one specialty', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          agent_application: {
            bio: formData.bio.trim(),
            specialties: formData.specialties,
            languages: formData.languages,
            experience: formData.experience,
            status: 'pending',
            appliedAt: new Date().toISOString(),
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to submit application');
      }

      setIsSubmitted(true);
      toast({ title: 'Application submitted!', description: 'Our team will review it shortly.' });
    } catch (err) {
      toast({
        title: 'Unable to submit',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {isSubmitted ? (
          <div className="rounded-[30px] border border-[#eadcca] bg-white p-8 md:p-12 text-center shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#1f2a2e] mb-3">Application Submitted!</h1>
            <p className="text-[#667085] max-w-md mx-auto leading-7">
              Our team will review your profile and get back to you. Once approved,
              you'll have full access to the Agent Dashboard.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#eb6239] px-8 py-3 font-bold text-white hover:bg-[#d85a35] transition"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
            {/* Main form */}
            <div className="rounded-[30px] border border-[#eadcca] bg-white p-6 md:p-8 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]">
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">
                  Agent Registration
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1f2a2e] md:text-4xl">
                  Join Property Ganj as an Agent
                </h1>
                <p className="mt-2 text-sm leading-7 text-[#667085]">
                  Fill in your details below. Our team will review your application and grant you access to the Agent Dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile photo + name row */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <label className="text-sm font-semibold text-[#1f2a2e] mb-2 block">
                      Profile Photo
                    </label>
                    <div className="relative aspect-square rounded-[22px] border-2 border-dashed border-[#d6c4b0] bg-[#fffaf5] hover:bg-[#fff3eb] transition flex flex-col items-center justify-center overflow-hidden cursor-pointer group">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="w-8 h-8 text-[#eb6239] mx-auto mb-2 opacity-50 group-hover:opacity-100 transition" />
                          <span className="text-xs text-[#667085] font-medium">Click to upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-2/3 space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-[#1f2a2e] mb-1 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full rounded-[18px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#1f2a2e] mb-1 block">
                        Years of Experience
                      </label>
                      <input
                        required
                        type="number"
                        min="0"
                        placeholder="E.g. 5"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full rounded-[18px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-sm font-semibold text-[#1f2a2e] mb-1 block">
                    Professional Bio
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your real estate background and what makes you a great agent..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full rounded-[18px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239] resize-none"
                  />
                </div>

                {/* Specialties */}
                <div>
                  <label className="text-sm font-semibold text-[#1f2a2e] mb-2 block">
                    Specialties <span className="font-normal text-[#667085]">(Select multiple)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map((spec) => (
                      <button
                        type="button"
                        key={spec}
                        onClick={() => handleToggle('specialties', spec)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
                          formData.specialties.includes(spec)
                            ? 'bg-[#eb6239] border-[#eb6239] text-white'
                            : 'bg-white border-[#eadcca] text-[#667085] hover:bg-[#fff8f3]'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="text-sm font-semibold text-[#1f2a2e] mb-2 block">
                    Languages Spoken
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((lang) => (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => handleToggle('languages', lang)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
                          formData.languages.includes(lang)
                            ? 'bg-[#1f2a2e] border-[#1f2a2e] text-white'
                            : 'bg-white border-[#eadcca] text-[#667085] hover:bg-[#fff8f3]'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-[#eadcca] flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-full border border-[#eadcca] bg-white px-6 py-3 font-bold text-[#1f2a2e] hover:bg-[#fff8f3] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.specialties.length === 0}
                    className="rounded-full bg-[#eb6239] px-8 py-3 font-bold text-white hover:bg-[#d85a35] transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar benefits */}
            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[30px] border border-[#eadcca] bg-[#1f2a2e] p-6 text-white shadow-[0_24px_64px_-40px_rgba(15,23,42,0.58)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/55">
                  Why join?
                </p>
                <h3 className="mt-3 text-xl font-bold">Agent Benefits</h3>
                <div className="mt-5 space-y-4">
                  {[
                    { icon: Shield, title: 'Verified Badge', desc: 'Stand out as a trusted professional' },
                    { icon: Star, title: 'Priority Leads', desc: 'Get buyer interest routed directly to you' },
                    { icon: Users, title: 'Hold System', desc: 'Reserve properties for 48h while you close' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
                      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#fbbf24]" />
                      <div>
                        <p className="text-sm font-bold">{title}</p>
                        <p className="text-xs text-white/70">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-[#eadcca] bg-white p-5 shadow-[0_18px_48px_-36px_rgba(15,23,42,0.26)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9ca3af]">
                  How It Works
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    'Submit your application with profile details.',
                    'Admin reviews and approves your profile.',
                    'Access your Agent Dashboard and start closing.',
                  ].map((step, i) => (
                    <div key={step} className="flex items-start gap-3 rounded-[18px] bg-[#fff8f3] px-4 py-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eb6239] text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-6 text-[#4b5563]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
