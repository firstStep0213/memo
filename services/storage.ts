import { Note, Task } from '../types';

const NOTE_STORAGE_KEY = 'mindscribe_notes_v1';
const TASK_STORAGE_KEY = 'mindscribe_tasks_v1';

// --- NOTES ---
export const getNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(NOTE_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load notes", e);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error("Failed to save notes", e);
  }
};

export const createNewNote = (): Note => {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    createdAt: now,
    updatedAt: now,
  };
};

// --- TASKS ---
export const getTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASK_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks", e);
  }
};