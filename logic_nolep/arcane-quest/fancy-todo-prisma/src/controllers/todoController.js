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

  static async updateTodo(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    const { title, description, completed } = req.body;

    try {
      const updatedTodo = await prisma.todo.update({
        where: {
          id: id,
        },
        data: {
          title,
          description,
          completed,
        },
      });

      res.status(200).json({
        message: "Todo updated",
        status: "success",
        data: updatedTodo,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Todo not found" });
      }

      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  }

  static async deleteTodo(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    try {
      const existing = await prisma.todo.findUnique({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!existing) {
        return res.status(404).json({ error: "Todo does not existed" });
      }

      const deleteTodo = await prisma.todo.delete({
        where: {
          id: id,
          userId: userId,
        },
      });

      res.status(200).json({
        message: "Todo deleted",
        status: "success",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default TodoController;
