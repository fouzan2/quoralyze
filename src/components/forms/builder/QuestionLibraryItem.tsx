'use client';

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
  BarChart3,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { QuestionType } from '@/types/form-builder';

const QUESTION_ICONS = {
  'short-text': Type,
  'long-text': AlignLeft,
  'multiple-choice': Circle,
  'checkboxes': CheckSquare,
  'dropdown': ChevronDown,
  'rating': Star,
  'nps': BarChart3,
  'file-upload': FileUp,
  'date': Calendar,
  'email': Mail,
  'phone': Phone,
  'website': Globe,
  'number': Hash,
  'section': Minus,
};

const QUESTION_LABELS = {
  'short-text': 'Short Text',
  'long-text': 'Long Text',
  'multiple-choice': 'Multiple Choice',
  'checkboxes': 'Checkboxes',
  'dropdown': 'Dropdown',
  'rating': 'Rating Scale',
  'nps': 'NPS Score',
  'file-upload': 'File Upload',
  'date': 'Date',
  'email': 'Email',
  'phone': 'Phone',
  'website': 'Website',
  'number': 'Number',
  'section': 'Section Break',
};

interface QuestionLibraryItemProps {
  type: QuestionType;
}

export function QuestionLibraryItem({ type }: QuestionLibraryItemProps) {
  const Icon = QUESTION_ICONS[type];
  const label = QUESTION_LABELS[type];

  return (
    <Card className="w-64 shadow-lg opacity-90">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{label}</div>
            <div className="text-xs text-muted-foreground">
              Drop to add to form
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 