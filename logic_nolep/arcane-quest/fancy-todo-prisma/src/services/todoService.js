import { prisma } from "../lib/prisma.js";

export const getAllUserTodos = async (userId) => {
  return await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createNewTodo = async (userId, todoData) => {
  const { title, desc, completed } = todoData;
  return await prisma.todo.create({
    data: {
      title,
      description: desc,
      completed: completed || false,
      userId,
    },
  });
};

export const updateTodoById = async (id, userId, updateData) => {
  try {
    return await prisma.todo.update({
      where: {
        id,
        userId,
      },
      data: updateData,
    });
  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("Todo not found or unauthorized");
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};

export const deleteTodoById = async (id, userId) => {
  try {
    return await prisma.todo.delete({
      where: {
        id,
        userId,
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("Todo not found or unauthorized");
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
};
