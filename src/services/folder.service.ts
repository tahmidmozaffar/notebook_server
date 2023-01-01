import { Folder } from "../models/folder.model";

const getFolders = async (userId: number) => {
  try {
    const folders = await Folder.findAll({
      where: {
        userId
      }
    });
    return folders;
  }
  catch (error) {
    throw error;
  }
};

const addFolder = async (userId: number, name: string) => {
  try {
    const folder = await Folder.create({
      userId,
      name
    });
    return folder;
  } catch (error) {
    throw error;
  }
};

const deleteFolder = async (userId: number, id: number) => {
  try {
    const data = await Folder.destroy({
      where: {
        id
      }
    });
    return data;
  }
  catch (error) {
    throw error;
  }
};

const folderService = {
  getFolders,
  addFolder,
  deleteFolder,
};

export default folderService;
