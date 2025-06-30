'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Bot, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Building, 
  Users, 
  Target, 
  Zap,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { businessContextOptions } from '@/lib/mock-data';

const businessContextSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Please select your industry'),
  businessType: z.string().min(1, 'Please select your business type'),
  companySize: z.string().min(1, 'Please select your company size'),
  primaryGoals: z.array(z.string()).min(1, 'Please select at least one goal'),
  feedbackTouchpoints: z.array(z.string()).min(1, 'Please select at least one touchpoint'),
  currentChallenges: z.string().optional(),
  specificRequirements: z.string().optional(),
});

type BusinessContextData = z.infer<typeof businessContextSchema>;

interface AIFormBuilderProps {
  onFormGenerated?: (form: any) => void;
  onClose?: () => void;
}

const STEPS = [
  { 
    id: 'company', 
    title: 'Company Info', 
    description: 'Tell us about your company',
    icon: Building 
  },
  { 
    id: 'goals', 
    title: 'Goals & Objectives', 
    description: 'What do you want to achieve?',
    icon: Target 
  },
  { 
    id: 'touchpoints', 
    title: 'Customer Journey', 
    description: 'When do you collect feedback?',
    icon: Users 
  },
  { 
    id: 'generation', 
    title: 'AI Generation', 
    description: 'Let AI create your form',
    icon: Bot 
  },
];

export function AIFormBuilder({ onFormGenerated, onClose }: AIFormBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<Partial<BusinessContextData>>({});

  const form = useForm<BusinessContextData>({
    resolver: zodResolver(businessContextSchema),
    defaultValues: {
      primaryGoals: [],
      feedbackTouchpoints: [],
    }
  });

  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = form;

  const watchedGoals = watch('primaryGoals') || [];
  const watchedTouchpoints = watch('feedbackTouchpoints') || [];

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateForm = async (data: BusinessContextData) => {
    setIsGenerating(true);
    
    // Mock AI form generation - in real app, this would call the Django API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const generatedForm = {
      id: Date.now().toString(),
      title: `${data.companyName} Feedback Form`,
      description: `Collect valuable feedback to ${data.primaryGoals.join(', ').toLowerCase()}`,
      questions: [
        {
          id: '1',
          type: 'rating',
          title: 'How satisfied are you with our service overall?',
          required: true,
          scale: { min: 1, max: 5, labels: ['Very Dissatisfied', 'Very Satisfied'] }
        },
        {
          id: '2',
          type: 'nps',
          title: 'How likely are you to recommend us to a friend or colleague?',
          required: true,
        },
        {
          id: '3',
          type: 'textarea',
          title: 'What do you like most about our product/service?',
          required: false,
        },
        {
          id: '4',
          type: 'textarea',
          title: 'What could we improve?',
          required: false,
        },
        {
          id: '5',
          type: 'checkbox',
          title: 'Which features are most important to you?',
          required: false,
          options: ['Ease of use', 'Performance', 'Customer support', 'Pricing', 'Integration options']
        }
      ],
      aiContext: data,
      createdAt: new Date().toISOString(),
    };

    setIsGenerating(false);
    onFormGenerated?.(generatedForm);
  };

  const onSubmit = (data: BusinessContextData) => {
    generateForm(data);
  };

  const toggleGoal = (goal: string) => {
    const currentGoals = getValues('primaryGoals') || [];
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    setValue('primaryGoals', newGoals);
  };

  const toggleTouchpoint = (touchpoint: string) => {
    const currentTouchpoints = getValues('feedbackTouchpoints') || [];
    const newTouchpoints = currentTouchpoints.includes(touchpoint)
      ? currentTouchpoints.filter(t => t !== touchpoint)
      : [...currentTouchpoints, touchpoint];
    setValue('feedbackTouchpoints', newTouchpoints);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Company Info
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Enter your company name"
                {...register('companyName')}
                error={!!errors.companyName}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select onValueChange={(value) => setValue('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessContextOptions.industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-destructive">{errors.industry.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Business Type</Label>
                <Select onValueChange={(value) => setValue('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessContextOptions.businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.businessType && (
                  <p className="text-sm text-destructive">{errors.businessType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Company Size</Label>
              <Select onValueChange={(value) => setValue('companySize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {businessContextOptions.companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.companySize && (
                <p className="text-sm text-destructive">{errors.companySize.message}</p>
              )}
            </div>
          </div>
        );

      case 1: // Goals & Objectives
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>What are your primary goals for collecting feedback?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {businessContextOptions.goals.map((goal) => (
                  <div
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      watchedGoals.includes(goal)
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={watchedGoals.includes(goal)}
                      />
                      <span className="text-sm font-medium">{goal}</span>
                    </div>
                  </div>
                ))}
              </div>
              {errors.primaryGoals && (
                <p className="text-sm text-destructive">{errors.primaryGoals.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentChallenges">Current Challenges (Optional)</Label>
              <Textarea
                id="currentChallenges"
                placeholder="Describe any current challenges you're facing with customer feedback..."
                {...register('currentChallenges')}
              />
            </div>
          </div>
        );

      case 2: // Touchpoints
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>When do you want to collect feedback?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {businessContextOptions.touchpoints.map((touchpoint) => (
                  <div
                    key={touchpoint}
                    onClick={() => toggleTouchpoint(touchpoint)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      watchedTouchpoints.includes(touchpoint)
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={watchedTouchpoints.includes(touchpoint)}
                      />
                      <span className="text-sm font-medium">{touchpoint}</span>
                    </div>
                  </div>
                ))}
              </div>
              {errors.feedbackTouchpoints && (
                <p className="text-sm text-destructive">{errors.feedbackTouchpoints.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificRequirements">Specific Requirements (Optional)</Label>
              <Textarea
                id="specificRequirements"
                placeholder="Any specific questions or requirements for your feedback form..."
                {...register('specificRequirements')}
              />
            </div>
          </div>
        );

      case 3: // Generation
        return (
          <div className="space-y-6 text-center">
            {isGenerating ? (
              <>
                <div className="flex justify-center">
                  <div className="p-4 bg-purple-50 rounded-full">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">AI is creating your form...</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzing your business context and generating optimal questions
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Analyzing business context</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Identifying optimal question types</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating personalized questions</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="p-4 bg-purple-50 rounded-full">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Ready to generate your form!</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI will create a customized feedback form based on your business context
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-sm mb-2">Your form will include:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Questions tailored to your industry and goals</li>
                    <li>• Optimal question types for maximum response rates</li>
                    <li>• Smart conditional logic based on best practices</li>
                    <li>• Built-in sentiment analysis capabilities</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">AI Form Builder</CardTitle>
            <p className="text-muted-foreground">
              Let AI create the perfect feedback form for your business
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  index < STEPS.length - 1 ? 'flex-1' : ''
                }`}>
                  <div className={`p-2 rounded-full border-2 transition-all ${
                    isActive 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-gray-50 text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="hidden md:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === STEPS.length - 1 ? (
              <Button
                type="submit"
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Form
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 