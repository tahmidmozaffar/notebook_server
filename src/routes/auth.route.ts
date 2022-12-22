import express from "express";
import authControllers from "../controllers/auth.controller";
import { fieldValidation } from "../middlewares/validation";

const router = express.Router();

router.post(
  "/signup",
  fieldValidation("name"),
  fieldValidation("username"),
  fieldValidation("password"),
  authControllers.signup
);

router.post(
  "/login",
  fieldValidation("username"),
  fieldValidation("password"),
  authControllers.login
);

export default router;
