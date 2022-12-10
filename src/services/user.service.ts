import bcrypt from 'bcrypt';
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

const getUserByUsername = async (username: string) => {

  try {
    const user = await User.findOne({ where: { username } });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      error.name = "DatabaseException";
    }
    throw error;
  }

}

const getUserByUserId = async (id: string) => {
  try {
    const user = await User.findOne({ where: { id } });
    return user;
  } catch (error) {
    throw error;
  }
}

const getUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({
      where: { email }
    });
    return user;
  } catch (error) {
    throw error;
  }
}

const updatePassword = async (id: string, hashedPassword: string) => {
  try {
    const data = await User.update({
      password: hashedPassword,
    }, { where: { id } });

    return data;
  } catch (error) {
    throw error;
  }
}

const updateUser = async (id: string, name: string, email: string) => {
  try {
    const data = await User.update({
      name,
      email
    }, { where: { id } });

    return data;
  } catch (error) {
    throw error;
  }
}

const deleteUser = async (id: string) => {
  try {
    const data = await User.destroy({
      where: {
        id
      }
    });

    return data;
  } catch (error) {
    throw error;
  }
}

const userService = {
  createUser,
  getUserByUsername,
  getUserByUserId,
  getUserByEmail,
  updatePassword,
  updateUser,
  deleteUser,
}

export default userService;
