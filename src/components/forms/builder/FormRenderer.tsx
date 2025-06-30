'use client';

import { useState } from 'react';
import { 
  Star, 
  FileUp, 
  Calendar, 
  Mail, 
  Phone, 
  Globe, 
  Hash,
  Upload,
  Check
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { FormQuestion } from '@/types/form-builder';

interface FormRendererProps {
  questions: FormQuestion[];
  values?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  onSubmit?: (values: Record<string, any>) => void;
  isPreview?: boolean;
}

export function FormRenderer({ 
  questions, 
  values = {}, 
  onChange, 
  onSubmit,
  isPreview = true 
}: FormRendererProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(values);
  const [currentStep, setCurrentStep] = useState(0);

  const updateValue = (questionId: string, value: any) => {
    const newValues = { ...formValues, [questionId]: value };
    setFormValues(newValues);
    onChange?.(newValues);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formValues);
  };

  const renderQuestion = (question: FormQuestion) => {
    const value = formValues[question.id];

    switch (question.type) {
      case 'short-text':
      case 'email':
      case 'phone':
      case 'website':
        return (
          <Input
            type={question.type === 'email' ? 'email' : question.type === 'phone' ? 'tel' : question.type === 'website' ? 'url' : 'text'}
            placeholder={question.settings?.placeholder || 'Enter your answer...'}
            value={value || ''}
            onChange={(e) => updateValue(question.id, e.target.value)}
            required={question.required}
            disabled={isPreview}
          />
        );

      case 'long-text':
        return (
          <Textarea
            placeholder={question.settings?.placeholder || 'Enter your answer...'}
            value={value || ''}
            onChange={(e) => updateValue(question.id, e.target.value)}
            rows={question.settings?.rows || 4}
            required={question.required}
            disabled={isPreview}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={question.settings?.placeholder || 'Enter a number...'}
            value={value || ''}
            onChange={(e) => updateValue(question.id, parseInt(e.target.value))}
            min={question.settings?.min}
            max={question.settings?.max}
            required={question.required}
            disabled={isPreview}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => updateValue(question.id, e.target.value)}
            required={question.required}
            disabled={isPreview}
            className="w-fit"
          />
        );

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => updateValue(question.id, e.target.value)}
                  required={question.required}
                  disabled={isPreview}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkboxes':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <Checkbox
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    const newValues = checked 
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    updateValue(question.id, newValues);
                  }}
                  disabled={isPreview}
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Select
            value={value || ''}
            onValueChange={(value) => updateValue(question.id, value)}
            disabled={isPreview}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'rating':
        const scale = question.settings?.scale || 5;
        const style = question.settings?.style || 'stars';
        
        if (style === 'stars') {
          return (
            <div className="flex gap-1">
              {Array.from({ length: scale }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => updateValue(question.id, i + 1)}
                  disabled={isPreview}
                  className="focus:outline-none"
                >
                  <Star 
                    className={cn(
                      'w-6 h-6 transition-colors',
                      (value || 0) > i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
            </div>
          );
        } else {
          return (
            <div className="flex gap-2">
              {Array.from({ length: scale }, (_, i) => (
                <Button
                  key={i}
                  type="button"
                  variant={value === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateValue(question.id, i + 1)}
                  disabled={isPreview}
                  className="w-10 h-10"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          );
        }

      case 'nps':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Not at all likely</span>
              <span>Extremely likely</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 11 }, (_, i) => (
                <Button
                  key={i}
                  type="button"
                  variant={value === i ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateValue(question.id, i)}
                  disabled={isPreview}
                  className="w-10 h-10 flex-shrink-0"
                >
                  {i}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'file-upload':
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/50">
            <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">
                {question.settings?.allowedTypes?.join(', ') || 'Any file type'} 
                {question.settings?.maxSize && ` (max ${question.settings.maxSize}MB)`}
              </p>
            </div>
            {!isPreview && (
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                multiple={question.settings?.multiple}
                accept={question.settings?.allowedTypes?.join(',')}
                onChange={(e) => updateValue(question.id, e.target.files)}
              />
            )}
          </div>
        );

      case 'section':
        return (
          <div className="py-6">
            <Separator className="mb-6" />
            <div>
              <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
              {question.description && (
                <p className="text-muted-foreground">{question.description}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Form Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-3">Untitled Form</h1>
        <p className="text-muted-foreground">
          Please fill out this form with your feedback and thoughts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Questions */}
        {questions.map((question) => {
          if (question.type === 'section') {
            return <div key={question.id}>{renderQuestion(question)}</div>;
          }

          return (
            <Card key={question.id} className="border-l-4 border-l-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Question Title */}
                  <div>
                    <Label className="text-base font-medium">
                      {question.title}
                      {question.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </Label>
                    {question.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {question.description}
                      </p>
                    )}
                  </div>

                  {/* Question Input */}
                  <div>{renderQuestion(question)}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Submit Button */}
        {!isPreview && questions.length > 0 && (
          <div className="flex justify-center pt-6">
            <Button type="submit" size="lg" className="min-w-32">
              Submit Form
            </Button>
          </div>
        )}

        {/* Preview Footer */}
        {isPreview && questions.length > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4" />
                This is a preview - form submissions are disabled
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
} 