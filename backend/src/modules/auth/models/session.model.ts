import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;

  deviceId: string;

  refreshToken: string;

  expiresAt: Date;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Automatically delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>("Session", SessionSchema);
