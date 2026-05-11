import Profile from "../models/profile.model.js";

const findById = async (userId) => {
  const profile = await Profile.findOne({ userId: userId });

  if (!profile) {
    const error = new Error("Profile not found");
    error.statusCode = 404;
    throw error;
  }
  return profile;
};

const updateProfile = async (userId, displayName, bio) => {
  const updateData = { displayName, bio };
  const updateProfile = await Profile.findOneAndUpdate(
    { userId: userId },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updateProfile) {
    const error = new Error("Profile not found");
    error.statusCode = 404;
    throw error;
  }

  return updateProfile;
};
