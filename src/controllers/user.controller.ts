import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "../models/user.model";
import { ResetPasswordCodes } from "../models/resetpasswordcode";
import sendEmail from "../services/mailer.service";

const changePassword = async (req: Request, res: Response) => {

  const currentPassword = req.body['currentPassword'];
  const newPassword = req.body['newPassword'];
  const confirmPassword = req.body['confirmPassword'];

  if (!currentPassword) {
    return res.status(422).send({
      message: "Current password is required"
    });
  }

  if (!newPassword) {
    return res.status(422).send({
      message: "New password is required"
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(422).send({
      message: "Password does not match"
    });
  }

  const token = req.headers.authorization!.split(" ")[1];
  const jwtPayload = jwt.decode(token, { json: true });

  try {
    const user = await User.findOne({ where: { id: jwtPayload?.id } });

    if (user) {
      const isMatched = await bcrypt.compare(currentPassword, user.password);

      if (isMatched) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        try {
          await User.update({
            name: user.name,
            username: user.username,
            password: hashedPassword,
            email: user.email,
          }, { where: { id: user.id } });

          return res.status(200).json({ message: "Password is changed" });
        } catch (err) {
          if (err instanceof Error) {
            return res.status(500).json({ message: `Something went wrong. Please try again later. Exception: ${err.message}` });
          }
        }
      }
      else {
        return res.status(401).json({ message: "Password is incorrect" });
      }
    }
    else {
      // this should not happen because user is already logged in when he is changing password
      // so we do not handle this block
    }

  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }

}

const updateProfile = async (req: Request, res: Response) => {

  const name = req.body['name'];
  const email = req.body['email'];

  const token = req.headers.authorization!.split(" ")[1];
  const jwtPayload = jwt.decode(token, { json: true });

  try {
    const user = await User.findOne({ where: { id: jwtPayload?.id } });

    if (user) {
      if (name || email) {
        User.update({
          name: name ?? user.name,
          email: email ?? user.email
        }, { where: { id: user.id } });

        return res.status(200).send({ message: "Profile is updated" });
      }
      else {
        return res.status(200).send({ message: "Nothing to update" });
      }
    }

  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return res.status(500).send({ message: "Could not complete the request" });
  }
}

const deleteProfile = async (req: Request, res: Response) => {

  const token = req.headers.authorization!.split(" ")[1];
  const jwtPayload = jwt.decode(token, { json: true });

  try {
    await User.destroy({
      where: { id: jwtPayload?.id }
    });

    return res.status(200).send({ message: "User account is deleted", devMessage: "Redirect user to login page" });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return res.status(500).send({ message: "Something went wrong. Could not complete the request." });
  }

}

const resetPassword = async (req: Request, res: Response) => {

  const email = req.body['email'];

  if (!email) {
    return res.status(422).send({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({
      where: { email }
    });

    if (user) {

      const code = Math.floor(Math.random() * (10000 + 1));
      await ResetPasswordCodes.create({
        userId: user.id!,
        code: code
      });

      sendEmail(user.email!, code);

      return res.status(200).send({message: "A verification code is sent to the account email."});

    }
    else {
      return res.status(200).send({ message: "No user was found using this email" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return res.status(500).send({ message: "Could not complete the request. Please try again later." });
  }


}

const userControllers = {
  changePassword,
  resetPassword,
  updateProfile,
  deleteProfile,
};

export default userControllers;