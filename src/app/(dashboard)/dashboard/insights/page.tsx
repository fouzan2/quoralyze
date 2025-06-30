'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Brain, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Users,
  Zap,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIInsightsCard } from '@/components/ai/AIInsightsCard';
import { mockAIInsights } from '@/lib/mock-data';
import toast from 'react-hot-toast';

interface AIInsightItem {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'positive';
  actionItems: string[];
  impact: string;
  timeline: string;
  confidence: number;
  affectedUsers: number;
  businessMetrics: Record<string, any>;
  relatedFeedback: string[];
  createdAt: string;
}

export default function AIInsightsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // Fetch AI insights - in real app, this would call the Django API
  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights', selectedTimeRange, selectedCategory, selectedSeverity],
    queryFn: async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAIInsights as AIInsightItem[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleActionClick = (action: string) => {
    toast.success(`Action initiated: ${action}`);
    // In real app, this would trigger the actual action
  };

  const filteredInsights = insights?.filter(insight => {
    if (selectedCategory !== 'all' && insight.category !== selectedCategory) {
      return false;
    }
    if (selectedSeverity !== 'all' && insight.severity !== selectedSeverity) {
      return false;
    }
    return true;
  }) || [];

  const getSeverityStats = () => {
    if (!insights) return { critical: 0, high: 0, medium: 0, positive: 0 };
    
    return insights.reduce(
      (acc, insight) => {
        acc[insight.severity] = (acc[insight.severity] || 0) + 1;
        return acc;
      },
      { critical: 0, high: 0, medium: 0, positive: 0 } as Record<string, number>
    );
  };

  const severityStats = getSeverityStats();

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '1d': return 'Last 24 hours';
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      default: return 'Last 7 days';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
            <p className="text-muted-foreground">
              AI-powered recommendations and actionable insights from your feedback
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Generate New Insights
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{severityStats.critical}</p>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{severityStats.high}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{severityStats.positive}</p>
                <p className="text-sm text-muted-foreground">Positive Trends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {insights?.reduce((sum, i) => sum + i.affectedUsers, 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Users Affected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Time Range:</label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Category:</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Product Success">Product Success</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="User Experience">User Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Severity:</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto text-sm text-muted-foreground">
              Showing {filteredInsights.length} insights for {getTimeRangeLabel(selectedTimeRange)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredInsights.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No insights available</h3>
              <p className="text-muted-foreground mb-4">
                No AI insights match your current filters. Try adjusting your criteria or generate new insights.
              </p>
              <Button>
                <Zap className="w-4 h-4 mr-2" />
                Generate Insights
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredInsights.map((insight) => (
              <div key={insight.id}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Brain className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={
                            insight.severity === 'critical' 
                              ? 'text-red-600 bg-red-50 border-red-200'
                              : insight.severity === 'high'
                              ? 'text-orange-600 bg-orange-50 border-orange-200'
                              : insight.severity === 'positive'
                              ? 'text-green-600 bg-green-50 border-green-200'
                              : 'text-blue-600 bg-blue-50 border-blue-200'
                          }
                        >
                          {insight.severity === 'positive' ? 'Positive' : insight.severity}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Impact and Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Affected Users</p>
                          <p className="text-sm font-medium">{insight.affectedUsers.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Timeline</p>
                          <p className="text-sm font-medium">{insight.timeline}</p>
                        </div>
                      </div>
                    </div>

                    {/* Impact Assessment */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Impact Assessment</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.impact}
                      </p>
                    </div>

                    {/* Action Items */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Recommended Actions</h4>
                      <div className="space-y-2">
                        {insight.actionItems.slice(0, 2).map((action, index) => (
                          <div 
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{action}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleActionClick(action)}
                              className="text-xs px-3 py-1 h-auto"
                            >
                              Take Action
                            </Button>
                          </div>
                        ))}
                        {insight.actionItems.length > 2 && (
                          <Button variant="ghost" size="sm" className="w-full">
                            <ChevronDown className="w-4 h-4 mr-2" />
                            Show {insight.actionItems.length - 2} more actions
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Business Metrics */}
                    {insight.businessMetrics && Object.keys(insight.businessMetrics).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Business Impact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {Object.entries(insight.businessMetrics).map(([key, value]) => (
                            <div key={key} className="text-center p-2 bg-gray-50 rounded">
                              <p className="text-xs text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </p>
                              <p className="text-sm font-medium">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
                      <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                      <span>{insight.relatedFeedback.length} related feedback items</span>
                      <span>Generated {new Date(insight.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
} 