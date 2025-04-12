import mongoose, { Schema, Document } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export enum AlbumStatus {
  //eslint-disable @typescript-eslint/no-unused-vars
  Draft = 0,
  //eslint-disable @typescript-eslint/no-unused-vars
  Processing = 1,
  //eslint-disable @typescript-eslint/no-unused-vars
  Approved = 2,
  //eslint-disable @typescript-eslint/no-unused-vars
  Rejected = 3,
}

interface ILyric extends Document {
  trackId: mongoose.Schema.Types.ObjectId;
  lyrics: string;
  status: AlbumStatus;
  comment: string;
}

const lyricsSchema: Schema<ILyric> = new Schema({
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tracks",
    required: true,
  },
  lyrics: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    enum: AlbumStatus,
    required: true,
    default: AlbumStatus.Draft,
  },
  comment: {
    type: String,
    default: null,
  },
});

const Lyrics =
  mongoose.models.TLyrics || mongoose.model<ILyric>("TLyrics", lyricsSchema);

export default Lyrics;
