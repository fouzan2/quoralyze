'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

import { FormBuilderSidebar } from '@/components/forms/builder/FormBuilderSidebar';
import { FormBuilderCanvas } from '@/components/forms/builder/FormBuilderCanvas';
import { FormBuilderToolbar } from '@/components/forms/builder/FormBuilderToolbar';
import { FormPreviewModal } from '@/components/forms/builder/FormPreviewModal';
import { QuestionSettingsPanel } from '@/components/forms/builder/QuestionSettingsPanel';
import { SortableQuestionItem } from '@/components/forms/builder/SortableQuestionItem';
import { QuestionLibraryItem } from '@/components/forms/builder/QuestionLibraryItem';
import { useHydratedUIStore } from '@/hooks/use-ui-store';
import { formsApi } from '@/lib/api';
import { generateId } from '@/lib/utils';
import type { FormQuestion, QuestionType, FormBuilderState } from '@/types/form-builder';

// Helper functions for question defaults
const getDefaultQuestionTitle = (type: QuestionType): string => {
  const titles: Record<QuestionType, string> = {
    'short-text': 'Short Answer Question',
    'long-text': 'Long Answer Question',
    'multiple-choice': 'Multiple Choice Question',
    'checkboxes': 'Checkbox Question',
    'dropdown': 'Dropdown Question',
    'rating': 'Rating Question',
    'nps': 'Net Promoter Score',
    'file-upload': 'File Upload',
    'date': 'Date Question',
    'email': 'Email Address',
    'phone': 'Phone Number',
    'website': 'Website URL',
    'number': 'Number Question',
    'section': 'Section Break',
  };
  return titles[type] || 'New Question';
};

const getDefaultQuestionOptions = (type: QuestionType): string[] | undefined => {
  if (['multiple-choice', 'checkboxes', 'dropdown'].includes(type)) {
    return ['Option 1', 'Option 2', 'Option 3'];
  }
  return undefined;
};

const getDefaultQuestionSettings = (type: QuestionType): Record<string, any> => {
  const baseSettings = { placeholder: '', helpText: '' };
  
  switch (type) {
    case 'rating':
      return { ...baseSettings, scale: 5, labels: { low: 'Poor', high: 'Excellent' } };
    case 'nps':
      return { ...baseSettings, scale: 10 };
    case 'file-upload':
      return { ...baseSettings, acceptedTypes: [], maxSize: 10 };
    default:
      return baseSettings;
  }
};

