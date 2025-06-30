'use client';

import { useState } from 'react';
import { X, Smartphone, Monitor, ExternalLink } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormRenderer } from '@/components/forms/builder/FormRenderer';
import { cn } from '@/lib/utils';
import type { FormQuestion } from '@/types/form-builder';

interface FormPreviewModalProps {
  open: boolean;
  onClose: () => void;
  questions: FormQuestion[];
}

export function FormPreviewModal({ open, onClose, questions }: FormPreviewModalProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Form Preview</DialogTitle>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className="h-8 px-3"
                >
                  <Monitor className="w-4 h-4 mr-1" />
                  Desktop
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className="h-8 px-3"
                >
                  <Smartphone className="w-4 h-4 mr-1" />
                  Mobile
                </Button>
              </div>

              {/* External Link */}
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>

              {/* Close Button */}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Content */}
        <div className="flex-1 bg-muted/30 rounded-lg overflow-hidden">
          <div className="h-full flex items-center justify-center p-8">
            <div
              className={cn(
                'bg-white rounded-lg shadow-lg overflow-auto',
                viewMode === 'desktop' ? 'w-full max-w-2xl h-full' : 'w-96 h-[600px]'
              )}
            >
              {questions.length > 0 ? (
                <FormRenderer questions={questions} />
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <div className="text-lg font-medium mb-2">No questions added yet</div>
                  <div className="text-sm">
                    Add some questions to see how your form will look.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex-shrink-0 flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-4">
            <span>{questions.length} questions</span>
            <span>•</span>
            <span>Estimated completion: {Math.max(1, Math.ceil(questions.length * 0.5))} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Preview Mode
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 