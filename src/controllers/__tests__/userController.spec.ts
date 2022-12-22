import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    let req: any;
    beforeEach(() => {
      req = mockRequest({
        headers: { authorization: "anyjsonwebtoken" },
        body: {},
      });
    });

    it("when exception happens to get user by id, 500 code and failure message will be sent as response", async () => {
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.reject());

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({
        message: "Something went wrong. Please try again later.",
      });
    });

    it("when wrong current password is given, 401 code and failure message is sent as response", async () => {
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.resolve({} as User));
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.json).toBeCalledWith({ message: "Password is incorrect" });
    });

    it("when exeception happens to update password, 500 code and failure message will be sent as response", async () => {
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.resolve({} as User));
      jest
        .spyOn(userService, "updatePassword")
        .mockResolvedValue(Promise.reject(new Error("custom exception")));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
      bcrypt.hash = jest.fn().mockResolvedValue("hashpassword");

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({
        message:
          "Something went wrong. Please try again later. Exception: custom exception",
      });
    });

    it("when affected row count is zero, 404 code and failure message is sent as response", async () => {
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.resolve({} as User));
      jest
        .spyOn(userService, "updatePassword")
        .mockResolvedValue(Promise.resolve([0]));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
      bcrypt.hash = jest.fn().mockResolvedValue("hashpassword");

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({
        message: "Something went worng. Could not change the password",
      });
    });

    it("when password is changed successfully, 200 code and succes message is sent as response", async () => {
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.resolve({} as User));
      jest
        .spyOn(userService, "updatePassword")
        .mockResolvedValue(Promise.resolve([1]));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
      bcrypt.hash = jest.fn().mockResolvedValue("hashpassword");

      await userControllers.changePassword(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({ message: "Password is changed" });
    });
  });

  describe("updateProfile method", () => {
    let req: any;
    beforeEach(() => {
      req = mockRequest({
        headers: { authorization: "anyjsonwebtoken" },
        body: { email: "new@email.com" },
      });
    });

    it("when exception occurs, 500 code and failure message will be sent as response", async () => {
      req = mockRequest({
        headers: { authorization: "anyjsonwebtoken" },
        body: {},
      });
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.reject());
      await userControllers.updateProfile(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Could not complete the request",
      });
    });

    it("when no info is given to update, 422 code and failure message will be sent as response ", async () => {
      req = mockRequest({
        headers: { authorization: "anyjsonwebtoken" },
        body: {},
      });
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.resolve({} as User));

      await userControllers.updateProfile(req, res);

      expect(res.status).toBeCalledWith(422);
      expect(res.send).toBeCalledWith({
        exception: "InvalidArgumentException",
        message: "Nothing to update",
      });
    });

    it("when userService updateUser throws exception, 500 code and failure message will be sent as response", async () => {
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.resolve({} as User));
      jest.spyOn(userService, "updateUser").mockResolvedValue(Promise.reject());

      await userControllers.updateProfile(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Could not complete the request",
      });
    });

    it("when userService updateUser return zero affected row, 404 code will be sent as response", async () => {
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.resolve({} as User));
      jest
        .spyOn(userService, "updateUser")
        .mockResolvedValue(Promise.resolve([0]));

      await userControllers.updateProfile(req, res);

      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith({
        message:
          "Something went wrong. Could not update the profile information",
      });
    });

    it("when userService updateUser successfully update user info, 200 code will be sent as response", async () => {
      jest
        .spyOn(userService, "getUserByUserId")
        .mockResolvedValue(Promise.resolve({} as User));
      jest
        .spyOn(userService, "updateUser")
        .mockResolvedValue(Promise.resolve([1]));

      await userControllers.updateProfile(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({ message: "Profile is updated" });
    });
  });

  describe("deleteProfile method", () => {
    let req: any;
    beforeEach(() => {
      req = mockRequest({
        headers: { authorization: "anyjsonwebtoken" },
        body: { email: "new@email.com" },
      });
    });

    it("when exception occurs, 500 code and failure message will be sent as response", async () => {
      jest.spyOn(userService, "deleteUser").mockResolvedValue(Promise.reject());

      await userControllers.deleteProfile(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Something went wrong. Could not complete the request.",
      });
    });

    it("when userService deleteUser returns zero, 404 code and failure message will be sent as response", async () => {
      jest
        .spyOn(userService, "deleteUser")
        .mockResolvedValue(Promise.resolve(0));

      await userControllers.deleteProfile(req, res);

      expect(res.status).toBeCalledWith(404);
      expect(res.send).toBeCalledWith({
        message: "Something went wrong. Could not find the user.",
      });
    });

    it("when userService successfully deletes the user, 200 code will be sent as response", async () => {
      jest
        .spyOn(userService, "deleteUser")
        .mockResolvedValue(Promise.resolve(1));

      await userControllers.deleteProfile(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith({
        message: "User account is deleted",
        devMessage: "Redirect user to login page",
      });
    });
  });

  describe("resetPassword method", () => {
    let req: any;
    beforeEach(() => {
      req = mockRequest({ body: { email: "any@email.com" } });
    });

    it("when userService getUserByEmail throws exception, 500 code and failure message will be sent", async () => {
      jest
        .spyOn(userService, "getUserByEmail")
        .mockResolvedValue(Promise.reject());

      await userControllers.resetPassword(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({
        message: "Could not complete the request. Please try again later.",
      });
    });

    // TODO: add other tests for this method
  });

  // TODO: add tests for update password
});
