import express from "express";
import passport from "passport";
import folderController from "../controllers/folder.controller";
const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  folderController.getFolders
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  folderController.addFolder
);
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  folderController.deletedFolder
);

export default router;