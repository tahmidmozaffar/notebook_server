import { ResetPasswordCodes } from "../models/resetpasswordcode.model";

const create = async (id: number, code: number) => {
  try {
    const codeEntry = await ResetPasswordCodes.create({
      userId: id,
      code,
    });
    return codeEntry;
  } catch (error) {
    throw error;
  }
};

const getCodeById = async (id: string) => {
  try {
    const entry = await ResetPasswordCodes.findOne({
      where: { id },
    });
    return entry;
  } catch (error) {
    throw error;
  }
};

const deleteCode = async (id: string) => {
  try {
    const count = await ResetPasswordCodes.destroy({
      where: { id },
    });

    if (count === 0) {
      throw new Error("No code is deleted");
    }
  } catch (error) {
    throw error;
  }
};

const resetPasswordCodeService = {
  create,
  getCodeById,
  deleteCode,
};

export default resetPasswordCodeService;
