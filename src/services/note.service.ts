import { Note } from "../models/note.model"

const getNotes = async (userId: string) => {

  try {
    const notes = await Note.findAll({
      where: {
        userId
      }
    });
    return notes;
  }
  catch (error) {
    // TODO: log error
    throw error;
  }
}

const getNote = async (userId: string, id: string) => {
  try {
    const note = await Note.findOne({
      where: {
        userId,
        id
      }
    });

    return note;
  } catch (error) {
    // TODO: log error
    throw error
  }
}

const addNote = async (userId: number, title: string, description: string, tasksJson: string) => {
  let tasks;
  try {
    if (tasksJson != null) {
      tasks = JSON.parse(tasksJson);
    }
  } catch (e) {
    if (e instanceof Error) {
      e.name = "JSONException"
    }
    throw e;
  }

  try {
    const note = await Note.create({
      title, userId, description, tasks, isDeleted: 0
    });

    return note;
  } catch (e) {
    if (e instanceof Error) {
      e.name = "DatabaseException"
    }
    throw e;
  }

}

const updateNote = () => {

}

const deleteNote = () => {

}

const undoDeleteNote = () => {

}

const noteServices = {
  getNotes,
  getNote,
  addNote,
  updateNote,
  deleteNote,
  undoDeleteNote,
}

export default noteServices;