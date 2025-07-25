export enum PlankType {
  BASIC = "basic plank",
  ELBOW = "elbow plank",
  RAISED_LEG_RIGHT = "raised leg right",
  RAISED_LEG_LEFT = "raised leg left",
  LEFT_SIDE = "left side plank",
  RIGHT_SIDE = "right side plank",
}

export interface PlankSession {
  id: string;
  date: string;
  lap: number;
  type: PlankType;
  duration?: number;
}
