import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import noteService from "../services/note.service";

const getNotes = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  const jwtPayload = jwt.decode(token, { json: true });

  try {
    const notes = await noteService.getNotes(jwtPayload?.id);
    return res.status(200).send(notes);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Something went wrong. Could not retrive notes" });
  }
};

const getNote = async (req: Request, res: Response) => {
  const id = req.params["id"];
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  const jwtPayload = jwt.decode(token, { json: true });

  try {
    const note = await noteService.getNote(jwtPayload?.id, id);

    if (note) {
      return res.status(200).send(note);
    } else {
      return res.status(404).send({ message: "Note is not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Something went wrong. Could not retrive the note." });
  }
};

const postNote = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  const jwtPayload = jwt.decode(token, { json: true });

  const folderId = req.body["folderId"];
  const title = req.body["title"];
  const description = req.body["description"];

  try {
    const note = await noteService.addNote(
      jwtPayload?.id,
      folderId,
      title,
      description,
    );
    if (note) {
      return res.status(200).send(note);
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      if (e.name) {
        switch (e.name) {
          case "DatabaseException":
            return res.status(500).send({
              mesage: "Something went wrong. Could not add the note.",
            });
        }
      }
    }
    return res.status(500).send({ message: "Something went wrong." });
  }
};

const updateNote = async (req: Request, res: Response) => {
  const id = req.params["id"];
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  const jwtPayload = jwt.decode(token, { json: true });

  const title = req.body["title"];
  const description = req.body["description"];

  if (!title && !description) {
    return res.status(422).send({
      exception: "InvalidArgumentException",
      message: "There is nothing to update",
    });
  }

  try {
    const note = await noteService.updateNote(
      jwtPayload?.id,
      id,
      title,
      description
    );

    if (!note || note?.[0] === 0) {
      return res
        .status(500)
        .send({ message: "Something went wrong. Could not update the note." });
    } else {
      return res.status(200).send({ message: "Note is successfully updated" });
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name) {
        switch (error.name) {
          case "NoteNotFoundException":
            return res
              .status(404)
              .send({ message: "No note was found using the id" });          
          case "DatabaseException":
            return res.status(500).send({
              mesage: "Something went wrong. Could not update the note.",
            });
        }
      }
    }
    return res.status(500).send({ message: "Something went wrong." });
  }
};

const deleteNote = async (req: Request, res: Response) => {
  const id = req.params["id"];
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  const jwtPayload = jwt.decode(token, { json: true });

  try {
    const data = await noteService.deleteNote(jwtPayload?.id, id);

    if (data[0] === 0) {
      return res.status(401).send({ message: "Note is not found" });
    }

    return res.status(200).send({ message: "Note is successfully deleted." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Something went wrong. Could not delete the note." });
  }
};

const undoDeleteNote = async (req: Request, res: Response) => {
  const id = req.params["id"];
  const token = req.headers.authorization?.split(" ")[1] ?? "";
  const jwtPayload = jwt.decode(token, { json: true });

  try {
    const data = await noteService.undoDeleteNote(jwtPayload?.id, id);

    if (data[0] === 0) {
      return res.status(401).send({ message: "Note is not found" });
    }

    return res.status(200).send({ message: "Note is successfully restored." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Something went wrong. Could not restore the note." });
  }
};

const noteControllers = {
  getNotes,
  getNote,
  postNote,
  updateNote,
  deleteNote,
  undoDeleteNote,
};

export default noteControllers;
