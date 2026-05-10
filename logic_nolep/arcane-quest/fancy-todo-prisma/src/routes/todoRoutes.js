import TodoController from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/", protect, TodoController.getTodo);
router.post("/", protect, TodoController.createTodo);
router.patch("/:id", protect, TodoController.updateTodo);
router.delete("/deleteTodo/:id", protect, TodoController.deleteTodo);

export default router;
