import React, { useState, useEffect } from 'react';
import { Note, Task, ViewMode } from './types';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { TodoList } from './components/TodoList';
import { getNotes, saveNotes, createNewNote, getTasks, saveTasks } from './services/storage';

const App: React.FC = () => {
  // Note State
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  // Task State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskView, setIsTaskView] = useState(false);

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST); // For Mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Initial load
  useEffect(() => {
    setNotes(getNotes());
    setTasks(getTasks());
    
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setViewMode(ViewMode.LIST);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save persistence
  useEffect(() => {
    if (notes.length > 0) saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveTasks(tasks); // Save tasks even if empty array, to persist deletes
  }, [tasks]);

  // --- Note Handlers ---
  const handleCreateNote = () => {
    const newNote = createNewNote();
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsTaskView(false);
    setSearchQuery('');
    if (isMobile) setViewMode(ViewMode.EDIT);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prevNotes) => 
      prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      const newNotes = notes.filter((n) => n.id !== id);
      setNotes(newNotes);
      saveNotes(newNotes);
      
      if (activeNoteId === id) {
        setActiveNoteId(null);
        if (isMobile) setViewMode(ViewMode.LIST);
      }
    }
  };

  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
    setIsTaskView(false);
    if (isMobile) setViewMode(ViewMode.EDIT);
  };

  // --- Task Handlers ---
  const handleSelectTasks = () => {
    setIsTaskView(true);
    setActiveNoteId(null);
    if (isMobile) setViewMode(ViewMode.EDIT);
  };

  const handleAddTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now()
    };
    setTasks([newTask, ...tasks]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm("Delete this task?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleBackToSidebar = () => {
    setViewMode(ViewMode.LIST);
    setActiveNoteId(null);
    // Keep isTaskView state so highlighting remains if we are just "peeking" back on mobile
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-900 font-sans">
      {/* Sidebar Section */}
      <div 
        className={`
          flex-shrink-0 h-full transition-all duration-300 ease-in-out z-20
          ${isMobile ? (viewMode === ViewMode.LIST ? 'w-full' : 'hidden') : 'w-80'}
        `}
      >
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          isTaskView={isTaskView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectNote={handleSelectNote}
          onSelectTasks={handleSelectTasks}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>

      {/* Main Content Section */}
      <div 
        className={`
          flex-1 h-full bg-paper transition-all duration-300
          ${isMobile ? (viewMode === ViewMode.EDIT ? 'w-full block' : 'hidden') : 'block'}
        `}
      >
        {isTaskView ? (
          <TodoList 
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onBack={handleBackToSidebar}
          />
        ) : activeNote ? (
          <Editor
            note={activeNote}
            onUpdate={handleUpdateNote}
            onBack={handleBackToSidebar}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h2 className="text-xl font-medium text-gray-500 mb-2">Select a note or view tasks</h2>
            <p className="max-w-xs text-sm">Choose a note from the sidebar or manage your to-do list to organize your learning.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;