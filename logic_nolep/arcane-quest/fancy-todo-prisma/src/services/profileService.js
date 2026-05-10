import { prisma } from "../lib/prisma.js";

export const getProfileByUserId = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    const error = new Error("Profile not found");
    error.statusCode = 404;
    throw error;
  }

  return profile;
};

export const updateProfileByUserId = async (userId, updateData) => {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: updateData,
    });
  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("Profile not found");
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
