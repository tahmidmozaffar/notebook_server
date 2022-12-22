import express from "express";
import noteRoutes from "./note.route";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const router = express.Router();

router.use("/notes", noteRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;
