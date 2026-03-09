import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';
import { Home, Users, TrendingUp, Clock, Settings, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function AgentDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verifyAuthToken(token);

  if (!payload) {
    redirect('/auth');
  }

  await connectDB();
  const user = await User.findById(payload.userId);

  if (!user || user.role !== 'agent') {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-sm text-gray-500">{user.name}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/list-property" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-600 text-sm">Properties Listed</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-600 text-sm">Inquiries Received</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-600 text-sm">Properties Sold</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/list-property" className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Post New Property</h3>
              </div>
              <p className="text-sm text-gray-600">List a new property for sale or rent</p>
            </Link>

            <Link href="/profile/my-ads" className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">My Postings</h3>
              </div>
              <p className="text-sm text-gray-600">Manage and track your listings</p>
            </Link>

            <Link href="/profile/liked" className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-red-500 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Opportunities</h3>
              </div>
              <p className="text-sm text-gray-600">View market opportunities</p>
            </Link>

            <Link href="/profile" className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Profile Settings</h3>
              </div>
              <p className="text-sm text-gray-600">Update your agent profile</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
