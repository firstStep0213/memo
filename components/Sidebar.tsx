import React from 'react';
import { Note } from '../types';
import { Plus, Search, Trash2, CheckSquare } from 'lucide-react';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  isTaskView: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNote: (id: string) => void;
  onSelectTasks: () => void;
  onCreateNote: () => void;
  onDeleteNote: (e: React.MouseEvent, id: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNoteId,
  isTaskView,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onSelectTasks,
  onCreateNote,
  onDeleteNote,
  className = ''
}) => {
  // Filter notes based on search query
  const filteredNotes = notes
    .filter(note => {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => b.updatedAt - a.updatedAt); // Sort by newest

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex flex-col h-full bg-sidebar border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 pt-5 pb-2">
        <h1 className="text-xl font-bold text-gray-800 mb-4 px-1">MindScribe</h1>
        
        {/* Navigation: Tasks Button */}
        <div className="mb-4">
          <button
            onClick={onSelectTasks}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
              isTaskView 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-700 hover:bg-gray-200/60'
            }`}
          >
            <CheckSquare className={`h-4.5 w-4.5 ${isTaskView ? 'text-indigo-600' : 'text-gray-500'}`} />
            <span>My Tasks</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-200/60 border-none rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-4">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Notes
        </div>
        {filteredNotes.length === 0 ? (
          <div className="text-center mt-6 text-gray-400 text-sm">
            {searchQuery ? "No matching notes." : "No notes yet."}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`
                group relative p-3 rounded-lg cursor-pointer transition-all duration-200 select-none
                ${activeNoteId === note.id ? 'bg-white shadow-sm ring-1 ring-black/5' : 'hover:bg-sidebar-hover'}
              `}
            >
              <h3 className={`font-semibold text-sm mb-1 truncate ${!note.title ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                {note.title || 'New Note'}
              </h3>
              <div className="flex items-center text-xs text-gray-500 gap-2">
                <span>{formatDate(note.updatedAt)}</span>
                <span className="truncate max-w-[120px] text-gray-400">
                  {note.content.substring(0, 30).replace(/\n/g, ' ')}
                </span>
              </div>
              
              {/* Delete Button (Visible on hover) */}
              <button
                onClick={(e) => onDeleteNote(e, note.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-sidebar/95 backdrop-blur-sm sticky bottom-0">
        <button
          onClick={onCreateNote}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium text-sm">New Note</span>
        </button>
      </div>
    </div>
  );
};