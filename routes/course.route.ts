import express from "express";
import { 
    getAllCourses, 
    getBestsellerCourses, 
    getCourseBySlug 
} from "../controllers/course.controller";

const courseRouter = express.Router();


courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-bestsellers", getBestsellerCourses);

courseRouter.get("/get-course/:slug", getCourseBySlug);

export default courseRouter;