import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';
import { Building2, Home, Users, BarChart3, Settings, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function BuilderDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verifyAuthToken(token);

  if (!payload) {
    redirect('/auth');
  }

  await connectDB();
  const user = await User.findById(payload.userId);

  if (!user || user.role !== 'builder') {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Builder Portal</h1>
            <p className="text-sm text-gray-500">{user.name}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/list-property" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Post Project</span>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-600 text-sm">Active Projects</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Home className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-600 text-sm">Total Units</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-600 text-sm">Inquiries</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <p className="text-gray-600 text-sm">Sold Units</p>
          </div>
        </div>

        {/* Main Features */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/list-property" className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-3">
                <div className="bg-orange-500 p-3 rounded-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Launch New Project</h3>
                  <p className="text-sm text-gray-600">Create and list a new construction project</p>
                </div>
              </div>
            </Link>

            <Link href="/profile/my-ads" className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-3">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Projects</h3>
                  <p className="text-sm text-gray-600">Update and manage your active projects</p>
                </div>
              </div>
            </Link>

            <Link href="/search" className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-3">
                <div className="bg-green-500 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Market Insights</h3>
                  <p className="text-sm text-gray-600">View market trends and competitor analysis</p>
                </div>
              </div>
            </Link>

            <Link href="/profile" className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-3">
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Company Settings</h3>
                  <p className="text-sm text-gray-600">Manage company profile and preferences</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-3 text-gray-600">
            <p className="flex items-start space-x-3">
              <span className="text-orange-600 font-bold">1.</span>
              <span>Complete your company profile with details, certifications, and portfolio</span>
            </p>
            <p className="flex items-start space-x-3">
              <span className="text-orange-600 font-bold">2.</span>
              <span>Launch your first project with detailed specifications and unit information</span>
            </p>
            <p className="flex items-start space-x-3">
              <span className="text-orange-600 font-bold">3.</span>
              <span>Manage inquiries and track customer interactions</span>
            </p>
            <p className="flex items-start space-x-3">
              <span className="text-orange-600 font-bold">4.</span>
              <span>Monitor project performance and sales metrics</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
