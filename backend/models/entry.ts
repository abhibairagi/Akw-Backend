import mongoose, { Document, Schema, Types } from "mongoose";

interface Entries extends Document {
  name: string;
  url: string;
  userId: Types.ObjectId;
  is_deleted: boolean;
}

const entrySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Define and export the model
const Entry = mongoose.model<Entries>("entries", entrySchema);

export default Entry;
