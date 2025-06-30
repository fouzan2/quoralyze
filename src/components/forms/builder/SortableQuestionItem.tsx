'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Settings,
  Copy,
  Trash,
  Plus,
  Minus,
  Star,
  FileUp,
  Type,
  AlignLeft,
  Circle,
  CheckSquare,
  ChevronDown,
  Calendar,
  Mail,
  Phone,
  Globe,
  Hash,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { FormQuestion, QuestionType } from '@/types/form-builder';

const QUESTION_ICONS = {
  'short-text': Type,
  'long-text': AlignLeft,
  'multiple-choice': Circle,
  'checkboxes': CheckSquare,
  'dropdown': ChevronDown,
  'rating': Star,
  'nps': Star,
  'file-upload': FileUp,
  'date': Calendar,
  'email': Mail,
  'phone': Phone,
  'website': Globe,
  'number': Hash,
  'section': Minus,
};

interface SortableQuestionItemProps {
  question: FormQuestion;
  isSelected: boolean;
  onSelect: (questionId: string | null) => void;
  onUpdate: (questionId: string, updates: Partial<FormQuestion>) => void;
  onDelete: (questionId: string) => void;
  onDuplicate: (questionId: string) => void;
}

export function SortableQuestionItem({
  question,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
}: SortableQuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(question.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    data: {
      type: 'question',
      question,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const QuestionIcon = QUESTION_ICONS[question.type];

  const handleTitleSave = () => {
    onUpdate(question.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(question.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate(question.id, { options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
    onUpdate(question.id, { options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index) || [];
    onUpdate(question.id, { options: newOptions });
  };

  const renderQuestionPreview = () => {
    switch (question.type) {
      case 'short-text':
      case 'email':
      case 'phone':
      case 'website':
      case 'number':
        return (
          <Input 
            placeholder={question.settings?.placeholder || 'Enter your answer...'} 
            disabled 
            className="bg-muted"
          />
        );

      case 'long-text':
        return (
          <Textarea 
            placeholder={question.settings?.placeholder || 'Enter your answer...'} 
            disabled 
            rows={question.settings?.rows || 4}
            className="bg-muted"
          />
        );

      case 'multiple-choice':
      case 'checkboxes':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={cn(
                  'w-4 h-4 border border-input rounded',
                  question.type === 'checkboxes' ? 'rounded-sm' : 'rounded-full'
                )} />
                {isSelected ? (
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1"
                    onBlur={() => {}}
                  />
                ) : (
                  <span className="flex-1">{option}</span>
                )}
                {isSelected && question.options!.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {isSelected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={addOption}
                className="text-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add option
              </Button>
            )}
          </div>
        );

      case 'dropdown':
        return (
          <div className="relative">
            <select className="w-full p-2 border border-input rounded-md bg-muted" disabled>
              <option>Choose an option...</option>
              {question.options?.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'rating':
        const scale = question.settings?.scale || 5;
        return (
          <div className="flex gap-1">
            {Array.from({ length: scale }, (_, i) => (
              <Star key={i} className="w-6 h-6 text-muted-foreground" />
            ))}
          </div>
        );

      case 'nps':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Not at all likely</span>
              <span>Extremely likely</span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 11 }, (_, i) => (
                <Button key={i} variant="outline" size="sm" disabled className="w-10 h-10">
                  {i}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'file-upload':
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted">
            <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
          </div>
        );

      case 'date':
        return (
          <Input type="date" disabled className="bg-muted w-fit" />
        );

      case 'section':
        return (
          <div className="border-t border-muted-foreground/25 pt-4">
            <div className="text-lg font-medium">{question.title}</div>
            {question.description && (
              <div className="text-sm text-muted-foreground mt-1">{question.description}</div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group transition-all duration-200',
        isSelected && 'ring-2 ring-primary',
        isDragging && 'opacity-50',
        'hover:shadow-md'
      )}
      onClick={() => onSelect(isSelected ? null : question.id)}
    >
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="flex items-start gap-3 mb-4">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Question Icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mt-1">
            <QuestionIcon className="w-4 h-4 text-primary" />
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
              {isEditing ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleKeyPress}
                  className="font-medium"
                  autoFocus
                />
              ) : (
                <h3
                  className="font-medium cursor-pointer hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  {question.title}
                </h3>
              )}
              
              {question.required && (
                <Badge variant="secondary" className="text-xs">
                  Required
                </Badge>
              )}
            </div>

            {/* Description */}
            {question.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {question.description}
              </p>
            )}

            {/* Question Preview */}
            {question.type !== 'section' && (
              <div className="space-y-3">
                {renderQuestionPreview()}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(question.id);
              }}
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onDuplicate(question.id)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(question.id)}
                  className="text-destructive"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Required Toggle (when selected) */}
        {isSelected && question.type !== 'section' && (
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Label htmlFor={`required-${question.id}`} className="text-sm">
              Required field
            </Label>
            <Switch
              id={`required-${question.id}`}
              checked={question.required}
              onCheckedChange={(checked) => onUpdate(question.id, { required: checked })}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 