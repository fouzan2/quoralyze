import { Metadata } from 'next';
import { ModalsProvider } from '@/components/layout/modals-provider';
import { DashboardLayoutClient } from '@/components/layout/dashboard-layout-client';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: `%s | Dashboard | ${APP_NAME}`,
  },
  description: 'Manage your feedback forms and analytics',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
      
      {/* Global Modals */}
      <ModalsProvider />
    </div>
  );
} 