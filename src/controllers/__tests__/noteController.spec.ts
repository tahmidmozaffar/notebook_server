import jwt from 'jsonwebtoken';
import noteServices from '../../services/note.service';
import { mockNote, mockNotes, mockRequest, mockResponse } from '../../test-utils/mockUtils';
import noteControllers from '../note.controller';

describe("Note controller tests", () => {
  let res: any;
  beforeEach(() => {
    res = mockResponse();
    jwt.decode = jest.fn().mockReturnValue({ id: "jwtpayload" });
  });

  describe("getNotes method", () => {
    it("when exception happens, 500 code and failure message will be sent", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" } });      
      jest.spyOn(noteServices, 'getNotes').mockResolvedValue(Promise.reject());

      await noteControllers.getNotes(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({ message: "Something went wrong. Could not retrive notes" });
    });

    it("when no exception occurs, 200 code and notes array will be sent", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" } });      
      jest.spyOn(noteServices, 'getNotes').mockResolvedValue(Promise.resolve(mockNotes));

      await noteControllers.getNotes(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockNotes);
    });
  });

  describe("getNote method", () => {
    it("when exception happens, 500 code and failure message will be sent", async () => {
      const req = mockRequest({ params: { id: "anyid" }, headers: { authorization: "anyjsonwebtoken" } });    
      jest.spyOn(noteServices, 'getNote').mockResolvedValue(Promise.reject());

      await noteControllers.getNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({ message: "Something went wrong. Could not retrive the note." });
    });

    it("when called with valid id and token, 200 code and note object will be returned", async () => {
      const req = mockRequest({ params: { id: "anyid" }, headers: { authorization: "anyjsonwebtoken" } });      
      jest.spyOn(noteServices, 'getNote').mockResolvedValue(Promise.resolve(mockNote));

      await noteControllers.getNote(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(mockNote);
    });

    it("when called with valid token but wrong id, 404 code and note not found message will be returned", async () => {
      const req = mockRequest({ params: { id: "anyid" }, headers: { authorization: "anyjsonwebtoken" } });      
      jest.spyOn(noteServices, 'getNote').mockResolvedValue(Promise.resolve(null));

      await noteControllers.getNote(req, res);
      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith({ message: "Note is not found" });
    });
  });

  describe("postNote method", () => {
    it("when tasks array not valid, JSONException occurs and 422 code is sent", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" }, body: {} });    

      const error = new Error();
      error.name = "JSONException";
      jest.spyOn(noteServices, 'addNote').mockResolvedValue(Promise.reject(error));

      await noteControllers.postNote(req, res);

      expect(res.status).toBeCalledWith(422);
      expect(res.send).toBeCalledWith({ exception: "InvalidArgumentException", message: "Tasks must be a valid JSON array" });
    });

    it("when DatabaseException occurs, 500 code and failure message is sent", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" }, body: {} });      

      const error = new Error();
      error.name = "DatabaseException";
      jest.spyOn(noteServices, 'addNote').mockResolvedValue(Promise.reject(error));

      await noteControllers.postNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({ mesage: "Something went wrong. Could not add the note." });
    });

    it("when any exception other than JSONException or DatabaseException occurs, 500 code and failure message is sent", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" }, body: {} });      
      jest.spyOn(noteServices, 'addNote').mockResolvedValue(Promise.reject(new Error()));

      await noteControllers.postNote(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({ message: "Something went wrong." });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
