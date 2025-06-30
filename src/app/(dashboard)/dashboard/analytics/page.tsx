'use client';

import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, MessageSquare, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsApi } from '@/lib/api';

export default function AnalyticsPage() {
  // Fetch analytics data
  const { data: analyticsResponse, isLoading } = useQuery({
    queryKey: ['analytics', 'forms'],
    queryFn: analyticsApi.forms as any,
  });

  const analytics = (analyticsResponse as any)?.data || (analyticsResponse as any);

  const stats = [
    {
      title: 'Total Responses',
      value: analytics?.totalResponses || 0,
      description: 'All time responses',
      icon: Users,
      trend: '+12%',
      trendLabel: 'from last month',
    },
    {
      title: 'Active Forms',
      value: analytics?.activeForms || 0,
      description: 'Currently published',
      icon: MessageSquare,
      trend: '+2',
      trendLabel: 'from last month',
    },
    {
      title: 'Average Completion Rate',
      value: `${analytics?.averageCompletionRate || 0}%`,
      description: 'Across all forms',
      icon: TrendingUp,
      trend: '+5.2%',
      trendLabel: 'from last month',
    },
    {
      title: 'Total Views',
      value: analytics?.totalViews || 0,
      description: 'Form page views',
      icon: Eye,
      trend: '+18%',
      trendLabel: 'from last month',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your feedback collection performance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof stat.value === 'number' 
                    ? stat.value.toLocaleString() 
                    : stat.value
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <p className="text-xs text-success-600 mt-1">
                  {stat.trend} {stat.trendLabel}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Response Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Response Trends</CardTitle>
            <CardDescription>
              Daily responses over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Chart component will be implemented here
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Forms</CardTitle>
            <CardDescription>
              Forms with the highest response rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="skeleton h-4 w-4 rounded" />
                    <div className="skeleton h-4 flex-1" />
                    <div className="skeleton h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Sample Form {i + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 100)} responses
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-success-600">
                        {(Math.random() * 20 + 80).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">completion</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Device & Location Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>
              Response distribution by device type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Desktop', value: 65, color: 'bg-primary' },
                { name: 'Mobile', value: 30, color: 'bg-secondary' },
                { name: 'Tablet', value: 5, color: 'bg-muted' },
              ].map((device) => (
                <div key={device.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{device.name}</span>
                    <span>{device.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${device.color} h-2 rounded-full transition-all`}
                      style={{ width: `${device.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest form responses and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">New response to Sample Form {i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 60)} minutes ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 