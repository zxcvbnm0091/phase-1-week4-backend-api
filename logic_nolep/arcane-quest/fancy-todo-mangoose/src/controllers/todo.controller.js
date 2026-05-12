import * as todoService from "../service/todo.service.js";

class TodoController {
  static async getAll(req, res) {
    try {
      const userId = req.user.id;
      const todos = await todoService.findAll(userId);
      res.status(200).json({
        status: "success",
        count: todos.length,
        data: todos,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const todo = await todoService.findById(id, userId);

      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }

      res.status(200).json({ status: "success", data: todo });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode || 500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const userId = req.user.id;
      const { title, description, completed } = req.body;

      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return res
          .status(400)
          .json({ error: "Title is required and must be a non-empty string" });
      }

      if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({ error: "Completed must be a boolean" });
      }
      const createdTodo = await todoService.createTodo(
        userId,
        title,
        description,
        completed,
      );

      res.status(201).json({
        status: "success",
        message: "Todo created",
        data: createdTodo,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode || 500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const { title, description, completed } = req.body;

      const updatedTodo = await todoService.updateTodo(
        id,
        userId,
        title,
        description,
        completed,
      );

      res.status(200).json({
        status: "success",
        message: "Todo updated successfully",
        data: updatedTodo,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await todoService.deleteTodo(id, userId);

      res.status(200).json({
        status: "success",
        message: "Todo deleted successfully",
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode || 500).json({ error: error.message });
    }
  }
}

export default TodoController;
