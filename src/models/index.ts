import { initUserModel } from "./user.model";
import { initNoteModel } from "./note.model";
import { initResetPasswordCodesModel } from "./resetpasswordcode.model";

export const initializeModels = () => {
  initNoteModel();
  initResetPasswordCodesModel();
  initUserModel();
};
