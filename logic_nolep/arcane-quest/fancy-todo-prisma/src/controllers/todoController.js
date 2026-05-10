import * as todoService from "../services/todoService.js";

class TodoController {
  static async getTodo(req, res) {
    try {
      const userId = req.user.id;
      const todos = await todoService.getAllUserTodos(userId);

      res.status(200).json({
        message: todos.length ? "Get all todos" : "No todos found",
        status: "success",
        data: todos,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async createTodo(req, res) {
    try {
      const userId = req.user.id;
      const todo = await todoService.createNewTodo(userId, req.body);

      res.status(201).json({
        message: "Todo created!",
        status: "success",
        data: todo,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const updatedTodo = await todoService.updateTodoById(
        id,
        userId,
        req.body,
      );

      res.status(200).json({
        message: "Todo updated",
        status: "success",
        data: updatedTodo,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await todoService.deleteTodoById(id, userId);

      res.status(200).json({
        message: "Todo deleted",
        status: "success",
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export default TodoController;
