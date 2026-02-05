import React from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  isLoading: boolean;
  result: string | null;
  onClose: () => void;
  title: string;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, isLoading, result, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto text-gray-700 leading-relaxed text-sm min-h-[150px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-8 gap-3 text-gray-400">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p>Consulting Gemini...</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {result}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};