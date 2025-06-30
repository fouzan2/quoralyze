'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, MessageSquare, TrendingUp, Users, Eye, Brain, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyticsApi } from '@/lib/api';
import { useHydratedUIStore } from '@/hooks/use-ui-store';
import { SentimentDisplay } from '@/components/ai/SentimentDisplay';
import { AIInsightsCard } from '@/components/ai/AIInsightsCard';
import { mockAnalytics, mockAIInsights, mockFeedback } from '@/lib/mock-data';

interface OverviewData {
  totalForms?: number;
  totalResponses?: number;
  averageResponseRate?: number;
  totalViews?: number;
}

export default function DashboardPage() {
  const { openModal } = useHydratedUIStore();

  // Fetch dashboard overview data
  const { data: overviewResponse, isLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsApi.overview as () => Promise<OverviewData>,
  });

  // Fetch recent AI insights
  const { data: recentInsights } = useQuery({
    queryKey: ['ai-insights', 'recent'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAIInsights.slice(0, 2);
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch recent feedback
  const { data: recentFeedback } = useQuery({
    queryKey: ['feedback', 'recent'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockFeedback.slice(0, 3);
    },
    staleTime: 5 * 60 * 1000,
  });

  const overview: OverviewData = (overviewResponse as { data?: OverviewData })?.data || (overviewResponse as OverviewData) || {};

  const stats = [
    {
      title: 'Total Forms',
      value: overview.totalForms || 0,
      description: 'Active feedback forms',
      icon: MessageSquare,
      trend: '+12%',
      trendLabel: 'from last month',
      color: 'text-blue-600',
    },
    {
      title: 'Total Responses',
      value: mockAnalytics.totalFeedback,
      description: 'Responses collected',
      icon: Users,
      trend: `+${mockAnalytics.trends.growth}%`,
      trendLabel: 'from last week',
      color: 'text-green-600',
    },
    {
      title: 'AI Insights',
      value: mockAIInsights.length,
      description: 'Generated this week',
      icon: Brain,
      trend: '+3',
      trendLabel: 'new insights',
      color: 'text-purple-600',
    },
    {
      title: 'Avg Sentiment',
      value: `${Math.round((mockFeedback.reduce((sum, f) => sum + f.sentiment.score, 0) / mockFeedback.length) * 100 + 50)}%`,
      description: 'Overall positivity',
      icon: TrendingUp,
      trend: mockAnalytics.trends.sentimentTrend > 0 ? `+${(mockAnalytics.trends.sentimentTrend * 100).toFixed(1)}%` : `${(mockAnalytics.trends.sentimentTrend * 100).toFixed(1)}%`,
      trendLabel: 'sentiment improvement',
      color: mockAnalytics.trends.sentimentTrend > 0 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your AI-powered feedback analysis.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => openModal('createForm')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
          <Button>
            <Brain className="mr-2 h-4 w-4" />
            Generate Insights
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
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
                <p className={`text-xs mt-1 ${stat.color}`}>
                  {stat.trend} {stat.trendLabel}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sentiment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Sentiment Overview</span>
          </CardTitle>
          <CardDescription>
            AI-powered sentiment analysis of recent feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(mockAnalytics.sentimentDistribution).map(([sentiment, percentage]) => (
              <div key={sentiment} className="text-center">
                <div className={`text-2xl font-bold ${
                  sentiment === 'positive' ? 'text-green-600' :
                  sentiment === 'negative' ? 'text-red-600' :
                  sentiment === 'mixed' ? 'text-orange-600' :
                  'text-blue-600'
                }`}>
                  {percentage}%
                </div>
                <p className="text-sm text-muted-foreground capitalize">{sentiment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <span>Recent AI Insights</span>
              </CardTitle>
              <Link href="/dashboard/insights">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>
              Latest AI-generated recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInsights?.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-purple-50 rounded-lg">
                    {insight.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Brain className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          insight.severity === 'critical' 
                            ? 'text-red-600 bg-red-50 border-red-200'
                            : insight.severity === 'high'
                            ? 'text-orange-600 bg-orange-50 border-orange-200'
                            : 'text-blue-600 bg-blue-50 border-blue-200'
                        }`}
                      >
                        {insight.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {insight.affectedUsers} users affected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-sm font-semibold">Generating insights...</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI is analyzing your feedback to generate actionable insights.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>Recent Feedback</span>
              </CardTitle>
              <Link href="/dashboard/feedback">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>
              Latest customer feedback with AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentFeedback?.map((feedback) => (
              <Link 
                key={feedback.id}
                href={`/dashboard/feedback/${feedback.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm line-clamp-1">{feedback.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        feedback.category === 'bug' ? 'text-red-600 bg-red-50 border-red-200' :
                        feedback.category === 'feature' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                        feedback.category === 'praise' ? 'text-green-600 bg-green-50 border-green-200' :
                        'text-gray-600 bg-gray-50 border-gray-200'
                      }`}
                    >
                      {feedback.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {feedback.content}
                  </p>
                  <SentimentDisplay sentiment={feedback.sentiment} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{feedback.customerInfo.name}</span>
                    <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            )) || (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-sm font-semibold">No recent feedback</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first form to start collecting feedback.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with these common tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start space-y-2"
            onClick={() => openModal('createForm')}
          >
            <Plus className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Create New Form</div>
              <div className="text-sm text-muted-foreground">
                AI-powered form builder
              </div>
            </div>
          </Button>

          <Link href="/dashboard/analytics">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 w-full"
            >
              <TrendingUp className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">View Analytics</div>
                <div className="text-sm text-muted-foreground">
                  AI sentiment analysis
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/insights">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 w-full"
            >
              <Brain className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">AI Insights</div>
                <div className="text-sm text-muted-foreground">
                  Actionable recommendations
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/feedback">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 w-full"
            >
              <MessageSquare className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Manage Feedback</div>
                <div className="text-sm text-muted-foreground">
                  Review and respond
                </div>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
} 