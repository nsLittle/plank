export enum PlankType {
  PICK = "pick plank type",
  BASIC = "basic plank",
  ELBOW = "elbow plank",
  RAISED_RIGHT_LEG = "raised right leg",
  RAISED_LEFT_LEG = "raised left leg",
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
