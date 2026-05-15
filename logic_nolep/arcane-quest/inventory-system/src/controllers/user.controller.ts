import * as userService from "../service/user.service";
import type { Request, Response } from "express";
import { CreateUserSchema, UpdateUserSchema } from "../dtos/user.dto";

class UserController {
  static async getAllUser(req: Request, res: Response) {
    try {
      const users = await userService.getAll();

      res.status(200).json({
        message: "Fetch all users",
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const userId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const user = await userService.getById(userId);

      res.status(200).json({
        message: "Fetch user",
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const parsed = CreateUserSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json(parsed.error);
      }

      const newUser = await userService.create(parsed.data);

      res.status(201).json({
        message: "User created",
        success: true,
        data: newUser,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const parsed = UpdateUserSchema.safeParse(req.body);
      const updateUser = await userService.update(userId, parsed.data);

      if (!parsed.success) {
        return res.status(400).json(parsed.error);
      }

      res.status(200).json({
        message: "Used data updated",
        success: true,
        data: updateUser,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      await userService.remove(userId);

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        message: "User deleted",
        success: true,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }
}

export default UserController;
