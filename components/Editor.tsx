import React, { useEffect, useState, useCallback } from 'react';
import { Note, AIActionType } from '../types';
import { Clock, ChevronLeft, Sparkles, GraduationCap, FileText } from 'lucide-react';
import { AIModal } from './AIModal';
import { generateAIResponse } from '../services/geminiService';

interface EditorProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  onBack: () => void; // For mobile
  className?: string;
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdate, onBack, className = '' }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  
  // AI State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiTitle, setAiTitle] = useState("");

  // Update local state when prop changes (e.g. selecting a different note)
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]); // Only reset when ID changes

  // Debounce save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        onUpdate({
          ...note,
          title,
          content,
          updatedAt: Date.now(),
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content, note, onUpdate]);

  const handleAIAction = async (action: AIActionType) => {
    let displayTitle = "AI Analysis";
    if (action === AIActionType.SUMMARIZE) displayTitle = "Summary";
    if (action === AIActionType.QUIZ) displayTitle = "Quick Quiz";

    setAiTitle(displayTitle);
    setAiModalOpen(true);
    setAiLoading(true);
    setAiResult(null);

    const result = await generateAIResponse(content, action);
    
    setAiResult(result);
    setAiLoading(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex flex-col h-full bg-paper ${className}`}>
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Edited {formatDate(note.updatedAt)}
          </span>
        </div>

        {/* AI Actions Dropdown/Group */}
        <div className="flex items-center gap-1">
           <button 
            onClick={() => handleAIAction(AIActionType.SUMMARIZE)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Summarize Note"
           >
             <FileText className="h-3.5 w-3.5" />
             Summarize
           </button>
           <button 
            onClick={() => handleAIAction(AIActionType.QUIZ)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            title="Generate Quiz"
           >
             <GraduationCap className="h-3.5 w-3.5" />
             <span className="hidden sm:inline">Quiz Me</span>
             <span className="sm:hidden">AI</span>
           </button>
        </div>
      </div>

      {/* Editing Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full text-3xl md:text-4xl font-bold text-gray-900 placeholder-gray-300 border-none bg-transparent focus:outline-none focus:ring-0 mb-6"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your learning notes here..."
            className="w-full h-[calc(100vh-250px)] resize-none text-lg leading-relaxed text-gray-700 placeholder-gray-300 border-none bg-transparent focus:outline-none focus:ring-0 font-sans"
            spellCheck={false}
          />
        </div>
      </div>

      {/* AI Result Modal */}
      <AIModal 
        isOpen={aiModalOpen}
        isLoading={aiLoading}
        result={aiResult}
        title={aiTitle}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  );
};