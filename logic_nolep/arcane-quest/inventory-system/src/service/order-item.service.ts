import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import type {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from "../dtos/order-item.dto";
import ApiError from "../utils/ApiError";
import { status } from "http-status";
import type { Product } from "../generated/prisma/client";
import paginate from "../lib/paginate";

const orderItemSelect = {
  id: true,
  orderId: true,
  productId: true,
  quantity: true,
  unitPrice: true,
} satisfies Prisma.OrderItemSelect;

const getAll = async (
  orderId?: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  return await paginate({
    model: "OrderItem",
    page,
    pageSize,
    where: { orderId },
  });
  // const [orderItems, total] = await prisma.$transaction([
  //   prisma.orderItem.findMany({
  //     skip: (page - 1) * pageSize,
  //     take: pageSize,
  //     orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  //   }),
  //   prisma.orderItem.count(),
  // ]);

  // return {
  //   data: orderItems,
  //   total,
  //   page,
  //   totalPage: Math.ceil(total / pageSize),
  // };
};

const getById = async (
  orderItemId: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  // return await paginate({
  //   model: "OrderItem",
  //   page,
  //   pageSize,
  //   where: { id: orderItemId },
  //   select: orderItemSelect,
  // });

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    select: orderItemSelect,
  });
  if (!orderItem) throw new ApiError(status.NOT_FOUND, "Order item not found");
  return orderItem;
};

// total price helper
const recalculateTotalPrice = async (
  orderId: string,
  tx: Prisma.TransactionClient,
) => {
  const items = await tx.orderItem.findMany({
    where: { orderId },
    select: { quantity: true, unitPrice: true },
  });

  const total = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.unitPrice),
    0,
  );

  await tx.order.update({
    where: { id: orderId },
    data: { totalPrice: total },
  });

  return total;
};

const create = async (dto: CreateOrderItemDto) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new ApiError(status.NOT_FOUND, "Order not found");

    // lock product row to prevent race condition
    const [product] = await tx.$queryRaw<Product[]>`
      SELECT * FROM "Product"
      WHERE id = ${dto.productId}
      FOR UPDATE
    `;
    // check product stock
    if (!product) throw new ApiError(status.NOT_FOUND, "Product not found");
    if (product.quantityInStock < dto.quantity) {
      throw new ApiError(
        status.BAD_REQUEST,
        `Insufficient stock. Available: ${product.quantityInStock}`,
      );
    }

    const newOrderItem = await tx.orderItem.create({
      data: { ...dto },
      select: orderItemSelect,
    });

    // decrement stock
    await tx.product.update({
      where: { id: dto.productId },
      data: { quantityInStock: { decrement: dto.quantity } },
    });

    // recalculate totalPrice from ALL order items and save to Order
    await recalculateTotalPrice(dto.orderId, tx);

    return newOrderItem;
  });
};

const update = async (orderItemId: string, dto: UpdateOrderItemDto) => {
  const existing = await getById(orderItemId);

  return await prisma.$transaction(async (tx) => {
    // lock product row
    const [product] = await tx.$queryRaw<Product[]>`
      SELECT * FROM "Product"
      WHERE id = ${existing.productId}
      FOR UPDATE
    `;
    if (!product) throw new ApiError(status.NOT_FOUND, "Product not found");

    // if quantity changed, validate and adjust stock
    if (dto.quantity !== undefined && dto.quantity !== existing.quantity) {
      const diff = dto.quantity - existing.quantity; // positive = need more, negative = returning stock

      if (diff > 0 && product.quantityInStock < diff) {
        throw new ApiError(
          status.BAD_REQUEST,
          `Insufficient stock. Available: ${product.quantityInStock}`,
        );
      }

      await tx.product.update({
        where: { id: existing.productId },
        data: { quantityInStock: { decrement: diff } }, // decrement handles both + and - diff
      });
    }

    const updatedOrderItem = await tx.orderItem.update({
      where: { id: orderItemId },
      data: dto,
      select: orderItemSelect,
    });

    await recalculateTotalPrice(existing.orderId, tx);

    return updatedOrderItem;
  });
};

const remove = async (orderItemId: string) => {
  const existing = await getById(orderItemId);

  return await prisma.$transaction(async (tx) => {
    await tx.orderItem.delete({ where: { id: orderItemId } });

    // restore stock back to product
    await tx.product.update({
      where: { id: existing.productId },
      data: { quantityInStock: { increment: existing.quantity } },
    });

    await recalculateTotalPrice(existing.orderId, tx);
  });
};

export { getAll, getById, create, update, remove };
