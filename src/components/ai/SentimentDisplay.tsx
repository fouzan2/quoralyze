'use client';

import React from 'react';
import { Smile, Frown, Meh, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SentimentAnalysis } from '@/lib/mock-data';

interface SentimentDisplayProps {
  sentiment: SentimentAnalysis;
  detailed?: boolean;
  className?: string;
}

export function SentimentDisplay({ 
  sentiment, 
  detailed = false, 
  className = '' 
}: SentimentDisplayProps) {
  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-600 bg-green-50 border-green-200';
    if (score < -0.3) return 'text-red-600 bg-red-50 border-red-200';
    if (score < -0.1) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getSentimentIcon = (polarity: string, score: number) => {
    const iconClass = "w-5 h-5";
    switch (polarity) {
      case 'positive': 
        return <Smile className={`${iconClass} text-green-600`} />;
      case 'negative': 
        return <Frown className={`${iconClass} text-red-600`} />;
      case 'mixed':
        return score > 0 
          ? <TrendingUp className={`${iconClass} text-blue-600`} />
          : <TrendingDown className={`${iconClass} text-orange-600`} />;
      default: 
        return <Meh className={`${iconClass} text-blue-600`} />;
    }
  };

  const formatPolarity = (polarity: string) => {
    return polarity.charAt(0).toUpperCase() + polarity.slice(1);
  };

  if (!detailed) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        {getSentimentIcon(sentiment.overall, sentiment.score)}
        <span className={`font-medium px-2 py-1 rounded-full text-sm border ${getSentimentColor(sentiment.score)}`}>
          {formatPolarity(sentiment.overall)}
        </span>
        <span className="text-sm text-muted-foreground">
          ({Math.round(sentiment.confidence * 100)}%)
        </span>
      </div>
    );
  }

  const topEmotions = Object.entries(sentiment.emotions)
    .filter(([, value]) => value && value > 0.1)
    .sort(([, a], [, b]) => (b || 0) - (a || 0))
    .slice(0, 3);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            {getSentimentIcon(sentiment.overall, sentiment.score)}
            <span>Sentiment Analysis</span>
          </CardTitle>
          <Badge 
            variant="outline" 
            className={getSentimentColor(sentiment.score)}
          >
            {formatPolarity(sentiment.overall)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Sentiment Score</span>
            <span className={sentiment.score > 0 ? 'text-green-600' : sentiment.score < 0 ? 'text-red-600' : 'text-blue-600'}>
              {sentiment.score > 0 ? '+' : ''}{(sentiment.score * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                sentiment.score > 0 
                  ? 'bg-green-500' 
                  : sentiment.score < 0 
                  ? 'bg-red-500' 
                  : 'bg-blue-500'
              }`}
              style={{ 
                width: `${Math.abs(sentiment.score) * 50 + 50}%`,
                marginLeft: sentiment.score < 0 ? '0%' : `${50 - Math.abs(sentiment.score) * 50}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
          </div>
        </div>

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Confidence</span>
            <span className="text-muted-foreground">
              {Math.round(sentiment.confidence * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${sentiment.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Top Emotions */}
        {topEmotions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Top Emotions</h4>
            <div className="grid grid-cols-1 gap-2">
              {topEmotions.map(([emotion, value]) => (
                <div key={emotion} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-muted-foreground">
                    {emotion}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(value || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {Math.round((value || 0) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {sentiment.topics && sentiment.topics.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Key Topics</h4>
            <div className="flex flex-wrap gap-2">
              {sentiment.topics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs ${
                    topic.sentiment > 0.2
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : topic.sentiment < -0.2
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {topic.name} ({topic.mentions})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 