// Mock data for AI-powered feedback analysis platform

export interface FeedbackItem {
  id: string;
  title: string;
  content: string;
  category: 'bug' | 'feature' | 'improvement' | 'complaint' | 'praise';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  sentiment: SentimentAnalysis;
  aiInsights: AIInsights;
  customerInfo: CustomerInfo;
  metadata: FeedbackMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral' | 'mixed';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  emotions: {
    joy?: number;
    sadness?: number;
    anger?: number;
    fear?: number;
    surprise?: number;
    disgust?: number;
    frustration?: number;
    confusion?: number;
    satisfaction?: number;
    disappointment?: number;
  };
  topics?: Array<{
    name: string;
    sentiment: number;
    mentions: number;
    keywords: string[];
  }>;
}

export interface AIInsights {
  category: string;
  issue: string;
  suggestedActions: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedImpact: string;
  relatedFeedback: string[];
  confidence: number;
  businessArea: 'product' | 'service' | 'ui-ux' | 'performance' | 'pricing' | 'support';
}

export interface CustomerInfo {
  name: string;
  email: string;
  segment: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
  accountValue: number;
  tenure: string;
  previousFeedback: number;
}

export interface FeedbackMetadata {
  source: 'web-form' | 'email' | 'chat' | 'phone' | 'survey';
  device: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  location?: string;
  userAgent?: string;
  sessionId?: string;
}

// Mock feedback data
export const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    title: 'Dashboard loading is extremely slow',
    content: 'The dashboard takes over 30 seconds to load every morning. This is really frustrating when I need to check our metrics quickly before meetings. The loading spinner just keeps spinning and sometimes it times out completely. This has been happening for the past week.',
    category: 'bug',
    priority: 'high',
    status: 'open',
    sentiment: {
      overall: 'negative',
      score: -0.7,
      confidence: 0.92,
      emotions: {
        frustration: 0.8,
        anger: 0.6,
        disappointment: 0.7,
        confusion: 0.3,
      },
      topics: [
        { name: 'Performance', sentiment: -0.8, mentions: 3, keywords: ['slow', 'loading', 'timeout'] },
        { name: 'Dashboard', sentiment: -0.6, mentions: 2, keywords: ['dashboard', 'metrics'] },
      ]
    },
    aiInsights: {
      category: 'Performance Issues',
      issue: 'Critical dashboard performance degradation affecting daily workflows',
      suggestedActions: [
        'Investigate dashboard API response times',
        'Implement dashboard performance monitoring',
        'Consider adding loading states with progress indicators',
        'Optimize database queries for metrics aggregation'
      ],
      priority: 'critical',
      estimatedImpact: 'High - affecting daily user productivity and satisfaction',
      relatedFeedback: ['3', '7'],
      confidence: 0.87,
      businessArea: 'performance',
    },
    customerInfo: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      segment: 'Professional',
      accountValue: 2400,
      tenure: '18 months',
      previousFeedback: 3,
    },
    metadata: {
      source: 'web-form',
      device: 'desktop',
      browser: 'Chrome 120',
      location: 'San Francisco, CA',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_abc123',
    },
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },
  {
    id: '2',
    title: 'Love the new AI insights feature!',
    content: 'The new AI insights feature is absolutely amazing! It\'s helping us identify patterns in customer feedback that we never would have caught manually. The sentiment analysis is spot-on and the suggested actions are really practical. This is exactly what we needed to improve our product development process.',
    category: 'praise',
    priority: 'medium',
    status: 'open',
    sentiment: {
      overall: 'positive',
      score: 0.85,
      confidence: 0.94,
      emotions: {
        joy: 0.9,
        satisfaction: 0.8,
        surprise: 0.6,
      },
      topics: [
        { name: 'AI Features', sentiment: 0.9, mentions: 4, keywords: ['AI', 'insights', 'sentiment analysis'] },
        { name: 'Product Development', sentiment: 0.7, mentions: 2, keywords: ['product', 'development', 'process'] },
      ]
    },
    aiInsights: {
      category: 'Feature Success',
      issue: 'AI insights feature receiving positive reception and driving value',
      suggestedActions: [
        'Document this success story for marketing materials',
        'Expand AI insights capabilities based on positive feedback',
        'Reach out for potential case study opportunity',
        'Consider featuring this feedback in product updates'
      ],
      priority: 'medium',
      estimatedImpact: 'Positive - validates AI feature investment and direction',
      relatedFeedback: ['5', '8'],
      confidence: 0.91,
      businessArea: 'product',
    },
    customerInfo: {
      name: 'Michael Chen',
      email: 'michael.chen@innovate.io',
      segment: 'Enterprise',
      accountValue: 12000,
      tenure: '2 years',
      previousFeedback: 8,
    },
    metadata: {
      source: 'email',
      device: 'desktop',
      browser: 'Safari 17',
      location: 'Austin, TX',
      sessionId: 'sess_def456',
    },
    createdAt: '2024-01-14T14:22:00Z',
    updatedAt: '2024-01-14T14:22:00Z',
  },
  {
    id: '3',
    title: 'Mobile app crashes when uploading files',
    content: 'Every time I try to upload a file through the mobile app, it crashes immediately. I\'ve tried different file types and sizes, but it happens consistently. This is blocking me from submitting important feedback while I\'m on the go.',
    category: 'bug',
    priority: 'urgent',
    status: 'in-progress',
    sentiment: {
      overall: 'negative',
      score: -0.6,
      confidence: 0.88,
      emotions: {
        frustration: 0.7,
        disappointment: 0.6,
        confusion: 0.4,
      },
      topics: [
        { name: 'Mobile App', sentiment: -0.8, mentions: 2, keywords: ['mobile app', 'crashes'] },
        { name: 'File Upload', sentiment: -0.7, mentions: 3, keywords: ['upload', 'file', 'blocking'] },
      ]
    },
    aiInsights: {
      category: 'Critical Bug',
      issue: 'Mobile app file upload functionality completely broken',
      suggestedActions: [
        'Immediate investigation of mobile file upload system',
        'Test across different mobile devices and OS versions',
        'Implement crash reporting for mobile app',
        'Provide temporary workaround for affected users'
      ],
      priority: 'critical',
      estimatedImpact: 'Critical - blocking core functionality for mobile users',
      relatedFeedback: ['1'],
      confidence: 0.93,
      businessArea: 'product',
    },
    customerInfo: {
      name: 'Amanda Rodriguez',
      email: 'amanda.r@startup.co',
      segment: 'Starter',
      accountValue: 348,
      tenure: '6 months',
      previousFeedback: 2,
    },
    metadata: {
      source: 'chat',
      device: 'mobile',
      browser: 'Mobile Safari',
      location: 'New York, NY',
      sessionId: 'sess_ghi789',
    },
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
  },
  {
    id: '4',
    title: 'Suggestion: Dark mode for better accessibility',
    content: 'I spend long hours analyzing feedback data and the bright interface strains my eyes. A dark mode would be incredibly helpful for users like me who work in low-light environments or have light sensitivity. Many other analytics tools offer this feature.',
    category: 'feature',
    priority: 'medium',
    status: 'open',
    sentiment: {
      overall: 'neutral',
      score: 0.2,
      confidence: 0.85,
      emotions: {
        satisfaction: 0.3,
        frustration: 0.4,
      },
      topics: [
        { name: 'Accessibility', sentiment: 0.6, mentions: 2, keywords: ['accessibility', 'dark mode', 'eyes'] },
        { name: 'User Experience', sentiment: 0.3, mentions: 3, keywords: ['interface', 'environment', 'tools'] },
      ]
    },
    aiInsights: {
      category: 'Accessibility Enhancement',
      issue: 'User requesting dark mode for improved accessibility and comfort',
      suggestedActions: [
        'Add dark mode to product roadmap',
        'Research accessibility standards for dark themes',
        'Survey users about dark mode interest',
        'Evaluate implementation effort and priority'
      ],
      priority: 'medium',
      estimatedImpact: 'Medium - improves accessibility and user comfort',
      relatedFeedback: [],
      confidence: 0.82,
      businessArea: 'ui-ux',
    },
    customerInfo: {
      name: 'David Kim',
      email: 'david.kim@analytica.com',
      segment: 'Professional',
      accountValue: 1800,
      tenure: '14 months',
      previousFeedback: 5,
    },
    metadata: {
      source: 'web-form',
      device: 'desktop',
      browser: 'Firefox 121',
      location: 'Seattle, WA',
      sessionId: 'sess_jkl012',
    },
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
  },
];

