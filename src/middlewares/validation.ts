import { Request, Response } from "express";
import { toUpperFirstChar } from "../utils";

export const fieldValidation =
  (field: string) => (req: Request, res: Response, next: () => void) => {
    if (!req.body[field]) {
      return res
        .status(422)
        .send({ message: toUpperFirstChar(field) + " is required" });
    }

    next();
  };

export const confirmPasswordValidation = (
  req: Request,
  res: Response,
  next: () => void
) => {
  const newPassword = req.body["newPassword"];
  const confirmPassword = req.body["confirmPassword"];

  if (newPassword !== confirmPassword) {
    return res.status(422).send({ message: "Password does not match" });
  }

  next();
};

export const emailValidation = (
  req: Request,
  res: Response,
  next: () => void
) => {
  const email = req.body["email"];

  if (!email) {
    return res.status(422).send({ message: "Email is required" });
  }

  // eslint-disable-next-line no-useless-escape
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regex.test(email)) {
    return res.status(422).send({ message: "Email is invalid" });
  }

  next();
};
