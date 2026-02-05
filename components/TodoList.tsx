import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Check, Trash2, CalendarCheck, ChevronLeft } from 'lucide-react';

interface TodoListProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onBack: () => void; // For mobile
}

export const TodoList: React.FC<TodoListProps> = ({ 
  tasks, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask,
  onBack
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  // Sort: Incomplete first, then by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.createdAt - a.createdAt;
    }
    return a.completed ? 1 : -1;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-paper">
      {/* Header */}
      <div className="px-6 py-6 md:py-8 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-1">
             <button 
                onClick={onBack}
                className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarCheck className="h-6 w-6 text-indigo-600" />
              Learning Tasks
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500">
              {completedCount}/{tasks.length} Done
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="mb-8 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What do you need to learn next?"
              className="w-full pl-5 pr-12 py-4 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>

          {/* List */}
          <div className="space-y-3">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No tasks yet. Add one to get started!</p>
              </div>
            ) : (
              sortedTasks.map(task => (
                <div 
                  key={task.id}
                  className={`
                    group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
                    ${task.completed 
                      ? 'bg-gray-50 border-transparent opacity-75' 
                      : 'bg-white border-gray-100 shadow-sm hover:border-indigo-100 hover:shadow-md'
                    }
                  `}
                >
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`
                      flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 text-transparent hover:border-indigo-400'
                      }
                    `}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                  
                  <span 
                    className={`
                      flex-1 text-sm md:text-base transition-all
                      ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}
                    `}
                  >
                    {task.text}
                  </span>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};