import mongoose, { Schema, model } from "mongoose";

const ProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      default: "New User",
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// Check if model exists to prevent re-compilation errors in dev (especially Next.js)
const Profile = mongoose.models?.Profile || model("Profile", ProfileSchema);

export default Profile;
