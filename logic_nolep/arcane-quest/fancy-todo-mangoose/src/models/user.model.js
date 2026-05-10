import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
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
// Note: In modern Mongoose, use 'deleteOne' instead of 'remove'
// if you are calling user.deleteOne()
UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;
    // Dynamic imports or model calls to avoid circular dependencies
    await model("Todo").deleteMany({ userId });
    await model("Profile").deleteOne({ userId });
    next();
  },
);

// Check if model exists to prevent re-compilation errors in dev (especially Next.js)
const User = models.User || model("User", UserSchema);

export default User;
