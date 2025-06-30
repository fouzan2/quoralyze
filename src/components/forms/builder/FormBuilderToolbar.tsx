'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Eye, 
  Settings, 
  Share2, 
  MoreHorizontal, 
  Download, 
  Copy, 
  ArrowLeft,
  Loader2,
  Undo,
  Redo,
  Smartphone,
  Monitor
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface FormBuilderToolbarProps {
  onPreview: () => void;
  onSettings: () => void;
  onSave: () => void;
  isSaving: boolean;
  formId: string;
}

export function FormBuilderToolbar({
  onPreview,
  onSettings,
  onSave,
  isSaving,
  formId,
}: FormBuilderToolbarProps) {
  const router = useRouter();
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const handleBack = () => {
    router.push('/dashboard/forms');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share form');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export form');
  };

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate form');
  };

  return (
    <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <h1 className="font-semibold">Form Builder</h1>
          {formId !== 'new' && (
            <Badge variant="outline" className="text-xs">
              ID: {formId}
            </Badge>
          )}
        </div>
      </div>

      {/* Center Section - Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" disabled>
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm" disabled>
          <Redo className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewDevice('desktop')}
            className="h-8 px-3"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewDevice('mobile')}
            className="h-8 px-3"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
        
        <Button variant="outline" size="sm" onClick={onPreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onSettings}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate Form
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Form
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete Form
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 