export default function FormBuilderPage() {
  const params = useParams();
  const { setFormBuilderActive } = useHydratedUIStore();
  const queryClient = useQueryClient();
  const formId = params.id as string;

  // Builder state
  const [builderState, setBuilderState] = useState<FormBuilderState>({
    questions: [],
    selectedQuestionId: null,
    isDragging: false,
    activeId: null,
    showPreview: false,
    showSettings: false,
  });

  // Local storage key for temporary saving
  const storageKey = `form-builder-${formId}`;

  // Fetch form data if editing existing form
  const { data: formData, isLoading } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => formId !== 'new' ? formsApi.get(formId) : null,
    enabled: formId !== 'new',
  });

  // Save form mutation
  const saveFormMutation = useMutation({
    mutationFn: async (data: { questions: FormQuestion[] }) => {
      // Save to localStorage immediately for temporary storage
      localStorage.setItem(storageKey, JSON.stringify(data.questions));
      
      if (formId === 'new') {
        return formsApi.create({
          title: 'Untitled Form',
          questions: data.questions,
        });
      }
      return formsApi.update(formId, { questions: data.questions });
    },
    onSuccess: () => {
      toast.success('Form saved successfully');
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
    onError: (error) => {
      toast.error('Auto-saved locally. Will sync when online.');
      console.error('Save error:', error);
    },
  });

  // Initialize form data
  useEffect(() => {
    // Try to load from localStorage first for temporary storage
    const savedQuestions = localStorage.getItem(storageKey);
    
    if (savedQuestions) {
      try {
        const questions = JSON.parse(savedQuestions);
        setBuilderState(prev => ({
          ...prev,
          questions: questions,
        }));
      } catch (error) {
        console.error('Failed to parse saved questions:', error);
      }
    } else if (formData) {
      // Handle both direct response and wrapped response from API
      let questions: FormQuestion[] = [];
      
      if (Array.isArray(formData)) {
        questions = formData;
      } else if ((formData as any)?.questions) {
        questions = (formData as any).questions;
      } else if ((formData as any)?.data?.questions) {
        questions = (formData as any).data.questions;
      }
      
      setBuilderState(prev => ({
        ...prev,
        questions: questions,
      }));
    }
  }, [formData, storageKey]);

  // Auto-save functionality - save every 3 seconds
  useEffect(() => {
    if (builderState.questions.length === 0) return; // Don't save empty forms
    
    const timer = setTimeout(() => {
      saveFormMutation.mutate({ questions: builderState.questions });
    }, 3000);

    return () => clearTimeout(timer);
  }, [builderState.questions]); // saveFormMutation is stable from useMutation

  // Set form builder active state on mount and cleanup on unmount
  useEffect(() => {
    setFormBuilderActive(true);
    
    return () => {
      setFormBuilderActive(false);
    };
  }, [setFormBuilderActive]);

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setBuilderState(prev => ({
      ...prev,
      activeId: event.active.id,
      isDragging: true,
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setBuilderState(prev => ({
      ...prev,
      activeId: null,
      isDragging: false,
    }));

    if (!over) return;

    // Handle dropping new question from sidebar
    if (active.data.current?.type === 'question-type') {
      const questionType = active.id as QuestionType;
      const newQuestion: FormQuestion = {
        id: generateId(),
        type: questionType,
        title: getDefaultQuestionTitle(questionType),
        required: false,
        options: getDefaultQuestionOptions(questionType),
        settings: getDefaultQuestionSettings(questionType),
      };

      const dropIndex = over.data.current?.sortable?.index ?? builderState.questions.length;
      
      setBuilderState(prev => {
        const newQuestions = [...prev.questions];
        newQuestions.splice(dropIndex, 0, newQuestion);
        return {
          ...prev,
          questions: newQuestions,
          selectedQuestionId: newQuestion.id,
        };
      });
    }

    // Handle reordering existing questions
    if (active.data.current?.type === 'question' && over.data.current?.type === 'question') {
      const oldIndex = builderState.questions.findIndex(q => q.id === active.id);
      const newIndex = builderState.questions.findIndex(q => q.id === over.id);

      if (oldIndex !== newIndex) {
        setBuilderState(prev => ({
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex),
        }));
      }
    }
  };

  // Question management
  const updateQuestion = (questionId: string, updates: Partial<FormQuestion>) => {
    setBuilderState(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setBuilderState(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
      selectedQuestionId: prev.selectedQuestionId === questionId ? null : prev.selectedQuestionId,
    }));
  };

  const duplicateQuestion = (questionId: string) => {
    const question = builderState.questions.find(q => q.id === questionId);
    if (!question) return;

    const duplicatedQuestion: FormQuestion = {
      ...question,
      id: generateId(),
      title: `${question.title} (Copy)`,
    };

    const questionIndex = builderState.questions.findIndex(q => q.id === questionId);
    
    setBuilderState(prev => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(questionIndex + 1, 0, duplicatedQuestion);
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  };

  const selectQuestion = (questionId: string | null) => {
    setBuilderState(prev => ({
      ...prev,
      selectedQuestionId: questionId,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Left Sidebar - Question Library */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200 flex-shrink-0 shadow-sm">
          <FormBuilderSidebar />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
            <FormBuilderToolbar
              onPreview={() => setBuilderState(prev => ({ ...prev, showPreview: true }))}
              onSettings={() => setBuilderState(prev => ({ ...prev, showSettings: true }))}
              onSave={() => saveFormMutation.mutate({ questions: builderState.questions })}
              isSaving={saveFormMutation.isPending}
              formId={formId}
            />
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto">
            <SortableContext
              items={builderState.questions.map(q => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <FormBuilderCanvas
                questions={builderState.questions}
                selectedQuestionId={builderState.selectedQuestionId}
                onSelectQuestion={selectQuestion}
                onUpdateQuestion={updateQuestion}
                onDeleteQuestion={deleteQuestion}
                onDuplicateQuestion={duplicateQuestion}
              />
            </SortableContext>
          </div>
        </div>

        {/* Right Sidebar - Question Settings */}
        {builderState.selectedQuestionId && (
          <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-slate-200 flex-shrink-0 shadow-sm">
            <QuestionSettingsPanel
              question={builderState.questions.find(q => q.id === builderState.selectedQuestionId)!}
              onUpdate={(updates) => updateQuestion(builderState.selectedQuestionId!, updates)}
              onClose={() => selectQuestion(null)}
            />
          </div>
        )}

        {/* Drag Overlay */}
        <DragOverlay>
          {builderState.activeId ? (
            // Check if it's a question type being dragged from sidebar
            typeof builderState.activeId === 'string' && 
            ['short-text', 'long-text', 'multiple-choice', 'checkboxes', 'dropdown', 'rating', 'nps', 'file-upload', 'date', 'email', 'phone', 'website', 'number', 'section'].includes(builderState.activeId) ? (
              <div className="transform rotate-3 scale-105 shadow-xl">
                <QuestionLibraryItem type={builderState.activeId as QuestionType} />
              </div>
            ) : (
              <div className="transform rotate-1 scale-105 shadow-xl">
                <SortableQuestionItem
                  question={builderState.questions.find(q => q.id === builderState.activeId)!}
                  isSelected={false}
                  onSelect={() => {}}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  onDuplicate={() => {}}
                />
              </div>
            )
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <FormPreviewModal
        open={builderState.showPreview}
        onClose={() => setBuilderState(prev => ({ ...prev, showPreview: false }))}
        questions={builderState.questions}
      />
    </div>
  );
} 