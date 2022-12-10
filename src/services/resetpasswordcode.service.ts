import { ResetPasswordCodes } from "../models/resetpasswordcode.model";

const create = async (id: number, code: number) => {
  try {
    const codeEntry = await ResetPasswordCodes.create({
      userId: id,
      code: code
    });
    return codeEntry;
  } catch (error) {
    throw error;
  }
}

const resetPasswordCodeService = {
  create,
}

export default resetPasswordCodeService;