// Mock analytics data
export const mockAnalytics = {
  totalFeedback: 1247,
  sentimentDistribution: {
    positive: 42,
    negative: 31,
    neutral: 22,
    mixed: 5,
  },
  trends: {
    thisWeek: 156,
    lastWeek: 134,
    growth: 16.4,
    sentimentTrend: 0.12, // Improving sentiment
  },
  topCategories: [
    { name: 'User Experience', count: 234, sentiment: -0.2, trend: 'increasing' },
    { name: 'Feature Requests', count: 189, sentiment: 0.3, trend: 'stable' },
    { name: 'Bug Reports', count: 156, sentiment: -0.7, trend: 'decreasing' },
    { name: 'Performance', count: 98, sentiment: -0.4, trend: 'increasing' },
    { name: 'Pricing', count: 67, sentiment: -0.1, trend: 'stable' },
  ],
  customerSegments: {
    'Free': { count: 234, satisfaction: 0.6 },
    'Starter': { count: 445, satisfaction: 0.7 },
    'Professional': { count: 398, satisfaction: 0.8 },
    'Enterprise': { count: 170, satisfaction: 0.85 },
  },
  responseTime: {
    average: 2.4, // days
    trend: -0.3, // improving
  }
};

// Mock AI insights
export const mockAIInsights = [
  {
    id: '1',
    title: 'Performance Issues Trending Upward',
    description: '73% increase in performance-related complaints over the past week, primarily affecting dashboard loading times',
    category: 'Performance',
    severity: 'high',
    actionItems: [
      'Conduct performance audit of dashboard APIs',
      'Implement performance monitoring alerts',
      'Consider caching strategies for frequently accessed data',
      'Review database query optimization'
    ],
    impact: 'High - affecting daily user productivity and could lead to churn',
    timeline: 'This week',
    confidence: 0.87,
    affectedUsers: 234,
    businessMetrics: {
      potentialChurnRisk: 'Medium',
      satisfactionImpact: -0.3,
      revenueAtRisk: '$45,600'
    },
    relatedFeedback: ['1', '3', '7', '12'],
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    title: 'AI Features Driving Strong Positive Sentiment',
    description: 'New AI insights feature receiving overwhelmingly positive feedback with 91% positive sentiment',
    category: 'Product Success',
    severity: 'positive',
    actionItems: [
      'Document success metrics for stakeholder reporting',
      'Expand AI capabilities based on positive reception',
      'Create case studies from satisfied customers',
      'Consider marketing the AI features more prominently'
    ],
    impact: 'Very Positive - validating product strategy and driving satisfaction',
    timeline: 'Last 2 weeks',
    confidence: 0.94,
    affectedUsers: 567,
    businessMetrics: {
      satisfactionBoost: 0.4,
      npsImpact: '+12 points',
      upsellOpportunity: 'High'
    },
    relatedFeedback: ['2', '5', '8', '15'],
    createdAt: '2024-01-14T15:30:00Z',
  },
  {
    id: '3',
    title: 'Mobile Experience Needs Urgent Attention',
    description: 'Mobile app crashes and usability issues reported by 23% of mobile users',
    category: 'Mobile',
    severity: 'critical',
    actionItems: [
      'Emergency mobile app stability review',
      'Implement comprehensive mobile testing suite',
      'Add crash reporting and analytics',
      'Consider mobile-first redesign for key workflows'
    ],
    impact: 'Critical - blocking mobile users from core functionality',
    timeline: 'Immediate',
    confidence: 0.91,
    affectedUsers: 89,
    businessMetrics: {
      potentialChurnRisk: 'High',
      mobileConversionImpact: -45,
      supportTicketIncrease: '+67%'
    },
    relatedFeedback: ['3', '9', '14'],
    createdAt: '2024-01-13T12:00:00Z',
  },
];

