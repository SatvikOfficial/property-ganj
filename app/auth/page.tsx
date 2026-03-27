'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'Please try again.';
  }

  if (error.message.toLowerCase().includes('email not confirmed')) {
    return 'Please verify your email before signing in.';
  }

  return error.message;
}

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(initialFormState);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleMode = () => {
    setIsLogin((current) => !current);
    resetForm();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const email = formData.email.trim().toLowerCase();

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });

        if (error) {
          throw error;
        }

        toast({
          title: 'Welcome back',
          description: 'Redirecting you to the home page...',
        });
        router.push('/');
        router.refresh();
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password: formData.password,
        options: {
          emailRedirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/auth`
              : undefined,
          data: {
            full_name: formData.name.trim(),
            phone: formData.phone.trim() || null,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await supabase.from('profiles').upsert(
          {
            user_id: data.user.id,
            full_name: formData.name.trim(),
            email,
            phone: formData.phone.trim() || null,
            role: 'user',
          },
          { onConflict: 'user_id' }
        );
      }

      if (data.session) {
        toast({
          title: 'Account created',
          description: 'Your account is ready.',
        });
        router.push('/');
        router.refresh();
        return;
      }

      // If no session, email confirmation is required but SMTP may not be configured
      // Auto-signin the user to allow immediate access
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (signInError) {
        throw new Error('Account created but unable to sign in. Please contact support.');
      }

      if (signInData.session) {
        toast({
          title: 'Account created',
          description: 'Your account is ready.',
        });
        router.push('/');
        router.refresh();
        return;
      }
    } catch (error) {
      toast({
        title: isLogin ? 'Unable to sign in' : 'Unable to create account',
        description: getAuthErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#f6f5f1]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/dark.mp4"
          className="h-full w-full object-cover opacity-80"
        >
          <source src="/dark.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <Link
        href="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[#eb6239] backdrop-blur-sm transition-all hover:bg-white/20 hover:text-[#d65229]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="flex flex-1 items-center justify-center p-4">
        <div
          className="flex flex-col items-center rounded-2xl p-8 text-center shadow-2xl backdrop-blur-lg"
          style={{
            backgroundColor: '#f6f5f1',
            border: '2px solid #264143',
            boxShadow: '3px 4px 0px 1px #eec78e',
            borderRadius: '20px',
          }}
        >
          <p className="mb-2 text-2xl font-extrabold text-[#264143]">
            {isLogin ? 'SIGN IN' : 'SIGN UP'}
          </p>
          <p className="mb-6 max-w-[290px] text-sm text-[#264143]/75">
            {isLogin
              ? 'Use the verified email you registered with.'
              : 'Create your account to get started.'}
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-5"
          >
            {!isLogin && (
              <div className="flex flex-col text-left">
                <label className="mb-1 font-semibold text-[#264143]">
                  Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3.5 text-[#264143]"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-[290px] rounded-md border-2 border-[#264143] p-3 pl-10 outline-none shadow-[3px_4px_0px_1px_#eec78e] transition-all focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#eec78e]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col text-left">
              <label className="mb-1 font-semibold text-[#264143]">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3.5 text-[#264143]"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-[290px] rounded-md border-2 border-[#264143] p-3 pl-10 outline-none shadow-[3px_4px_0px_1px_#eec78e] transition-all focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#eec78e]"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex flex-col text-left">
                <label className="mb-1 font-semibold text-[#264143]">
                  Phone Number{' '}
                  <span className="text-xs text-[#264143]/60">(optional)</span>
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3.5 text-[#264143]"
                    size={18}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-[290px] rounded-md border-2 border-[#264143] p-3 pl-10 outline-none shadow-[3px_4px_0px_1px_#eec78e] transition-all focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#eec78e]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col text-left">
              <label className="mb-1 font-semibold text-[#264143]">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-[#264143]"
                  size={18}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-[290px] rounded-md border-2 border-[#264143] p-3 pl-10 pr-10 outline-none shadow-[3px_4px_0px_1px_#eec78e] transition-all focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#eec78e]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-3 text-[#264143] hover:text-[#eb6239]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex flex-col text-left">
                <label className="mb-1 font-semibold text-[#264143]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3.5 text-[#264143]"
                    size={18}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-[290px] rounded-md border-2 border-[#264143] p-3 pl-10 pr-10 outline-none shadow-[3px_4px_0px_1px_#eec78e] transition-all focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#eec78e]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    className="absolute right-3 top-3 text-[#264143] hover:text-[#eb6239]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-[290px] rounded-lg bg-[#eb6239] py-3 font-extrabold text-white shadow-[3px_3px_0px_0px_#eec78e] transition-all hover:opacity-90 active:translate-y-[3px] disabled:opacity-60"
            >
              {isSubmitting
                ? 'Please wait...'
                : isLogin
                  ? 'SIGN IN'
                  : 'SIGN UP'}
            </button>

            <p className="mt-3 text-sm font-medium text-[#264143]">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-bold text-[#25abc2] hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
