'use client';

import { useState } from 'react';
import { X, Plus, Minus, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { FormQuestion } from '@/types/form-builder';

interface QuestionSettingsPanelProps {
  question: FormQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onClose: () => void;
}

export function QuestionSettingsPanel({
  question,
  onUpdate,
  onClose,
}: QuestionSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('general');

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index) || [];
    onUpdate({ options: newOptions });
  };

  const updateSetting = (key: string, value: any) => {
    onUpdate({
      settings: {
        ...question.settings,
        [key]: value,
      },
    });
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="question-title">Question Title *</Label>
          <Input
            id="question-title"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter question title..."
          />
        </div>

        <div>
          <Label htmlFor="question-description">Description (Optional)</Label>
          <Textarea
            id="question-description"
            value={question.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Add helpful context or instructions..."
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="required-toggle">Required field</Label>
          <Switch
            id="required-toggle"
            checked={question.required}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
          />
        </div>
      </div>

      {/* Question-specific settings */}
      {['multiple-choice', 'checkboxes', 'dropdown'].includes(question.type) && (
        <>
          <Separator />
          <div>
            <Label className="text-base font-medium">Answer Options</Label>
            <div className="space-y-2 mt-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {question.options!.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        </>
      )}

      {question.type === 'rating' && (
        <>
          <Separator />
          <div className="space-y-4">
            <Label className="text-base font-medium">Rating Settings</Label>
            <div>
              <Label htmlFor="rating-scale">Rating Scale</Label>
              <Select
                value={question.settings?.scale?.toString() || '5'}
                onValueChange={(value) => updateSetting('scale', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">1 to 3</SelectItem>
                  <SelectItem value="5">1 to 5</SelectItem>
                  <SelectItem value="7">1 to 7</SelectItem>
                  <SelectItem value="10">1 to 10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rating-style">Style</Label>
              <Select
                value={question.settings?.style || 'stars'}
                onValueChange={(value) => updateSetting('style', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stars">Stars</SelectItem>
                  <SelectItem value="numbers">Numbers</SelectItem>
                  <SelectItem value="emoji">Emoji</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      {question.type === 'file-upload' && (
        <>
          <Separator />
          <div className="space-y-4">
            <Label className="text-base font-medium">File Upload Settings</Label>
            <div>
              <Label htmlFor="max-size">Maximum File Size (MB)</Label>
              <Input
                id="max-size"
                type="number"
                value={question.settings?.maxSize || 10}
                onChange={(e) => updateSetting('maxSize', parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="allowed-types">Allowed File Types</Label>
              <Input
                id="allowed-types"
                value={question.settings?.allowedTypes?.join(', ') || ''}
                onChange={(e) => updateSetting('allowedTypes', e.target.value.split(', '))}
                placeholder="image/*, .pdf, .doc, .docx"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      {/* Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Validation Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['short-text', 'long-text', 'email', 'phone', 'website'].includes(question.type) && (
            <div>
              <Label htmlFor="placeholder">Placeholder Text</Label>
              <Input
                id="placeholder"
                value={question.settings?.placeholder || ''}
                onChange={(e) => updateSetting('placeholder', e.target.value)}
                placeholder="Enter placeholder text..."
              />
            </div>
          )}

          {question.type === 'number' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-value">Minimum Value</Label>
                  <Input
                    id="min-value"
                    type="number"
                    value={question.settings?.min || ''}
                    onChange={(e) => updateSetting('min', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="max-value">Maximum Value</Label>
                  <Input
                    id="max-value"
                    type="number"
                    value={question.settings?.max || ''}
                    onChange={(e) => updateSetting('max', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}

          {question.type === 'long-text' && (
            <div>
              <Label htmlFor="text-rows">Number of Rows</Label>
              <Input
                id="text-rows"
                type="number"
                value={question.settings?.rows || 4}
                onChange={(e) => updateSetting('rows', parseInt(e.target.value))}
                min="2"
                max="10"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logic (Coming Soon) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Conditional Logic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-sm">Coming Soon</div>
            <div className="text-xs mt-1">
              Show/hide questions based on responses
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Question Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="general" className="mt-0">
              {renderGeneralSettings()}
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              {renderAdvancedSettings()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 