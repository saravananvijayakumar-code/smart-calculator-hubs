// @ts-nocheck
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Quote, 
  Code,
  Eye,
  Type,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

export const SimpleRichTextEditor = ({ 
  value, 
  onChange, 
  height = 400, 
  placeholder = "Start writing..." 
}: SimpleRichTextEditorProps) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback((before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || defaultText;
    
    const newText = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      const text = prompt('Enter link text:', url);
      insertText(`[${text || url}](`, ')');
    }
  }, [insertText]);

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      const alt = prompt('Enter alt text:', 'Image');
      insertText(`![${alt}](`, ')');
    }
  }, [insertText]);

  const insertCalculator = useCallback(() => {
    const calculators = [
      'compound-interest',
      'mortgage', 
      'loan',
      'investment',
      'retirement',
      'bmi',
      'percentage',
      'currency',
      'tip'
    ];
    
    const type = prompt(`Enter calculator type (${calculators.join(', ')}):`, 'compound-interest');
    if (type && calculators.includes(type)) {
      const calculatorHtml = `

[CALCULATOR:${type}]

`;
      insertText(calculatorHtml, '');
    }
  }, [insertText]);

  const toolbarButtons = [
    { icon: Heading1, action: () => insertText('# ', '', 'Heading 1'), title: 'Heading 1' },
    { icon: Heading2, action: () => insertText('## ', '', 'Heading 2'), title: 'Heading 2' },
    { icon: Heading3, action: () => insertText('### ', '', 'Heading 3'), title: 'Heading 3' },
    { icon: Bold, action: () => insertText('**', '**', 'bold text'), title: 'Bold' },
    { icon: Italic, action: () => insertText('_', '_', 'italic text'), title: 'Italic' },
    { icon: Code, action: () => insertText('`', '`', 'code'), title: 'Inline Code' },
    { icon: Quote, action: () => insertText('> ', '', 'blockquote'), title: 'Quote' },
    { icon: List, action: () => insertText('- ', '', 'list item'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('1. ', '', 'list item'), title: 'Numbered List' },
    { icon: Link, action: insertLink, title: 'Link' },
    { icon: Image, action: insertImage, title: 'Image' },
    { icon: Type, action: insertCalculator, title: 'Calculator' },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'write' | 'preview')}>
        <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2">
          <div className="flex flex-wrap gap-1">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.title}
                className="h-8 w-8 p-0"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
          
          <TabsList className="h-8">
            <TabsTrigger value="write" className="text-xs">Write</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-0 rounded-none resize-none focus-visible:ring-0"
            style={{ height: height }}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div 
            className="p-4 prose prose-sm max-w-none overflow-auto"
            style={{ height: height }}
          >
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-gray-500 italic">Nothing to preview yet...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};