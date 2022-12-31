import { initUserModel } from "./user.model";
import { initNoteModel } from "./note.model";
import { initResetPasswordCodesModel } from "./resetpasswordcode.model";
import { initFolderModel } from "./folder.model";

export const initializeModels = () => {
  initFolderModel();
  initNoteModel();
  initResetPasswordCodesModel();
  initUserModel();
};
