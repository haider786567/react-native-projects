import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["pdf", "geo"],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  filePath: {
    type: String,
    trim: true,
  },
  coords: {
    latitude: { type: Number },
    longitude: { type: Number },
    accuracy: { type: Number },
  },
  placeName: {
    type: String,
    trim: true,
  },
  capturedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const ScanModel = mongoose.model("Scan", scanSchema);
export type ScanDocument = mongoose.Document & {
  userId: mongoose.Types.ObjectId;
  type: "pdf" | "geo";
  title: string;
  filePath?: string;
  coords?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  };
  placeName?: string;
  capturedAt: Date;
};
