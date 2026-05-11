import express from "express";
import TodoController from "../controllers/todo.controller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(protect);

router.get("/", TodoController.getAll);
router.get("/:id", TodoController.getById);
router.post("/", TodoController.create);
router.patch("/:id", TodoController.update);
router.delete("/:id", TodoController.delete);
export default router;
