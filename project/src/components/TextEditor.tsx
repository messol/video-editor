import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Wand2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface TextEditorProps {
  onGenerate: (text: string, title: string) => void;
  isGenerating: boolean;
}

export function TextEditor({ onGenerate, isGenerating }: TextEditorProps) {
  const [title, setTitle] = useState('');
  const [script, setScript] = useState('');

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title..."
          className={cn(
            "w-full p-4 text-lg bg-white rounded-lg border",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "outline-none"
          )}
        />
        <div className="relative">
          <TextareaAutosize
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter your script here..."
            className={cn(
              "w-full p-4 text-lg bg-white rounded-lg border",
              "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "min-h-[200px] resize-none outline-none",
              "placeholder:text-gray-400"
            )}
          />
          <button
            onClick={() => onGenerate(script, title)}
            disabled={!script.trim() || !title.trim() || isGenerating}
            className={cn(
              "absolute bottom-4 right-4",
              "px-4 py-2 bg-blue-600 text-white rounded-lg",
              "flex items-center gap-2 hover:bg-blue-700 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Wand2 className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
}