import { Note } from "../models/note.model";

const getNotes = async (userId: string) => {
  try {
    const notes = await Note.findAll({
      where: {
        userId,
      },
    });
    return notes;
  } catch (error) {
    // TODO: log error
    throw error;
  }
};

const getNote = async (userId: string, id: string) => {
  try {
    const note = await Note.findOne({
      where: {
        userId,
        id,
      },
    });

    return note;
  } catch (error) {
    // TODO: log error
    throw error;
  }
};

const addNote = async (
  userId: number,
  folderId: number,
  title: string,
  description: string  
) => {

  try {
    const note = await Note.create({
      title,
      folderId,
      userId,
      description,      
      isDeleted: 0,
    });

    return note;
  } catch (e) {
    if (e instanceof Error) {
      e.name = "DatabaseException";
    }
    throw e;
  }
};

const updateNote = async (
  userId: string,
  id: string,
  title: string,
  description: string,  
) => {
  let existingData;
  try {
    const data = await Note.findOne({
      where: {
        userId,
        id,
      },
    });
    if (data) {
      existingData = data;
    } else {
      const error = new Error();
      error.name = "NoteNotFoundException";
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (!error.name) {
        error.name = "DatabaseException";
      }
      throw error;
    }
  }

  const updatedTitle = title || existingData?.["title"];
  const updatedDescription = description || existingData?.["description"];

  try {
    const note = await Note.update(
      {
        title: updatedTitle,
        description: updatedDescription,        
      },
      { where: { id } }
    );
    return note;
  } catch (error) {
    if (error instanceof Error) {
      error.name = "DatabaseException";
      throw error;
    }
  }
};

const deleteNote = async (userId: string, id: string) => {
  try {
    const data = await Note.update(
      { isDeleted: 1 },
      {
        where: {
          userId,
          id,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const undoDeleteNote = async (userId: string, id: string) => {
  try {
    const data = await Note.update(
      { isDeleted: 0 },
      {
        where: {
          userId,
          id,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const noteService = {
  getNotes,
  getNote,
  addNote,
  updateNote,
  deleteNote,
  undoDeleteNote,
};

export default noteService;
