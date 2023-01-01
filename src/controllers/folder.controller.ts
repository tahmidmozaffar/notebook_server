import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import folderService from "../services/folder.service";

const getFolders = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  const jwtPayload = jwt.decode(token, { json: true });

  try {
    const folders = await folderService.getFolders(jwtPayload?.id);
    return res.status(200).json(folders);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Something went wrong. Could not retrive folders" });
  }
};

const addFolder = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  const jwtPayload = jwt.decode(token, { json: true });

  const name = req.body["name"];
  try {
    const folders = await folderService.addFolder(jwtPayload?.id, name);
    return res.status(200).json(folders);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Something went wrong. Could not retrive folders" });
  }
};

const deletedFolder = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  const jwtPayload = jwt.decode(token, { json: true });
  const id = req.body["id"];

  try {
    const data = await folderService.deleteFolder(jwtPayload?.id, id);

    if (data > 0) {
      return res.status(200).send({
        message: "Folder is deleted",
      });
    }

    return res
      .status(404)
      .send({ message: "Something went wrong. Could not find the folder." });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return res.status(500).send({
      message: "Something went wrong. Could not complete the request.",
    });
  }

};

const folderController = {
  getFolders,
  addFolder,
  deletedFolder,
};

export default folderController;
