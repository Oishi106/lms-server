require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route"; 

export const app = express();

// body parser
app.use(express.json({ limit: '50mb' }));

// cookie parser
app.use(cookieParser());

// cors
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true, 
}));

// routes
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter); 

// test api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ 
    success: true, 
    message: "API is working fine" 
  });
});

// unknown route handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// error middleware
app.use(errorMiddleware);