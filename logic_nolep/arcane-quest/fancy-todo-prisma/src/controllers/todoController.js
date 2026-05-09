import { prisma } from "../lib/prisma.js";

class TodoController {
  static async getTodo(req, res) {
    const userId = req.user.id;

    const todos = await prisma.todo.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    try {
      if (todos.length === 0) {
        return res.status(200).json({
          message: "No todos found for this user",
          status: "success",
          data: [],
        });
      }

      res.status(200).json({
        message: "Get all todos",
        status: "success",
        data: todos,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async createTodo(req, res) {
    const userId = req.user.id;
    const { title, desc, completed } = req.body;

    try {
      const todo = await prisma.todo.create({
        data: {
          title,
          description: desc,
          completed: completed || false,
          userId: userId,
        },

        select: {
          id: true,
          title: true,
          description: true,
          completed: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      });

      return res.status(201).json({
        message: "Todo created!",
        status: "success",
        data: todo,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  }
}
