require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

// ─── Register ───────────────────────────────────────────────
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const parts = name.trim().split(" ").filter(Boolean);
      const initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "U";

      const user = await userModel.create({
        name,
        email,
        password,
        role: role === "admin" ? "admin" : "user",
        initials,
      });

      res.status(201).json({
        ok: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          initials: user.initials,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Login ──────────────────────────────────────────────────
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Email and password are required", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }

      if (role && user.role !== role) {
        return next(new ErrorHandler("Invalid role for this account", 403));
      }

      res.status(200).json({
        ok: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          initials: user.initials,
          image: user.image,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Google Login / Register ────────────────────────────────
export const googleAuthUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, image } = req.body;

      if (!email) {
        return next(new ErrorHandler("Email is required", 400));
      }

      let user = await userModel.findOne({ email });

      if (!user) {
        const parts = (name ?? "").trim().split(" ").filter(Boolean);
        const initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "U";

        user = await userModel.create({
          name: name ?? "Google User",
          email,
          password: "",
          role: "user",
          initials,
          image,
          isVerified: true,
        });
      }

      res.status(200).json({
        ok: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          initials: user.initials,
          image: user.image,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Get User by Email ──────────────────────────────────────
export const getUserByEmail = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;
      const user = await userModel.findOne({ email });

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        ok: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          initials: user.initials,
          image: user.image,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Get All Users (Admin) ───────────────────────────────────
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userModel.find().select("-password").sort({ createdAt: -1 });

      res.status(200).json({
        ok: true,
        users: users.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          initials: u.initials,
          image: u.image,
          authProvider: u.password ? "credentials" : "google",
          lastLoginAt: null,
          loginCount: 0,
          createdAt: (u as any).createdAt,
        })),
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Delete User (Admin) ─────────────────────────────────────
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await userModel.findByIdAndDelete(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({ ok: true, message: "User deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);