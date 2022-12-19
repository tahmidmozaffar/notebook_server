import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "../../models/user.model";
import userService from "../../services/user.service";
import { mockRequest, mockResponse } from "../../test-utils/mockUtils";
import userControllers from "../user.controller";

describe("User controller tests", () => {
  let res: any;
  beforeEach(() => {
    res = mockResponse();
    jwt.decode = jest.fn().mockReturnValue({ id: "jwtpayload" });
  });

  describe("changePassword method", () => {
    it("when exception happens to get user by id, 500 code and failure message will be sent as response", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" }, body: {} });
      jest.spyOn(userService, 'getUserByUserId').mockResolvedValue(Promise.reject());

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({ message: "Something went wrong. Please try again later." });
    });

    it("when wrong current password is given, 401 code and failure message is sent as response", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" }, body: {} });
      jest.spyOn(userService, 'getUserByUserId').mockResolvedValue(Promise.resolve({} as User));
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.json).toBeCalledWith({ message: "Password is incorrect" });

    });

    it("when exeception happens to update password, 500 code and failure message will be sent as response", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" }, body: {} });
      jest.spyOn(userService, 'getUserByUserId').mockResolvedValue(Promise.resolve({} as User));
      jest.spyOn(userService, 'updatePassword').mockResolvedValue(Promise.reject(new Error("custom exception")));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
      bcrypt.hash = jest.fn().mockResolvedValue("hashpassword");

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({ message: "Something went wrong. Please try again later. Exception: custom exception" });
    });

    it("when affected row count is zero, 404 code and failure message is sent as response", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" }, body: {} });
      jest.spyOn(userService, 'getUserByUserId').mockResolvedValue(Promise.resolve({} as User));
      jest.spyOn(userService, 'updatePassword').mockResolvedValue(Promise.resolve([0]));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
      bcrypt.hash = jest.fn().mockResolvedValue("hashpassword");

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ message: "Something went worng. Could not change the password" });
    });

    it("when password is changed successfully, 200 code and succes message is sent as response", async () => {
      const req = mockRequest({ headers: { authorization: "anyjsonwebtoken" }, body: {} });
      jest.spyOn(userService, 'getUserByUserId').mockResolvedValue(Promise.resolve({} as User));
      jest.spyOn(userService, 'updatePassword').mockResolvedValue(Promise.resolve([1]));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
      bcrypt.hash = jest.fn().mockResolvedValue("hashpassword");

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({ message: "Password is changed" });
    })
  })
})