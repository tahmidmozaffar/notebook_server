import express from "express";
import passport from "passport";
import folderController from "../controllers/folder.controller";
const router = express.Router();

router.get(
  "/folder",
  passport.authenticate("jwt", { session: false }),
  folderController.getFolders
);
router.post(
  "/folder",
  passport.authenticate("jwt", { session: false }),
  folderController.addFolder
);
router.delete(
  "/folder",
  passport.authenticate("jwt", { session: false }),
  folderController.deletedFolder
);
