import { Request, Response } from "express";
import { toUpperFirstChar } from "../utils";

export const fieldValidation = (field: string) => (req: Request, res: Response, next: () => void) => {
  if(!req.body[field]){
    return res.status(422).send({message: toUpperFirstChar(field)+ " is required" });
  }

  next();
}

export const emailValidation = (req: Request, res: Response, next: () => void) => {

  const email = req.body['email'];

  if (!email) {
    return res.status(422).send({ message: "Email is required" });
  }

  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if (!regex.test(email)) {
    return res.status(422).send({ message: "Email is invalid" });
  }
  next();
}
