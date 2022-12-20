import { Note } from "../../models/note.model";
import { mockNotes } from "../../test-utils/mockUtils";
import noteService from "../note.service";

describe("Note service tests", () => {
  describe("getNotes method", () => {
    it("when database call is successful, return notes array", async () => {
      jest.spyOn(Note, 'findAll').mockResolvedValue(Promise.resolve(mockNotes));
      const notes = await noteService.getNotes("id");
      expect(notes).toEqual(mockNotes);
    });

    it("when database call is falied, it throws exception", async () => {
      jest.spyOn(Note, 'findAll').mockResolvedValue(Promise.reject(new Error("error message")));

      try {
        console.log("before getnotes");
        await noteService.getNotes("id");
        console.log("after getnotes");
      } catch (error) {

        expect((error as Error).message).toBe("error message");
      }
    });
  });
});