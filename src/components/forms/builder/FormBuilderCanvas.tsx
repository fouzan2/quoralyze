'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

import { SortableQuestionItem } from './SortableQuestionItem';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FormQuestion } from '@/types/form-builder';

interface FormBuilderCanvasProps {
  questions: FormQuestion[];
  selectedQuestionId: string | null;
  onSelectQuestion: (questionId: string | null) => void;
  onUpdateQuestion: (questionId: string, updates: Partial<FormQuestion>) => void;
  onDeleteQuestion: (questionId: string) => void;
  onDuplicateQuestion: (questionId: string) => void;
}

export function FormBuilderCanvas({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
}: FormBuilderCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
    data: {
      type: 'canvas',
    },
  });

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-3xl mx-auto p-8">
        <div
          ref={setNodeRef}
          className={cn(
            'min-h-[600px] space-y-6',
            isOver && 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4'
          )}
        >
          {/* Form Header */}
          <Card className="mb-8 shadow-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Untitled Form</h1>
                <p className="text-gray-600 max-w-lg mx-auto">
                  Add a description to help respondents understand your form.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <SortableContext
            items={questions.map(q => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((question) => (
              <SortableQuestionItem
                key={question.id}
                question={question}
                isSelected={selectedQuestionId === question.id}
                onSelect={onSelectQuestion}
                onUpdate={onUpdateQuestion}
                onDelete={onDeleteQuestion}
                onDuplicate={onDuplicateQuestion}
              />
            ))}
          </SortableContext>

          {/* Empty State */}
          {questions.length === 0 && (
            <Card className="border-dashed border-2 border-gray-300 bg-white">
              <CardContent className="p-16 text-center">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Plus className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Start building your form</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Drag question types from the sidebar to start building your form. 
                  You can reorder questions by dragging them up or down.
                </p>
                <div className="text-sm text-gray-500">
                  Tip: Click on any question to edit its settings
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drop Indicator */}
          {isOver && questions.length > 0 && (
            <div className="h-3 bg-blue-200 rounded-full animate-pulse border border-blue-300" />
          )}
        </div>
      </div>
    </div>
  );
} 