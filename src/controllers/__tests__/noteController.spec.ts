import jwt from "jsonwebtoken";
import noteServices from "../../services/note.service";
import {
  mockNote,
  mockNotes,
  mockRequest,
  mockResponse,
} from "../../test-utils/mockUtils";
import noteControllers from "../note.controller";

describe("Note controller tests", () => {
  let res: any;
  beforeEach(() => {
    res = mockResponse();
    jwt.decode = jest.fn().mockReturnValue({ id: "jwtpayload" });
  });

  describe("getNotes method", () => {
    it("when exception happens, 500 code and failure message will be sent", async () => {
      const req = mockRequest({
        headers: { authorization: "anyjsonwebtoken" },
      });
      jest.spyOn(noteServices, "getNotes").mockResolvedValue(Promise.reject());

      await noteControllers.getNotes(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Something went wrong. Could not retrive notes",
      });
    });

    it("when no exception occurs, 200 code and notes array will be sent", async () => {
      const req = mockRequest({
        headers: { authorization: "anyjsonwebtoken" },
      });
      jest
        .spyOn(noteServices, "getNotes")
        .mockResolvedValue(Promise.resolve(mockNotes));

      await noteControllers.getNotes(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockNotes);
    });
  });

  describe("getNote method", () => {
    it("when exception happens, 500 code and failure message will be sent", async () => {
      const req = mockRequest({
        params: { id: "anyid" },
        headers: { authorization: "anyjsonwebtoken" },
      });
      jest.spyOn(noteServices, "getNote").mockResolvedValue(Promise.reject());

      await noteControllers.getNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Something went wrong. Could not retrive the note.",
      });
    });

    it("when called with valid id and token, 200 code and note object will be returned", async () => {
      const req = mockRequest({
        params: { id: "anyid" },
        headers: { authorization: "anyjsonwebtoken" },
      });
      jest
        .spyOn(noteServices, "getNote")
        .mockResolvedValue(Promise.resolve(mockNote));

      await noteControllers.getNote(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockNote);
    });

    it("when called with valid token but wrong id, 404 code and note not found message will be returned", async () => {
      const req = mockRequest({
        params: { id: "anyid" },
        headers: { authorization: "anyjsonwebtoken" },
      });
      jest
        .spyOn(noteServices, "getNote")
        .mockResolvedValue(Promise.resolve(null));

      await noteControllers.getNote(req, res);
      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith({ message: "Note is not found" });
    });
  });

  describe("postNote method", () => {
    let req: any;
    beforeEach(() => {
      req = mockRequest({
        headers: { authorization: "anyjsonwebtoken" },
        body: {},
      });
    });

    it("when tasks array not valid, JSONException occurs and 422 code is sent", async () => {
      const error = new Error();
      error.name = "JSONException";
      jest
        .spyOn(noteServices, "addNote")
        .mockResolvedValue(Promise.reject(error));

      await noteControllers.postNote(req, res);

      expect(res.status).toBeCalledWith(422);
      expect(res.send).toBeCalledWith({
        exception: "InvalidArgumentException",
        message: "Tasks must be a valid JSON array",
      });
    });

    it("when DatabaseException occurs, 500 code and failure message is sent", async () => {
      const error = new Error();
      error.name = "DatabaseException";
      jest
        .spyOn(noteServices, "addNote")
        .mockResolvedValue(Promise.reject(error));

      await noteControllers.postNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        mesage: "Something went wrong. Could not add the note.",
      });
    });

    it("when any exception other than JSONException or DatabaseException occurs, 500 code and failure message is sent", async () => {
      jest
        .spyOn(noteServices, "addNote")
        .mockResolvedValue(Promise.reject(new Error()));

      await noteControllers.postNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({ message: "Something went wrong." });
    });

    it("when successfully note is added, 200 code and created note is sent as response", async () => {
      jest
        .spyOn(noteServices, "addNote")
        .mockResolvedValue(Promise.resolve(mockNote));

      await noteControllers.postNote(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockNote);
    });
  });

  describe("updateNote method", () => {
    let req: any;

    beforeEach(() => {
      req = mockRequest({
        params: { id: "anyid" },
        headers: { authorization: "anyjsonwebtoken" },
        body: {
          title: "anytitle",
          description: "anydescription",
          tasksJson: {},
        },
      });
    });

    it("when NoteNotFoundException occurs, 404 code and failure message will be sent as response", async () => {
      const error = new Error();
      error.name = "NoteNotFoundException";
      jest
        .spyOn(noteServices, "updateNote")
        .mockResolvedValue(Promise.reject(error));

      await noteControllers.updateNote(req, res);

      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith({
        message: "No note was found using the id",
      });
    });

    it("when JSONException occurs, 422 code and failure message will be sent as response", async () => {
      const error = new Error();
      error.name = "JSONException";
      jest
        .spyOn(noteServices, "updateNote")
        .mockResolvedValue(Promise.reject(error));

      await noteControllers.updateNote(req, res);

      expect(res.status).toBeCalledWith(422);
      expect(res.send).toBeCalledWith({
        exception: "InvalidArgumentException",
        message: "Tasks must be a valid JSON array",
      });
    });

    it("when DatabaseException occurs, 500 code and failure message will be sent as response", async () => {
      const error = new Error();
      error.name = "DatabaseException";
      jest
        .spyOn(noteServices, "updateNote")
        .mockResolvedValue(Promise.reject(error));

      await noteControllers.updateNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        mesage: "Something went wrong. Could not update the note.",
      });
    });

    it("when any other exception occurs, 500 code and failure message will be sent as response", async () => {
      const error = new Error();
      jest
        .spyOn(noteServices, "updateNote")
        .mockResolvedValue(Promise.reject(error));

      await noteControllers.updateNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({ message: "Something went wrong." });
    });

    it("if no info is not given, note will be not updated and 422 code will be sent as response", async () => {
      const req = mockRequest({
        params: { id: "anyid" },
        headers: { authorization: "anyjsonwebtoken" },
        body: {},
      });

      const spy = jest.spyOn(noteServices, "updateNote");

      await noteControllers.updateNote(req, res);

      expect(spy).not.toBeCalled();
      expect(res.status).toBeCalledWith(422);
      expect(res.send).toBeCalledWith({
        exception: "InvalidArgumentException",
        message: "There is nothing to update",
      });
    });

    it("it note was not updated, 500 code and failure message will be sent as response", async () => {
      jest
        .spyOn(noteServices, "updateNote")
        .mockResolvedValue(Promise.resolve([0]));

      await noteControllers.updateNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Something went wrong. Could not update the note.",
      });
    });

    it("it note was not updated undefined, 500 code and failure message will be sent as response", async () => {
      jest
        .spyOn(noteServices, "updateNote")
        .mockResolvedValue(Promise.resolve(undefined));

      await noteControllers.updateNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Something went wrong. Could not update the note.",
      });
    });

    it("if note was updated successfully, 200 code and success message will be sent as response", async () => {
      jest
        .spyOn(noteServices, "updateNote")
        .mockResolvedValue(Promise.resolve([1]));

      await noteControllers.updateNote(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({
        message: "Note is successfully updated",
      });
    });
  });

  describe("deleteNote method", () => {
    let req: any;
    beforeEach(() => {
      req = mockRequest({
        params: { id: "anyid" },
        headers: { authorization: "anyjsonwebtoken" },
      });
    });

    it("when exception occurs, 500 code and failure message will be sent as response", async () => {
      jest
        .spyOn(noteServices, "deleteNote")
        .mockResolvedValue(Promise.reject());

      await noteControllers.deleteNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Something went wrong. Could not delete the note.",
      });
    });

    it("when affected row count is zero, 401 code and failure message will be sent as response", async () => {
      jest
        .spyOn(noteServices, "deleteNote")
        .mockResolvedValue(Promise.resolve([0]));

      await noteControllers.deleteNote(req, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.send).toBeCalledWith({ message: "Note is not found" });
    });

    it("when note is successfully deleted, 200 code and success message will be sent as response", async () => {
      jest
        .spyOn(noteServices, "deleteNote")
        .mockResolvedValue(Promise.resolve([1]));

      await noteControllers.deleteNote(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({
        message: "Note is successfully deleted.",
      });
    });
  });

  describe("undoDeleteNote method", () => {
    let req: any;
    beforeEach(() => {
      req = mockRequest({
        params: { id: "anyid" },
        headers: { authorization: "anyjsonwebtoken" },
      });
    });

    it("when exception occurs, 500 code and failure message will be sent as response", async () => {
      jest
        .spyOn(noteServices, "undoDeleteNote")
        .mockResolvedValue(Promise.reject());

      await noteControllers.undoDeleteNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Something went wrong. Could not restore the note.",
      });
    });

    it("when affected row count is zero, 401 code and failure message will be sent as response", async () => {
      jest
        .spyOn(noteServices, "undoDeleteNote")
        .mockResolvedValue(Promise.resolve([0]));

      await noteControllers.undoDeleteNote(req, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.send).toBeCalledWith({ message: "Note is not found" });
    });

    it("when note is successfully deleted, 200 code and success message will be sent as response", async () => {
      jest
        .spyOn(noteServices, "undoDeleteNote")
        .mockResolvedValue(Promise.resolve([1]));

      await noteControllers.undoDeleteNote(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({
        message: "Note is successfully restored.",
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
