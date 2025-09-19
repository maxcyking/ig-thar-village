"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered,
  Link,
  Quote,
  Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  rows?: number;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter your content...", 
  label,
  className = "",
  rows = 10 
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (prefix: string, suffix: string = '', placeholder: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      prefix + textToInsert + suffix + 
      value.substring(end);
    
    onChange(newValue);

    // Set cursor position after formatting
    setTimeout(() => {
      const newCursorPos = start + prefix.length + textToInsert.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const formatActions = [
    { 
      icon: Bold, 
      action: () => insertFormatting('**', '**', 'bold text'),
      title: 'Bold' 
    },
    { 
      icon: Italic, 
      action: () => insertFormatting('_', '_', 'italic text'),
      title: 'Italic' 
    },
    { 
      icon: Underline, 
      action: () => insertFormatting('<u>', '</u>', 'underlined text'),
      title: 'Underline' 
    },
    { 
      icon: Strikethrough, 
      action: () => insertFormatting('~~', '~~', 'strikethrough text'),
      title: 'Strikethrough' 
    },
    { 
      icon: List, 
      action: () => insertFormatting('\n- ', '', 'list item'),
      title: 'Bullet List' 
    },
    { 
      icon: ListOrdered, 
      action: () => insertFormatting('\n1. ', '', 'numbered item'),
      title: 'Numbered List' 
    },
    { 
      icon: Link, 
      action: () => insertFormatting('[', '](url)', 'link text'),
      title: 'Link' 
    },
    { 
      icon: Quote, 
      action: () => insertFormatting('\n> ', '', 'quote'),
      title: 'Quote' 
    },
    { 
      icon: Code, 
      action: () => insertFormatting('`', '`', 'code'),
      title: 'Inline Code' 
    },
  ];

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<s>$1</s>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>')
      .replace(/^> (.+)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/^- (.+)/gm, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.+)/gm, '<li class="ml-4">$2</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      {/* Toolbar */}
      <div className="border rounded-t-lg bg-gray-50 p-2">
        <div className="flex flex-wrap gap-1 items-center">
          {formatActions.map((action, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={action.action}
              title={action.title}
              className="h-8 w-8 p-0"
            >
              <action.icon className="h-4 w-4" />
            </Button>
          ))}
          
          <div className="ml-auto flex gap-2">
            <Button
              type="button"
              variant={!isPreview ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsPreview(false)}
              className="text-xs"
            >
              Edit
            </Button>
            <Button
              type="button"
              variant={isPreview ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsPreview(true)}
              className="text-xs"
            >
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="border border-t-0 rounded-b-lg">
        {!isPreview ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full p-3 border-0 rounded-b-lg resize-none focus:outline-none focus:ring-0"
          />
        ) : (
          <div 
            className="p-3 min-h-[200px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        )}
      </div>

      {/* Format Guide */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Formatting: **bold** _italic_ ~~strikethrough~~ `code` [link](url)</p>
        <p>Lists: - bullet or 1. numbered | Quote: > text</p>
      </div>
    </div>
  );
}
