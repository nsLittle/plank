export interface User {
  _id: string;
  email: string;
  token?: string;
}

export interface Lap {
  _id?: string;
  email: string;
  lap: number;
  plankType: PlankType;
  time: number;
  entryDate?: Date;
}

export type PlankType = 
  | "basic plank"
  | "elbow plank" 
  | "raised leg left"
  | "raised leg right"
  | "left side plank"
  | "right side plank";

export interface ProgressData {
  date?: string | null;
  totalReps: number;
  totalTime: number;
  longestPlank: number;
  byType: Record<PlankType, { total: number; reps: number }>;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}
