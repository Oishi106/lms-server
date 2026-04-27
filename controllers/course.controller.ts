import { Request, Response, NextFunction } from "express";
import CourseModel from "../models/course.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

// ─── Get All Courses ─────────────────────────────────────────
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, level, minPrice, maxPrice, search } = req.query;

      const filter: any = {};

      if (category) filter.category = category;
      if (level) filter["details.level"] = level;
      if (search) {
        filter.title = { $regex: search, $options: "i" };
      }
      if (minPrice || maxPrice) {
        filter["pricing.discountPrice"] = {};
        if (minPrice) filter["pricing.discountPrice"].$gte = Number(minPrice);
        if (maxPrice) filter["pricing.discountPrice"].$lte = Number(maxPrice);
      }

      const courses = await CourseModel.find(filter).sort({ createdAt: -1 });

      res.status(200).json({ ok: true, courses });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Get Single Course by Slug ────────────────────────────────
export const getCourseBySlug = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const course = await CourseModel.findOne({ slug });

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      res.status(200).json({ ok: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Get Bestseller Courses ───────────────────────────────────
export const getBestsellerCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find({ isBestseller: true }).limit(6);
      res.status(200).json({ ok: true, courses });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);