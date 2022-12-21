import { Note } from "../../models/note.model";
import { mockNote, mockNotes } from "../../test-utils/mockUtils";
import noteService from "../note.service";

describe("Note service tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getNotes method", () => {
    it("when database call is successful, return notes array", async () => {
      const spy = jest.spyOn(Note, 'findAll');
      spy.mockResolvedValue(Promise.resolve(mockNotes));
      const notes = await noteService.getNotes("userid");
      expect(notes).toEqual(mockNotes);
      expect(spy).toBeCalledWith({ where: { userId: "userid" } });
      expect(spy).toBeCalledTimes(1);
    });

    it("when database call is falied, it throws exception", async () => {
      const spy = jest.spyOn(Note, 'findAll');
      spy.mockResolvedValue(Promise.reject(new Error("error message")));

      let notes;
      try {
        notes = await noteService.getNotes("userid");
      } catch (error) {
        expect((error as Error).message).toBe("error message");
      }
      expect(notes).not.toBe(mockNotes);
      expect(spy).toBeCalledWith({ where: { userId: "userid" } });
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe("getNote method", () => {
    it("when database call is successful, return note", async () => {
      const spy = jest.spyOn(Note, 'findOne');
      spy.mockResolvedValue(Promise.resolve(mockNote));
      const note = await noteService.getNote("userid", "id");
      expect(note).toEqual(mockNote);
      expect(spy).toBeCalledWith({ where: { userId: "userid", id: "id" } });
    });

    it("when database call is falied, it throws exception", async () => {
      const spy = jest.spyOn(Note, 'findOne');
      spy.mockResolvedValue(Promise.reject(new Error("error message")));

      let note;
      try {
        note = await noteService.getNote("userid", "id");
      } catch (error) {
        expect((error as Error).message).toBe("error message");
      }
      expect(note).not.toBe(mockNote);
      expect(spy).toBeCalledWith({ where: { userId: "userid", id: "id" } });
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe("addNote method", () => {
    it("when input for tasks is not a valid json, it throws JSONException", async () => {
      try {
        await noteService.addNote(12, "anytitle", "anydescription", "invalidJson");
      } catch (error) {
        expect((error as Error).name).toBe("JSONException");
      }
    });

    it("when it failed to create note, it throws DatabaseException", async () => {
      const spy = jest.spyOn(Note, 'create');
      spy.mockResolvedValue(Promise.reject(new Error()));
      try {
        await noteService.addNote(12, "anytitle", "anydescription", '[{"title":"anytitle"}]');
      } catch (error) {
        expect((error as Error).name).toBe("DatabaseException");
      }
    });

    it("when note is successfully created, it returns the created note", async () => {
      const spy = jest.spyOn(Note, 'create');
      spy.mockResolvedValue(Promise.resolve(mockNote));

      const note = await noteService.addNote(12, mockNote.title, mockNote.description, "{}");
      expect(note).toBe(mockNote);
      expect(spy).toBeCalledWith({ title: mockNote.title, userId: 12, description: mockNote.description, tasks: {}, isDeleted: 0 });
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe("updateNote method", () => {
    it("when note cannot be found, NoteNotFoundException exception is thrown", async () => {
      jest.spyOn(Note, 'findOne').mockResolvedValue(Promise.resolve(null));

      try {
        await noteService.updateNote("userid", "id", "title", "description", "{}");
      }
      catch (error) {
        expect((error as Error).name).toBe("NoteNotFoundException");
      }
    });

    it("when it is faield to retrieve note, it throws DatabaseException", async () => {
      jest.spyOn(Note, 'findOne').mockResolvedValue(Promise.reject());
      try {
        await noteService.updateNote("userid", "id", "title", "description", "{}");
      }
      catch (error) {
        expect((error as Error).name).toBe("DatabaseException");
      }
    });

    it("when tasks is not a valid json, JSONException is thrown", async () => {
      jest.spyOn(Note, 'findOne').mockResolvedValue(Promise.resolve(mockNote));

      try {
        await noteService.updateNote("userid", "id", "title", "description", "invalidjson");
      }
      catch (error) {
        expect((error as Error).name).toBe("JSONException");
      }
    });

    it("when note update is successful, it returns the affected row count", async () => {
      jest.spyOn(Note, 'findOne').mockResolvedValue(Promise.resolve(mockNote));
      jest.spyOn(Note, 'update').mockResolvedValue(Promise.resolve([1]));

      const data = await noteService.updateNote("userid", "id", "title", "description", "{}");
      expect(data).toEqual([1]);
    });

    it("when exception happens on update, it throws DatabaseException", async () => {
      jest.spyOn(Note, 'findOne').mockResolvedValue(Promise.resolve(mockNote));
      jest.spyOn(Note, 'update').mockResolvedValue(Promise.reject());

      try {
        await noteService.updateNote("userid", "id", "title", "description", "{}");
      }
      catch (error) {
        expect((error as Error).name).toBe("DatabaseException");
      }
    });

  });

  describe("deleteNote method", () => {
    it("when database call is successful, return affected row count", async () => {
      const spy = jest.spyOn(Note, 'update');
      spy.mockResolvedValue(Promise.resolve([1]));
      const note = await noteService.deleteNote("userid", "id");
      expect(note).toEqual([1]);
      expect(spy).toBeCalledWith({ isDeleted: 1 }, { where: { userId: "userid", id: "id" } });
    });

    it("when database call is falied, it throws exception", async () => {
      const spy = jest.spyOn(Note, 'update');
      spy.mockResolvedValue(Promise.reject(new Error("error message")));

      try {
        await noteService.deleteNote("userid", "id");
      } catch (error) {
        expect((error as Error).message).toBe("error message");
      }
      expect(spy).toBeCalledWith({ isDeleted: 1 }, { where: { userId: "userid", id: "id" } });
    });
  });

  describe("undoDeleteNote method", () => {
    it("when database call is successful, return affected row count", async () => {
      const spy = jest.spyOn(Note, 'update');
      spy.mockResolvedValue(Promise.resolve([1]));
      const note = await noteService.undoDeleteNote("userid", "id");

      expect(note).toEqual([1]);
      expect(spy).toBeCalledWith({ isDeleted: 0 }, { where: { userId: "userid", id: "id" } });
    });

    it("when database call is falied, it throws exception", async () => {
      const spy = jest.spyOn(Note, 'update');
      spy.mockResolvedValue(Promise.reject(new Error("error message")));

      try {
        await noteService.undoDeleteNote("userid", "id");
      } catch (error) {
        expect((error as Error).message).toBe("error message");
      }
      expect(spy).toBeCalledWith({ isDeleted: 0 }, { where: { userId: "userid", id: "id" } });
    });
  });
});
