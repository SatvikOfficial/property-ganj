import BuilderDashboardContent from '@/components/Dashboard/BuilderDashboardContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Builder Dashboard | PropertyGanj',
  description: 'Manage your property inventory and leads.',
};

export default function BuilderDashboardPage() {
  return <BuilderDashboardContent />;
}
