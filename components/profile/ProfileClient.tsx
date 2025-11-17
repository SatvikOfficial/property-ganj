'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, User as UserIcon, LogOut, ShieldCheck, Clock } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

type ProfileUser = {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
};

interface ProfileClientProps {
  user: ProfileUser;
}

export function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.phone,
  });
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = useMemo(() => {
    return (
      formData.name.trim() !== user.name ||
      (formData.email || '').trim() !== (user.email || '') ||
      formData.phone.trim() !== user.phone
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
      const payload: Record<string, string> = {};

      if (formData.name.trim() !== user.name) {
        payload.name = formData.name.trim();
      }
      if ((formData.email || '').trim() !== (user.email || '')) {
        payload.email = formData.email.trim();
      }
      if (formData.phone.trim() !== user.phone) {
        payload.phone = formData.phone.trim();
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setFormData({
        name: data.user.name,
        email: data.user.email || '',
        phone: data.user.phone,
      });

      toast({
        title: 'Profile updated',
        description: 'Your account details were saved successfully.',
      });

      router.refresh();
    } catch (error) {
      toast({
        title: 'Update failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast({
        title: 'Logged out',
        description: 'See you soon!',
      });
      router.push('/auth');
      router.refresh();
    } catch {
      toast({
        title: 'Logout failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const infoCards = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      label: 'Account Type',
      value: 'Personal',
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      label: 'Member Since',
      value: new Date().getFullYear().toString(),
    },
  ];

  return (
    <section className="max-w-3xl w-full mx-auto space-y-6">
      <div className="bg-gradient-to-br from-[#fdf4ec] to-white border border-[#264143]/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(38,65,67,0.1)] transition-transform duration-300 hover:-translate-y-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-wide text-[#9ca3af]">
              Welcome back
            </p>
            <h1 className="text-4xl font-black text-[#1f2a2e] tracking-tight">
              {user.name}
            </h1>
            <p className="text-sm text-[#6b7280]">
              Keep your details fresh so buyers can reach you faster.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-[#eb6239] border border-[#eb6239] px-4 py-2 rounded-lg hover:bg-[#eb6239]/10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-3 bg-white/80 border border-[#f0d7b1] rounded-2xl px-4 py-3 shadow-[4px_4px_0_#f8c18a] hover:shadow-[6px_6px_0_#f8c18a] transition-all duration-200"
            >
              <div className="shrink-0">{card.icon}</div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#9ca3af]">
                  {card.label}
                </p>
                <p className="font-semibold text-[#1f2a2e]">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#264143]/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(38,65,67,0.08)] space-y-6 transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1f2a2e]">Full Name</label>
          <div className="relative group">
            <UserIcon className="absolute left-3 top-3.5 text-[#9ca3af]" size={18} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-2xl bg-[#fafafa] focus:bg-white focus:border-[#eb6239] outline-none transition-all duration-200"
              placeholder="Your name"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1f2a2e]">
            Email <span className="text-[#9ca3af]">(optional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-[#9ca3af]" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-2xl bg-[#fafafa] focus:bg-white focus:border-[#eb6239] outline-none transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1f2a2e]">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-[#9ca3af]" size={18} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-2xl bg-[#fafafa] focus:bg-white focus:border-[#eb6239] outline-none transition-all duration-200"
              placeholder="9876543210"
              required
            />
          </div>
          <p className="text-xs text-[#6b7280]">
            Your phone is used for login and inquiries from interested buyers/tenants.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving || !hasChanges}
          className="w-full bg-gradient-to-r from-[#eb6239] to-[#d6522f] text-white font-bold py-3 rounded-2xl shadow-[0_10px_30px_rgba(235,98,57,0.35)] hover:shadow-[0_14px_40px_rgba(235,98,57,0.45)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </section>
  );
}

