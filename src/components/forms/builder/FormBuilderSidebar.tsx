'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Type, 
  AlignLeft, 
  CheckSquare, 
  Circle, 
  ChevronDown, 
  Star, 
  FileUp, 
  Calendar,
  Mail,
  Phone,
  Globe,
  Hash,
  Minus,
  Search,
  BarChart3,
  Sparkles,
  Zap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { QuestionType, QuestionTypeConfig } from '@/types/form-builder';

const QUESTION_TYPES: QuestionTypeConfig[] = [
  // Basic
  { type: 'short-text', label: 'Short Text', description: 'Single line text input', icon: 'Type', category: 'basic', hasOptions: false, hasSettings: true },
  { type: 'long-text', label: 'Long Text', description: 'Multi-line text area', icon: 'AlignLeft', category: 'basic', hasOptions: false, hasSettings: true },
  { type: 'email', label: 'Email', description: 'Email address input', icon: 'Mail', category: 'basic', hasOptions: false, hasSettings: true },
  { type: 'phone', label: 'Phone', description: 'Phone number input', icon: 'Phone', category: 'basic', hasOptions: false, hasSettings: true },
  { type: 'website', label: 'Website', description: 'URL input field', icon: 'Globe', category: 'basic', hasOptions: false, hasSettings: true },
  { type: 'number', label: 'Number', description: 'Numeric input field', icon: 'Hash', category: 'basic', hasOptions: false, hasSettings: true },
  { type: 'date', label: 'Date', description: 'Date picker field', icon: 'Calendar', category: 'basic', hasOptions: false, hasSettings: true },

  // Choice
  { type: 'multiple-choice', label: 'Multiple Choice', description: 'Single selection from options', icon: 'Circle', category: 'choice', hasOptions: true, hasSettings: true },
  { type: 'checkboxes', label: 'Checkboxes', description: 'Multiple selection options', icon: 'CheckSquare', category: 'choice', hasOptions: true, hasSettings: true },
  { type: 'dropdown', label: 'Dropdown', description: 'Select from dropdown list', icon: 'ChevronDown', category: 'choice', hasOptions: true, hasSettings: true },

  // Rating
  { type: 'rating', label: 'Rating Scale', description: 'Star or numeric rating', icon: 'Star', category: 'rating', hasOptions: false, hasSettings: true },
  { type: 'nps', label: 'NPS Score', description: 'Net Promoter Score (0-10)', icon: 'BarChart3', category: 'rating', hasOptions: false, hasSettings: true },

  // Advanced
  { type: 'file-upload', label: 'File Upload', description: 'Upload documents or images', icon: 'FileUp', category: 'advanced', hasOptions: false, hasSettings: true },

  // Layout
  { type: 'section', label: 'Section Break', description: 'Organize form sections', icon: 'Minus', category: 'layout', hasOptions: false, hasSettings: true },
];

const CATEGORIES = [
  { id: 'basic', label: 'Basic Fields', icon: Type, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 'choice', label: 'Choice Fields', icon: CheckSquare, color: 'text-green-600', bgColor: 'bg-green-50' },
  { id: 'rating', label: 'Rating Fields', icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { id: 'advanced', label: 'Advanced Fields', icon: FileUp, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { id: 'layout', label: 'Layout Elements', icon: Minus, color: 'text-gray-600', bgColor: 'bg-gray-50' },
];

const ICON_MAP = {
  Type, AlignLeft, CheckSquare, Circle, ChevronDown, Star, FileUp, Calendar, Mail, Phone, Globe, Hash, Minus, BarChart3
};

interface DraggableQuestionTypeProps {
  config: QuestionTypeConfig;
}

function DraggableQuestionType({ config }: DraggableQuestionTypeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: config.type,
    data: {
      type: 'question-type',
      questionType: config.type,
    },
  });

  const Icon = ICON_MAP[config.icon as keyof typeof ICON_MAP];
  const category = CATEGORIES.find(cat => cat.id === config.category);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'group relative flex items-center gap-3 p-3 rounded-xl border-2 bg-white hover:bg-slate-50 transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:scale-[1.02] active:scale-95',
        isDragging ? 'opacity-50 shadow-xl scale-105' : 'border-slate-200 hover:border-slate-300'
      )}
    >
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
        category?.bgColor || 'bg-blue-50'
      )}>
        <Icon className={cn('w-4 h-4', category?.color || 'text-blue-600')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-slate-900 group-hover:text-slate-800 transition-colors">
          {config.label}
        </div>
        <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
          {config.description}
        </div>
      </div>
      {config.hasOptions && (
        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
          Options
        </Badge>
      )}
    </div>
  );
}

export function FormBuilderSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['basic', 'choice']);

  const filteredQuestionTypes = QUESTION_TYPES.filter(config =>
    config.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    config.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const hasSearchResults = filteredQuestionTypes.length > 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/80">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Add Questions</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search question types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-slate-200 bg-white/80 backdrop-blur-sm focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {!hasSearchResults && searchQuery ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">No question types found</p>
            <p className="text-xs text-slate-400 mt-1">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="space-y-4">
            {CATEGORIES.map(category => {
              const categoryQuestions = filteredQuestionTypes.filter(q => q.category === category.id);
              if (categoryQuestions.length === 0 && !searchQuery) return null;

              const CategoryIcon = category.icon;
              const isExpanded = expandedCategories.includes(category.id) || !!searchQuery;

              return (
                <div key={category.id} className="space-y-2">
                  {!searchQuery && (
                    <Button
                      variant="ghost"
                      onClick={() => toggleCategory(category.id)}
                      className="w-full justify-between p-3 h-auto font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn('w-5 h-5 rounded-md flex items-center justify-center', category.bgColor)}>
                          <CategoryIcon className={cn('w-3 h-3', category.color)} />
                        </div>
                        {category.label}
                        <Badge variant="outline" className="text-xs">
                          {categoryQuestions.length}
                        </Badge>
                      </div>
                      <ChevronDown className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        isExpanded && 'transform rotate-180'
                      )} />
                    </Button>
                  )}

                  {isExpanded && categoryQuestions.length > 0 && (
                    <div className="space-y-2 pl-1">
                      {categoryQuestions.map(config => (
                        <DraggableQuestionType key={config.type} config={config} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/80 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-3 h-3 text-amber-500" />
          <span className="text-xs font-medium text-slate-600">Pro Tip</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Drag question types to your form canvas to add them. Reorder by dragging questions up or down.
        </p>
      </div>
    </div>
  );
} 