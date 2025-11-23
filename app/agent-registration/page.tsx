'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header';
import { Upload, User, Mail, Phone, Lock, Briefcase, MapPin, FileText, Loader2, CheckCircle } from 'lucide-react';

export default function AgentRegistration() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        experience: '',
        specialization: [] as string[],
        languages: '',
        location: '',
        bio: '',
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isUpgrade, setIsUpgrade] = useState(false);
    const [alreadyAgent, setAlreadyAgent] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        if (data.user.role === 'agent') {
                            // User is already an agent, redirect or show message
                            // For now, let's redirect to their profile or home with a message
                            // But user asked for a popup. We can set an error state or just redirect.
                            // Let's redirect to home with a query param that we can handle in a toast if we had one,
                            // or just show a big message here.
                            // Actually, let's just set a state to show a "You are already an agent" view.
                            setAlreadyAgent(true);
                            return;
                        }
                        setIsUpgrade(true);
                        setFormData(prev => ({
                            ...prev,
                            name: data.user.name,
                            email: data.user.email || '',
                            phone: data.user.phone,
                        }));
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        checkUser();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSpecializationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (checked) {
                return { ...prev, specialization: [...prev.specialization, value] };
            } else {
                return { ...prev, specialization: prev.specialization.filter(s => s !== value) };
            }
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let photoUrl = '';

            if (photo) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', photo);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadRes.ok) {
                    throw new Error('Failed to upload photo');
                }

                const uploadData = await uploadRes.json();
                photoUrl = uploadData.url;
            }

            const endpoint = isUpgrade ? '/api/auth/upgrade-agent' : '/api/auth/register';

            const payload = isUpgrade ? {
                agentProfile: {
                    experience: Number(formData.experience),
                    specialization: formData.specialization,
                    languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
                    location: formData.location,
                    bio: formData.bio,
                    photoUrl: photoUrl,
                }
            } : {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: 'agent',
                agentProfile: {
                    experience: Number(formData.experience),
                    specialization: formData.specialization,
                    languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
                    location: formData.location,
                    bio: formData.bio,
                    photoUrl: photoUrl,
                },
            };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/auth?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            {alreadyAgent ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">You are already an Agent!</h2>
                        <p className="text-gray-600 mb-6">
                            You have already registered as an agent on Property Ganj. You can manage your profile and listings from your dashboard.
                        </p>
                        <Link href="/profile" className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="relative pt-10 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-red-50 min-h-[calc(100vh-80px)]">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                                {isUpgrade ? 'Upgrade to' : 'Join Our'} <span className="text-red-600">Agent Network</span>
                            </h1>
                            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                                Connect with thousands of potential buyers and sellers. Grow your business with Property Ganj.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/50">
                            <div className="p-8 sm:p-12">
                                <form className="space-y-8" onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-red-700">{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        {/* Photo Upload */}
                                        <div className="sm:col-span-2 flex flex-col items-center justify-center mb-6">
                                            <div className="relative group cursor-pointer">
                                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                                    {photoPreview ? (
                                                        <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-12 h-12 text-gray-400" />
                                                    )}
                                                </div>
                                                <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition-colors cursor-pointer">
                                                    <Upload className="w-4 h-4" />
                                                </label>
                                                <input
                                                    id="photo-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">Upload Profile Photo</p>
                                        </div>

                                        {/* Personal Details */}
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                                    placeholder="John Doe"
                                                    disabled={isUpgrade}
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                                    placeholder="john@example.com"
                                                    disabled={isUpgrade}
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Phone className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                                    placeholder="+91 98765 43210"
                                                    disabled={isUpgrade}
                                                />
                                            </div>
                                        </div>

                                        {!isUpgrade && (
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                <div className="relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        required
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Professional Details */}
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="number"
                                                    name="experience"
                                                    min="0"
                                                    required
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                                    placeholder="5"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization (Select multiple)</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Residential', 'Commercial', 'Industrial', 'Land', 'Luxury', 'Rentals'].map((spec) => (
                                                    <label key={spec} className="flex items-center space-x-2 cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            value={spec}
                                                            checked={formData.specialization.includes(spec)}
                                                            onChange={handleSpecializationChange}
                                                            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm text-gray-700">{spec}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="languages"
                                                    value={formData.languages}
                                                    onChange={handleChange}
                                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                                    placeholder="English, Hindi, Urdu (comma separated)"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2 relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Operating Location</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPin className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    required
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                                    placeholder="e.g. Gomti Nagar, Lucknow"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2 relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <textarea
                                                    name="bio"
                                                    rows={4}
                                                    value={formData.bio}
                                                    onChange={handleChange}
                                                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                                    placeholder="Tell us about your experience and expertise..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.01]"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                isUpgrade ? 'Upgrade to Agent' : 'Register as Agent'
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-8 text-center">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link href="/auth" className="font-medium text-red-600 hover:text-red-500 hover:underline transition-all">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
