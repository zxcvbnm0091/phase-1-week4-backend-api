import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import type { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import ApiError from "../utils/ApiError";
import { status } from "http-status";
import paginate from "../lib/paginate";
const hash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
};

const getAll = async (page: number = 1, pageSize: number = 10) => {
  return await paginate({
    model: "User",
    page,
    pageSize,
  });
  // const [users, total] = await prisma.$transaction([
  //   prisma.user.findMany({
  //     skip: (page - 1) * pageSize,
  //     take: pageSize,
  //     orderBy: { id: "asc" },
  //   }),
  //   prisma.user.count(),
  // ]);

  // return {
  //   data: users,
  //   total,
  //   page,
  //   totalPages: Math.ceil(total / pageSize),
  // };
};

const getById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User Not Found");
  }

  return user;
};

const create = async (dto: CreateUserDto) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new ApiError(status.CONFLICT, "User already exists");
  }

  const passwordHash = await hash(dto.password);

  const userSelect: Prisma.UserSelect = {
    id: true,
    name: true,
    email: true,
  };

  const newUser = await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      password: passwordHash,
    },
    select: userSelect,
  });

  return newUser;
};

const update = async (userId: string, dto: UpdateUserDto) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }

  const data = { ...dto };

  if (data.password) {
    data.password = await hash(data.password);
  }

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: data,
    select: { id: true, name: true, email: true, role: true },
  });

  return updateUser;
};

const remove = async (userId: string) => {
  await getById(userId);
  return prisma.user.delete({ where: { id: userId } });
};

export { getAll, getById, create, update, remove };
