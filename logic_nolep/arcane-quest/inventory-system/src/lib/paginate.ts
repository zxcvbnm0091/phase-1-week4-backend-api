import { prisma } from "./prisma";
import { Prisma } from "../generated/prisma/client";

interface PaginateArgs {
  model: Prisma.ModelName;
  page?: number;
  pageSize?: number;
  where?: object;
  orderBy?: object | object[];
  include?: object;
  select?: object;
}

const paginate = async ({
  model,
  page = 1,
  pageSize = 10,
  where = {},
  orderBy = [{ createdAt: "desc" }, { id: "desc" }],
  include,
  select,
}: PaginateArgs) => {
  const prismaModel = prisma[model.toLowerCase() as keyof typeof prisma] as any;

  const [data, total] = await prisma.$transaction([
    prismaModel.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      orderBy,
      ...(include ? { include } : {}),
      ...(select ? { select } : {}),
    }),
    prismaModel.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  };
};

export default paginate;
