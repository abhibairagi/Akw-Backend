import mongoose, { Document, Schema } from "mongoose";

export interface PermissionsDocument extends Document {
  type: String;
}

const permissionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.model<PermissionsDocument>(
  "Permissions",
  permissionSchema
);

export default Permission;
