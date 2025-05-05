export enum PlankType {
  TIME = "TIME",
  REPS = "REPS",
  HOLD = "HOLD",
}

export interface PlankSession {
  id: string;
  type: PlankType;
  duration?: number;
  reps?: number;
  date: string;
  success: boolean;
}
