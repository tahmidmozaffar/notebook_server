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

const postNote = () => {

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
  postNote,
  updateNote,
  deleteNote,
  undoDeleteNote,
}

export default noteServices;