export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number; // Timestamp
  createdAt: number; // Timestamp
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export enum ViewMode {
  LIST = 'LIST',
  EDIT = 'EDIT'
}

export enum AIActionType {
  SUMMARIZE = 'SUMMARIZE',
  QUIZ = 'QUIZ'
}