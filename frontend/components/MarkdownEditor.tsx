// @ts-nocheck
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Link, Image, Code, Quote } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MarkdownEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

export const MarkdownEditor = ({ 
  value, 
  onChange, 
  height = 400, 
  placeholder = "Start writing in markdown..." 
}: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState('write');

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const text = selectedText || placeholder;
    
    const newContent = value.substring(0, start) + before + text + after + value.substring(end);
    onChange(newContent);
    
    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**', 'bold text'), title: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*', 'italic text'), title: 'Italic' },
    { icon: Code, action: () => insertMarkdown('`', '`', 'code'), title: 'Inline Code' },
    { icon: Quote, action: () => insertMarkdown('> ', '', 'quote'), title: 'Quote' },
    { icon: List, action: () => insertMarkdown('- ', '', 'list item'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. ', '', 'list item'), title: 'Numbered List' },
    { icon: Link, action: () => insertMarkdown('[', '](url)', 'link text'), title: 'Link' },
    { icon: Image, action: () => insertMarkdown('![', '](url)', 'alt text'), title: 'Image' },
  ];

  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertMarkdown(prefix, '', `Heading ${level}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-gray-200 bg-gray-50 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Heading buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(1)}
                title="Heading 1"
                className="text-xs"
              >
                H1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(2)}
                title="Heading 2"
                className="text-xs"
              >
                H2
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertHeading(3)}
                title="Heading 3"
                className="text-xs"
              >
                H3
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-2" />
              
              {/* Formatting buttons */}
              {toolbarButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.title}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            
            <TabsList className="grid grid-cols-2 w-32">
              <TabsTrigger value="write" className="text-xs">Write</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="write" className="m-0">
          <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border-0 outline-none resize-none font-mono text-sm leading-relaxed"
            style={{ height: `${height}px` }}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div 
            className="p-4 overflow-auto"
            style={{ height: `${height}px` }}
          >
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="text-gray-500 italic">
                Nothing to preview yet. Start writing in the Write tab.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};