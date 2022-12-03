import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "../models/user.model";
import { ResetPasswordCodes } from "../models/resetpasswordcode.model";
import sendEmail from "../services/mailer.service";
import { split } from "../utils";

const changePassword = async (req: Request, res: Response) => {

  const currentPassword = req.body['currentPassword'];
  const newPassword = req.body['newPassword'];

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
    
    // need to improve this. 
    // deleting user should works without deleting ResetPasswordCodes entry first
    await ResetPasswordCodes.destroy({
      where: {userId: jwtPayload?.id}
    });

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

  try {
    const user = await User.findOne({
      where: { email }
    });

    if (user) {

      // create a random number between 1000 and 9999
      const code = Math.floor(1000 + Math.random() * (9999 - 1000 + 1));

      const codeEntry = await ResetPasswordCodes.create({
        userId: user.id!,
        code: code
      });

      console.log(codeEntry);

      const verificationCode = code.toString() + codeEntry.id!.toString();

      sendEmail(user.email!, verificationCode);

      return res.status(200).send({ message: "A verification code is sent to the account email." });
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

const updatePassword = async (req: Request, res: Response) => {

  const code = req.body['code'];
  const newPassword = req.body['newPassword'];

  if (!code) {
    return res.status(422).send({ message: "Verification code is required" });
  }

  try {
    const [verificationCode, id] = split(code, 4);

    const entry = await ResetPasswordCodes.findOne({
      where: { id }
    });

    if (!entry || entry.code !== parseInt(verificationCode)) {
      return res.status(401).send({ message: "the verification code is not correct" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.update({
      password: hashedPassword
    }, { where: { id: entry.userId } });

    await ResetPasswordCodes.destroy({
      where: { id }
    });

    return res.status(200).send({ message: "Password is reset" })

  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    return res.status(500).send({ message: "Something went wrong" })
  }

}

const userControllers = {
  changePassword,
  updateProfile,
  deleteProfile,
  resetPassword,
  updatePassword,
};

export default userControllers;
