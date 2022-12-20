import { Note } from "../../models/note.model";
import { mockNote, mockNotes } from "../../test-utils/mockUtils";
import noteService from "../note.service";

describe("Note service tests", () => {
  describe("getNotes method", () => {
    it("when database call is successful, return notes array", async () => {
      const spy = jest.spyOn(Note, 'findAll');
      spy.mockResolvedValue(Promise.resolve(mockNotes));
      const notes = await noteService.getNotes("userid");
      expect(notes).toEqual(mockNotes);
      expect(spy).toBeCalledWith({ where: { userId: "userid" } });
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
    });
  });

  describe("addNote method", () => {
    // TODO
  });

  describe("updateNote method", () => {
    // TODO
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