import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import type { CreateOrderDto, UpdateOrderDto } from "../dtos/order.dto";
import ApiError from "../utils/ApiError";
import status from "http-status";
import paginate from "../lib/paginate";

const orderSelect = {
  id: true,
  status: true,
  totalPrice: true,
  customerName: true,
  customerEmail: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.OrderSelect;

const getAll = async (
  userId?: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  return await paginate({
    model: "Order",
    page,
    pageSize,
    where: { userId },
  });
  // const [orders, total] = await prisma.$transaction([
  //   prisma.order.findMany({
  //     skip: (page - 1) * pageSize,
  //     take: pageSize,
  //     orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  //   }),
  //   prisma.order.count(),
  // ]);

  // return {
  //   data: orders,
  //   total,
  //   page,
  //   totalPage: Math.ceil(total / pageSize),
  // };
};

const getById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: orderSelect,
  });
  if (!order) throw new ApiError(status.NOT_FOUND, "Order not found");
  return order;
};

const create = async (dto: CreateOrderDto, userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(status.NOT_FOUND, "User not found");

  return await prisma.order.create({
    data: {
      ...dto,
      userId,
      totalPrice: 0, // recalculated as order items are added
    },
    select: orderSelect,
  });
};

const update = async (orderId: string, dto: UpdateOrderDto) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: dto,
    select: orderSelect,
  });
};

const remove = async (orderId: string) => {
  await prisma.order.delete({ where: { id: orderId } });
};

export { getAll, getById, create, update, remove };
