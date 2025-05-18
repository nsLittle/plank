export enum PlankType {
  BASIC = "Basic",
  ELBOW = "Elbow",
  RAISED_LEG_RIGHT = "Raised-Leg-Right",
  RAISED_LEG_LEFT = "Raised-Leg-Left",
  ONE_SIDED = "One-Sided",
}

export interface PlankSession {
  id: string;
  date: string;
  lap: number;
  type: PlankType;
  duration?: number;
}
