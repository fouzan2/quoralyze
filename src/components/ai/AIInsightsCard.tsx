'use client';

import React from 'react';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap, 
  Users, 
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AIInsights } from '@/lib/mock-data';

interface AIInsightsCardProps {
  insights: AIInsights;
  compact?: boolean;
  showActions?: boolean;
  onActionClick?: (action: string) => void;
  className?: string;
}

export function AIInsightsCard({ 
  insights, 
  compact = false, 
  showActions = true,
  onActionClick,
  className = '' 
}: AIInsightsCardProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          color: 'text-red-600 bg-red-50 border-red-200',
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'Critical'
        };
      case 'high':
        return {
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          icon: <Zap className="w-4 h-4" />,
          label: 'High'
        };
      case 'medium':
        return {
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          icon: <Info className="w-4 h-4" />,
          label: 'Medium'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Low'
        };
    }
  };

  const getBusinessAreaConfig = (area: string) => {
    switch (area) {
      case 'product':
        return { icon: <Target className="w-4 h-4" />, label: 'Product' };
      case 'performance':
        return { icon: <Zap className="w-4 h-4" />, label: 'Performance' };
      case 'ui-ux':
        return { icon: <Users className="w-4 h-4" />, label: 'UX/UI' };
      case 'service':
        return { icon: <CheckCircle className="w-4 h-4" />, label: 'Service' };
      case 'pricing':
        return { icon: <Target className="w-4 h-4" />, label: 'Pricing' };
      default:
        return { icon: <Info className="w-4 h-4" />, label: 'Support' };
    }
  };

  const priorityConfig = getPriorityConfig(insights.priority);
  const businessAreaConfig = getBusinessAreaConfig(insights.businessArea);

  if (compact) {
    return (
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-3">
            <div className="flex items-start space-x-3 flex-1">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{insights.category}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {insights.issue}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${priorityConfig.color}`}
                  >
                    {priorityConfig.icon}
                    <span className="ml-1">{priorityConfig.label}</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(insights.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{insights.category}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                AI-Generated Insight
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`${priorityConfig.color}`}
            >
              {priorityConfig.icon}
              <span className="ml-1">{priorityConfig.label}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Issue Description */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Issue Identified</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insights.issue}
          </p>
        </div>

        {/* Impact Assessment */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Impact Assessment</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insights.estimatedImpact}
          </p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b">
          <div className="flex items-center space-x-2">
            {businessAreaConfig.icon}
            <div>
              <p className="text-xs text-muted-foreground">Business Area</p>
              <p className="text-sm font-medium">{businessAreaConfig.label}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <div>
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-sm font-medium">{Math.round(insights.confidence * 100)}%</p>
            </div>
          </div>
        </div>

        {/* Action Items */}
        {showActions && insights.suggestedActions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Recommended Actions</h4>
            <div className="space-y-2">
              {insights.suggestedActions.map((action, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground border">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{action}</p>
                  </div>
                  {onActionClick && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onActionClick(action)}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      Take Action
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Feedback */}
        {insights.relatedFeedback.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Related Feedback</h4>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{insights.relatedFeedback.length} similar feedback items</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 