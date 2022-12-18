import jwt from 'jsonwebtoken';
import noteServices from '../../services/note.service';
import { mockRequest, mockResponse } from '../../test-utils/mockUtils';
import noteControllers from '../note.controller';

describe("Note controller tests", () => {
  describe("getNotes method", () => {
    it("when exception happens, 500 code and failure message will be sent", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" } });
      const res = mockResponse();

      jwt.decode = jest.fn().mockReturnValue({ id: "jwtpayload" });
      jest.spyOn(noteServices, 'getNotes').mockResolvedValue(Promise.reject());

      await noteControllers.getNotes(req, res);

      expect(res.status).not.toBeCalledWith(201);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({ message: "Something went wrong. Could not retrive notes" });
    });
  });
})