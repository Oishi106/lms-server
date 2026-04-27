import express from "express";
import {
  registrationUser,
  loginUser,
  googleAuthUser,
  getUserByEmail,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/register", registrationUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-auth", googleAuthUser);
userRouter.get("/user/:email", getUserByEmail);
userRouter.get("/admin/users", getAllUsers);
userRouter.delete("/admin/users/:id", deleteUser);

export default userRouter;