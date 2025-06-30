'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Globe, 
  Smartphone, 
  MessageSquare,
  Brain,
  Tag,
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SentimentDisplay } from '@/components/ai/SentimentDisplay';
import { AIInsightsCard } from '@/components/ai/AIInsightsCard';
import { mockFeedback, type FeedbackItem } from '@/lib/mock-data';
import { ROUTES } from '@/lib/constants';

export default function FeedbackDetailsPage() {
  const params = useParams();
  const feedbackId = params.id as string;

  // Fetch feedback details - in real app, this would call the Django API
  const { data: feedback, isLoading, error } = useQuery({
    queryKey: ['feedback', feedbackId],
    queryFn: async () => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const item = mockFeedback.find(f => f.id === feedbackId);
      if (!item) throw new Error('Feedback not found');
      return item as FeedbackItem;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="skeleton h-8 w-8 rounded" />
          <div className="skeleton h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-64 w-full rounded-lg" />
            <div className="skeleton h-32 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="skeleton h-48 w-full rounded-lg" />
            <div className="skeleton h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Feedback not found</h2>
        <p className="text-muted-foreground mb-4">
          The feedback item you're looking for doesn't exist or has been removed.
        </p>
        <Link href={ROUTES.FORMS}>
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feedback
          </Button>
        </Link>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug': return 'text-red-600 bg-red-50 border-red-200';
      case 'feature': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'improvement': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'complaint': return 'text-red-600 bg-red-50 border-red-200';
      case 'praise': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={ROUTES.FORMS}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feedback
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{feedback.title}</h1>
            <p className="text-muted-foreground">
              Feedback #{feedback.id} • {new Date(feedback.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={getCategoryColor(feedback.category)}>
            <Tag className="w-3 h-3 mr-1" />
            {feedback.category}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(feedback.priority)}>
            {feedback.priority} priority
          </Badge>
          <Badge variant="outline" className={getStatusColor(feedback.status)}>
            {feedback.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Feedback Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Feedback Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {feedback.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Sentiment Analysis */}
          <SentimentDisplay sentiment={feedback.sentiment} detailed={true} />

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>AI-Generated Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Category</h4>
                  <p className="text-sm text-muted-foreground">{feedback.aiInsights.category}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Issue Identified</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedback.aiInsights.issue}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Impact Assessment</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedback.aiInsights.estimatedImpact}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Recommended Actions</h4>
                  <div className="space-y-2">
                    {feedback.aiInsights.suggestedActions.map((action, index) => (
                      <div 
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Business Area</p>
                    <p className="text-sm capitalize">{feedback.aiInsights.businessArea}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">AI Confidence</p>
                    <p className="text-sm">{Math.round(feedback.aiInsights.confidence * 100)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {feedback.customerInfo.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{feedback.customerInfo.name}</p>
                  <p className="text-sm text-muted-foreground">{feedback.customerInfo.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Segment</span>
                  <Badge variant="outline">{feedback.customerInfo.segment}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account Value</span>
                  <span className="text-sm font-medium">${feedback.customerInfo.accountValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Customer Since</span>
                  <span className="text-sm font-medium">{feedback.customerInfo.tenure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Previous Feedback</span>
                  <span className="text-sm font-medium">{feedback.customerInfo.previousFeedback}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Submission Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <span className="text-sm font-medium capitalize">{feedback.metadata.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Device</span>
                  <div className="flex items-center space-x-1">
                    {feedback.metadata.device === 'mobile' ? (
                      <Smartphone className="w-3 h-3" />
                    ) : (
                      <Globe className="w-3 h-3" />
                    )}
                    <span className="text-sm font-medium capitalize">{feedback.metadata.device}</span>
                  </div>
                </div>
                {feedback.metadata.browser && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Browser</span>
                    <span className="text-sm font-medium">{feedback.metadata.browser}</span>
                  </div>
                )}
                {feedback.metadata.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium">{feedback.metadata.location}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-sm font-medium">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-sm font-medium">
                      {new Date(feedback.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Feedback */}
          {feedback.aiInsights.relatedFeedback.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Related Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.aiInsights.relatedFeedback.map((relatedId) => {
                    const related = mockFeedback.find(f => f.id === relatedId);
                    if (!related) return null;
                    
                    return (
                      <Link 
                        key={relatedId} 
                        href={`/dashboard/feedback/${relatedId}`}
                        className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium line-clamp-1">{related.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {related.content}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {related.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(related.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 