// Mock form templates for AI generation
export const mockFormTemplates = [
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction Survey',
    description: 'Comprehensive survey to measure overall customer satisfaction',
    industry: 'General',
    estimatedTime: '5-7 minutes',
    responseRate: '68%',
    questions: [
      {
        type: 'rating',
        title: 'How satisfied are you with our product overall?',
        required: true,
        scale: { min: 1, max: 5, labels: ['Very Dissatisfied', 'Very Satisfied'] }
      },
      {
        type: 'nps',
        title: 'How likely are you to recommend us to a friend or colleague?',
        required: true,
      },
      {
        type: 'textarea',
        title: 'What do you like most about our product?',
        required: false,
      },
      {
        type: 'textarea',
        title: 'What could we improve?',
        required: false,
      }
    ]
  },
  {
    id: 'product-feedback',
    name: 'Product Feature Feedback',
    description: 'Gather specific feedback about product features and functionality',
    industry: 'SaaS',
    estimatedTime: '3-5 minutes',
    responseRate: '72%',
    questions: [
      {
        type: 'radio',
        title: 'Which feature do you use most frequently?',
        required: true,
        options: ['Dashboard', 'Reports', 'Analytics', 'Settings', 'Integrations']
      },
      {
        type: 'checkbox',
        title: 'What features would you like to see improved?',
        required: false,
        options: ['Speed', 'User Interface', 'Mobile Experience', 'Integrations', 'Reporting']
      },
      {
        type: 'scale',
        title: 'How easy is our product to use?',
        required: true,
        scale: { min: 1, max: 10, labels: ['Very Difficult', 'Very Easy'] }
      }
    ]
  }
];

// Business context options for AI form generation
export const businessContextOptions = {
  industries: [
    'SaaS/Technology', 'E-commerce', 'Healthcare', 'Education', 'Financial Services',
    'Real Estate', 'Manufacturing', 'Consulting', 'Non-profit', 'Other'
  ],
  businessTypes: [
    'B2B', 'B2C', 'B2B2C', 'Marketplace', 'Service Provider'
  ],
  companySizes: [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-500 employees', '500+ employees'
  ],
  goals: [
    'Improve customer satisfaction', 'Reduce churn', 'Increase NPS',
    'Gather product feedback', 'Measure service quality', 'Collect testimonials',
    'Understand user needs', 'Validate new features', 'Measure event satisfaction'
  ],
  touchpoints: [
    'After purchase', 'Post-support interaction', 'Regular check-ins',
    'Product updates', 'End of trial', 'Onboarding completion',
    'Before renewal', 'After feature usage', 'Event attendance'
  ]
};

export default {
  mockFeedback,
  mockAnalytics,
  mockAIInsights,
  mockFormTemplates,
  businessContextOptions,
}; 