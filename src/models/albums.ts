import mongoose, { Schema, Document } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum AlbumStatus {
  //eslint-disable @typescript-eslint/no-unused-vars
  Draft = 0, // on information submit
  //eslint-disable @typescript-eslint/no-unused-vars
  Processing = 1, // on final submit
  //eslint-disable @typescript-eslint/no-unused-vars
  Approved = 2,
  //eslint-disable @typescript-eslint/no-unused-vars
  Rejected = 3,
  //eslint-disable @typescript-eslint/no-unused-vars
  Live = 4,
}

// Define the interface for the Album document
interface IAlbum extends Document {
  labelId: mongoose.Schema.Types.ObjectId;
  title?: string | null;
  thumbnail?: string | null;
  language?: string | null;
  genre?: string | null;
  releasedate?: Date | null;
  totalTracks?: number;
  upc?: string | null;
  artist?: string | null;
  cline?: string | null;
  pline?: string | null;
  status: AlbumStatus; //update album status
  tags?: string[] | null;
  comment: string;
  updatedAt: Date;
}

// Define the schema for the Album collection
const albumSchema: Schema = new Schema({
  labelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Labels",
    required: true,
  },
  title: {
    type: String,
    default: null,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: null,
  },
  genre: {
    type: String,
    default: null,
  },
  releasedate: {
    type: Date,
    default: null,
  },
  totalTracks: {
    type: Number,
    default: 0,
  },
  upc: {
    type: String,
    default: null,
  },
  artist: {
    type: String,
    default: null,
  },
  cline: {
    type: String,
    default: null,
  },
  pline: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    enum: AlbumStatus,
    required: true,
    default: AlbumStatus.Draft,
  },
  tags: {
    type: [String],
    default: [],
  },
  comment: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Default to current time
    required: true,
  },
});

// Create the model for the Album collection
const Album =
  mongoose.models.Album || mongoose.model<IAlbum>("Album", albumSchema);

export default Album;
