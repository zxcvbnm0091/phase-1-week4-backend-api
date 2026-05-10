import express from "express";
import TodoController from "../controllers/todo.controller.js";
const router = express.Router();

router
  .route("/")
  .get(protect, TodoController.getTodo)
  .post(protect, TodoController.createTodo);
router.patch("/:id", protect, TodoController.updateTodo);
router.delete("/deleteTodo/:id", protect, TodoController.deleteTodo);
