'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Brain,
  Zap,
  Users,
  Bot,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useHydratedUIStore } from '@/hooks/use-ui-store';
import { ROUTES } from '@/lib/constants';

const navigation = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    description: 'Overview & metrics'
  },
  {
    name: 'Forms',
    href: ROUTES.FORMS,
    icon: MessageSquare,
    description: 'Feedback forms'
  },
  {
    name: 'Feedback',
    href: '/dashboard/feedback',
    icon: Users,
    description: 'Customer feedback',
    badge: 'AI'
  },
  {
    name: 'AI Insights',
    href: '/dashboard/insights',
    icon: Brain,
    description: 'AI recommendations',
    badge: 'New',
    badgeColor: 'bg-purple-100 text-purple-700'
  },
  {
    name: 'Analytics',
    href: ROUTES.ANALYTICS,
    icon: BarChart3,
    description: 'Performance data'
  },
];

const aiFeatures = [
  {
    name: 'AI Form Builder',
    href: '/dashboard/ai-builder',
    icon: Bot,
    description: 'Generate forms with AI',
    badge: 'Beta'
  },
  {
    name: 'Smart Analytics',
    href: '/dashboard/smart-analytics',
    icon: TrendingUp,
    description: 'AI-powered insights',
    comingSoon: true
  },
  {
    name: 'Auto-Responses',
    href: '/dashboard/auto-responses',
    icon: Zap,
    description: 'Automated feedback replies',
    comingSoon: true
  },
];

const bottomNavigation = [
  {
    name: 'Settings',
    href: ROUTES.SETTINGS,
    icon: Settings,
    description: 'Account settings'
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, openModal } = useHydratedUIStore();

  const renderNavItem = (item: any, isComingSoon = false) => {
    const isActive = pathname === item.href || 
      (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));
    
    const NavContent = (
      <span
        className={cn(
          'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors relative',
          isActive
            ? 'bg-primary text-primary-foreground'
            : isComingSoon
            ? 'text-muted-foreground/50 cursor-not-allowed'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          sidebarCollapsed && 'justify-center'
        )}
      >
        <item.icon
          className={cn(
            'h-5 w-5 shrink-0',
            !sidebarCollapsed && 'mr-3'
          )}
        />
        {!sidebarCollapsed && (
          <div className="flex-1 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span>{item.name}</span>
                {item.badge && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-xs px-1.5 py-0.5 h-auto',
                      item.badgeColor || 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
                {isComingSoon && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto bg-gray-100 text-gray-600">
                    Soon
                  </Badge>
                )}
              </div>
              {item.description && (
                <div className="text-xs text-muted-foreground/70 mt-0.5">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        )}
      </span>
    );

    if (isComingSoon) {
      return (
        <div key={item.name} className="cursor-not-allowed">
          {NavContent}
        </div>
      );
    }

    return (
      <Link key={item.name} href={item.href}>
        {NavContent}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-card border-r transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        {!sidebarCollapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Quoralyze</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-8"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Quick Action */}
      <div className="p-4">
        <Button
          onClick={() => openModal('createForm')}
          className={cn(
            'w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
            sidebarCollapsed && 'px-2'
          )}
        >
          <Sparkles className="h-4 w-4" />
          {!sidebarCollapsed && <span className="ml-2">AI Form Builder</span>}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2">
        <div className="space-y-1">
          {navigation.map((item) => renderNavItem(item))}
        </div>

        {/* AI Features Section */}
        {!sidebarCollapsed && (
          <>
            <div className="mt-6 px-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Features
              </h3>
            </div>
            <div className="space-y-1">
              {aiFeatures.map((item) => renderNavItem(item, item.comingSoon))}
            </div>
          </>
        )}

        {/* Bottom Navigation */}
        <div className="mt-auto space-y-1 pt-4">
          <Separator className="mb-4" />
          {bottomNavigation.map((item) => renderNavItem(item))}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4">
        {!sidebarCollapsed && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">AI Powered</span>
            </div>
            <p className="text-xs text-purple-700 leading-relaxed">
              Advanced sentiment analysis and automated insights for your feedback.
            </p>
          </div>
        )}
        <div className={cn(
          'text-xs text-muted-foreground',
          sidebarCollapsed && 'text-center'
        )}>
          {sidebarCollapsed ? '©' : '© 2024 Quoralyze'}
        </div>
      </div>
    </div>
  );
} 