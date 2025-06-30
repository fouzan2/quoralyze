'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MessageSquare, FileText, Users, Zap } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHydratedUIStore } from '@/hooks/use-ui-store';
import { formsApi } from '@/lib/api';

const createFormSchema = z.object({
  title: z.string().min(1, 'Form title is required').max(100, 'Title is too long'),
  description: z.string().optional(),
  template: z.string().optional(),
});

type CreateFormData = z.infer<typeof createFormSchema>;

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  preview: string[];
}

const templates: FormTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Form',
    description: 'Start from scratch with a blank form',
    icon: FileText,
    preview: ['Custom questions', 'Full customization'],
  },
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction',
    description: 'Collect feedback about your product or service',
    icon: Users,
    preview: ['Rating scale questions', 'NPS score', 'Comments'],
  },
  {
    id: 'event-feedback',
    name: 'Event Feedback',
    description: 'Gather feedback from event attendees',
    icon: MessageSquare,
    preview: ['Event rating', 'Speaker evaluation', 'Suggestions'],
  },
  {
    id: 'product-feedback',
    name: 'Product Feedback',
    description: 'Get insights about your product features',
    icon: Zap,
    preview: ['Feature rating', 'Usage patterns', 'Improvement ideas'],
  },
];

export function CreateFormModal() {
  const { modals, closeModal } = useHydratedUIStore();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [step, setStep] = useState<'template' | 'details'>('template');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateFormData>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      template: 'blank',
    },
  });

  const createFormMutation = useMutation({
    mutationFn: (data: CreateFormData & { template: string }) => 
      formsApi.create({
        title: data.title,
        description: data.description || '',
        template: data.template,
        questions: [], // Start with empty questions - user will add them in form builder
        settings: {
          theme: {
            primaryColor: '#3b82f6',
            backgroundColor: '#ffffff',
            fontFamily: 'system-ui',
            buttonStyle: 'solid',
          },
          notifications: {
            emailNotification: true,
            emailRecipients: [],
          },
          submission: {
            allowMultiple: false,
            requireAuth: false,
            successMessage: 'Thank you for your submission!',
            autoClose: false,
            autoCloseDelay: 5,
          },
          branding: {
            showLogo: true,
            removeBranding: false,
          },
        },
      }),
    onSuccess: (data) => {
      toast.success('Form created successfully!');
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      closeModal('createForm');
      reset();
      setStep('template');
      setSelectedTemplate('blank');
      
      // Navigate to form builder
      window.location.href = `/dashboard/forms/builder/${(data as any)?.id || 'new'}`;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create form');
    },
  });

  const onSubmit = (data: CreateFormData) => {
    createFormMutation.mutate({
      ...data,
      template: selectedTemplate,
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep('details');
  };

  const handleClose = () => {
    closeModal('createForm');
    reset();
    setStep('template');
    setSelectedTemplate('blank');
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={modals.createForm} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'template' ? 'Choose a Template' : 'Create New Form'}
          </DialogTitle>
          <DialogDescription>
            {step === 'template' 
              ? 'Select a template to get started quickly, or start with a blank form.'
              : 'Add a title and description for your new feedback form.'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'template' ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{template.name}</CardTitle>
                      </div>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {template.preview.map((item, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            • {item}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep('details')} disabled={!selectedTemplate}>
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 py-4">
              {/* Selected Template Info */}
              {selectedTemplateData && (
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <selectedTemplateData.icon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{selectedTemplateData.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedTemplateData.description}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep('template')}
                  >
                    Change
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Form Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter form title..."
                  {...register('title')}
                  error={!!errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this form is for..."
                  rows={3}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setStep('template')}>
                Back
              </Button>
              <Button
                type="submit"
                loading={createFormMutation.isPending}
                disabled={createFormMutation.isPending}
              >
                Create Form
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 