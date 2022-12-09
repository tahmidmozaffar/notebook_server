import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import authService from "../services/auth.service";

const jwt_secret = process.env.JWT_SECRET!;

const signup = async (req: Request, res: Response) => {
  const name = req.body['name'];
  const username = req.body['username'];
  const password = req.body['password'];
  const email = req.body['email'];

  try {
    await authService.createUser(name, username, password, email);
    return res.status(201).send("User is created successfully");

  } catch (error) {
    return res.status(500).send({ message: "Something went wrong. Please try again." });
  }
}

const login = async (req: Request, res: Response) => {

  const username = req.body['username'];
  const password = req.body['password'];

  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      const isMatched = await bcrypt.compare(password, user.password);

      if (isMatched) {
        const token = jwt.sign(JSON.stringify({ id: user.id, username: user.username }), jwt_secret);
        return res.status(200).json({ message: "Successfully logged in", token });
      }
      else {
        return res.status(401).json({ message: "Password is incorrect" });
      }

    }
    else {
      return res.status(404).json({ message: "User does not exist" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return res.status(500).json({ message: "Something went wrong. Try again later" });
  }

};


const authControllers = {
  signup,
  login,
};

export default authControllers;
