import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model";

const createUser = async (name: string, username: string, password: string, email: string) => {

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      name, username, password: hashedPassword, email
    });
    return user;
  }
  catch (error) {
    throw error;
  }
}

const authService = {
  createUser,
}

export default authService;
