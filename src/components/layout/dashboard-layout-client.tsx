'use client';

import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { useHydratedUIStore } from '@/hooks/use-ui-store';
import { cn } from '@/lib/utils';

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

export function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const { formBuilderActive } = useHydratedUIStore();

  return (
    <>
      {/* Sidebar - conditionally rendered */}
      <div className={cn(
        'transition-all duration-300 ease-in-out',
        formBuilderActive ? 'w-0 overflow-hidden' : 'flex-shrink-0'
      )}>
        {!formBuilderActive && <DashboardSidebar />}
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - conditionally rendered */}
        {!formBuilderActive && <DashboardHeader />}
        
        {/* Page content */}
        <main className={cn(
          'flex-1 overflow-auto transition-all duration-300 ease-in-out',
          formBuilderActive ? 'p-0' : ''
        )}>
          {formBuilderActive ? (
            children
          ) : (
            <div className="container max-w-screen-2xl p-6">
              {children}
            </div>
          )}
        </main>
      </div>
    </>
  );
} 