import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';
import { Heart, MapPin, Clock, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default async function UserDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verifyAuthToken(token);

  if (!payload) {
    redirect('/auth');
  }

  await connectDB();
  const user = await User.findById(payload.userId);

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
            <p className="text-sm text-gray-500">Buyer Dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/list-property" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Post Property
            </Link>
            <Link href="/profile" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Liked Properties Card */}
          <Link href="/profile/liked" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-gray-500">View all</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Liked Properties</h3>
            <p className="text-sm text-gray-600 mt-2">Your saved favorite properties</p>
          </Link>

          {/* My Profile Card */}
          <Link href="/profile" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Edit</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
            <p className="text-sm text-gray-600 mt-2">Manage your personal information</p>
          </Link>

          {/* Search Properties Card */}
          <Link href="/search" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Browse</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Search Properties</h3>
            <p className="text-sm text-gray-600 mt-2">Explore available properties</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Looking to buy or rent?</p>
              <Link href="/search" className="text-blue-600 font-semibold hover:text-blue-700 mt-2 inline-block">
                Search Properties →
              </Link>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Want to post your property?</p>
              <Link href="/list-property" className="text-green-600 font-semibold hover:text-green-700 mt-2 inline-block">
                List Property →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
