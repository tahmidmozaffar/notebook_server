import { Request, Response } from "express";
import { Note } from "../models/note.model";
import jwt from 'jsonwebtoken';

const getNotes = (req: Request, res: Response) => {

  const token = req.headers.authorization!.split(" ")[1];
  const jwtPayload = jwt.decode(token, { json: true });

  Note.findAll({
    where: {
      userId: jwtPayload?.id
    }
  })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
}

const getNote = (req: Request, res: Response) => {
  const id = req.params['id'];
  const token = req.headers.authorization!.split(" ")[1];
  const jwtPayload = jwt.decode(token, { json: true });

  Note.findOne({
    where: {
      userId: jwtPayload?.id,
      id
    }
  }).then(data => {
    if (data) {
      return res.send(data)
    }
    else {
      return res.status(404).send({ message: "Note is not found" });
    }
  })
    .catch(err => res.status(500).send({ message: err.message }));

}

const postNote = (req: Request, res: Response) => {

  const token = req.headers.authorization!.split(" ")[1];
  const jwtPayload = jwt.decode(token, { json: true });

  const title = req.body['title'];
  const description = req.body['description'];
  let tasks;

  try {
    const param = req.body['tasks']
    if (param != null) {
      tasks = JSON.parse(req.body['tasks']);
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return res.status(422).send({ exception: "InvalidArgumentException", message: "tasks must be a valid JSON array" });
  }

  Note.create({ title, userId: jwtPayload?.id, description, tasks, isDeleted: 0 })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
}

const updateNote = async (req: Request, res: Response) => {

  const id = req.params['id'];
  const token = req.headers.authorization!.split(" ")[1];
  const jwtPayload = jwt.decode(token, { json: true });

  let existingData;
  try {
    const data = await Note.findOne({
      where: {
        userId: jwtPayload?.id,
        id
      }
    });

    if (data) {
      existingData = data;
    } else {
      return res.status(404).send({ message: "There is no Note by this id" });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    return res.status(500).send({ message: "Could not complete the request" });
  }

  const req_title = req.body['title'];
  const req_description = req.body['description'];
  const req_tasks = req.body['tasks'];

  if (!req_title && !req_description && !req_tasks) {
    res.status(422).send({ exception: "InvalidArgumentException", message: "There is nothing to update" });
  }

  let tasks;
  try {
    if (req_tasks != null) {
      tasks = JSON.parse(req.body['tasks']);
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return res.status(422).send({ exception: "InvalidArgumentException", message: "tasks must be a valid JSON array" });
  }

  const title = req_title || existingData?.['title'];
  const description = req_description || existingData?.['description'];

  Note.update({
    title,
    description,
    tasks
  }, { where: { id } }).then(data => res.send({ message: "Note is successfully updated" }))
    .catch(err => res.status(500).send({ message: err.message }));

}

const deleteNote = (req: Request, res: Response) => {

  const id = req.params['id'];
  const token = req.headers.authorization!.split(" ")[1];
  const jwtPayload = jwt.decode(token, { json: true });

  Note.update({
    isDeleted: 1
  }, { where: { userId: jwtPayload?.id, id } }).then(data => {
    if (data[0] === 0)
      return res.status(401).send({ message: "Note is not found" })

    return res.status(200).send({ message: "Note is successfully deleted" })
  })
    .catch(err => res.status(500).send({ message: err.message }));
}

const undoDeleteNote = (req: Request, res: Response) => {

  const id = req.params['id'];
  const token = req.headers.authorization!.split(" ")[1];
  const jwtPayload = jwt.decode(token, { json: true });

  Note.update({
    isDeleted: 0
  }, { where: { userId: jwtPayload?.id, id } }).then(data => {
    if (data[0] === 0)
      return res.status(401).send({ message: "Note is not found" });

    return res.status(200).send({ message: "Note is successfully restored" })
  })
    .catch(err => res.status(500).send({ message: err.message }));
}

const noteControllers = {
  getNotes,
  getNote,
  postNote,
  updateNote,
  deleteNote,
  undoDeleteNote,
};

export default noteControllers;
