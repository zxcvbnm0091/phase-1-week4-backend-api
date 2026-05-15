import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import { UpdateUserSchema } from "../dtos/user.dto";

class AuthorizationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const hash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
};

const getAll = async () => {
  return await prisma.user.findMany({
    select: {},
  });
};

const getById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AuthorizationError("User Not Found", 404);
  }

  return user;
};

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}

const create = async (data: User) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AuthorizationError("User already exists", 409);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const userSelect: Prisma.UserSelect = {
    id: true,
    name: true,
    email: true,
  };

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: data.role,
    },
    select: userSelect,
  });

  return newUser;
};

const update = async (userId: string, rawData: unknown) => {
  const validateData = UpdateUserSchema.parse(rawData);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AuthorizationError("User not found", 404);
  }

  if (validateData.password) {
    validateData.password = await hash(validateData.password);
  }

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: validateData,
  });

  return updateUser;
};

const remove = async (userId: string) => {
  const user = await getById(userId);

  if (!user) {
    throw new AuthorizationError("User not found", 404);
  }

  return await prisma.user.delete({
    where: { id: userId },
  });
};

export { getAll, getById, create, update, remove };
