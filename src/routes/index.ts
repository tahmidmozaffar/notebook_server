import express from "express";
import noteRoutes from "./note.route";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import folderRoutes from "./folder.route";

const router = express.Router();

router.use("/notes", noteRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/folders", folderRoutes);

export default router;
