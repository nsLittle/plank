import mongoose, { Document, Schema } from 'mongoose';

export interface LapDocument extends Document {
  email: string;
  lap: number;
  plankType:
    | 'basic plank'
    | 'elbow plank'
    | 'left leg raise plank'
    | 'right leg raise plank'
    | 'left side plank'
    | 'right side plank';
  time: number;
  entryDate: Date;
}

const LapSchema = new Schema<LapDocument>({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  lap: {
    type: Number,
    required: true,
  },
  plankType: {
    type: String,
    enum: [
      'basic plank',
      'elbow plank',
      'left leg raise plank',
      'right leg raise plank',
      'left side plank',
      'right side plank',
    ],
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  entryDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<LapDocument>('Lap', LapSchema);
