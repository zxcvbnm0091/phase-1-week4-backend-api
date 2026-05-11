import mongoose, { Schema, model } from "mongoose";
import { z } from "zod";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

UserSchema.virtual("profile", {
  ref: "Profile",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

// Middleware for Cascade Delete
UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;
    // Dynamic imports or model calls to avoid circular dependencies
    await model("Todo").deleteMany({ userId });
    await model("Profile").deleteOne({ userId });
  },
);

const User = mongoose.models?.User || model("User", UserSchema);

// Zod Schema
export const UserZodSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default User;
