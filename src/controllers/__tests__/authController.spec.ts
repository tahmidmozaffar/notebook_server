import { User } from "../../models/user.model";
import userService from "../../services/user.service";
import { mockRequest, mockResponse } from "../../test-utils/mockUtils";
import authControllers from "../auth.controller";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe("Auth controller tests", () => {

  describe("Signup method", () => {

    it("when no exception happens, createUser will be called, 201 code and success message will be sent", async () => {
      const req = mockRequest({});
      const res = mockResponse();
      jest.spyOn(userService, 'createUser').mockResolvedValue({} as User);

      await authControllers.signup(req, res);

      expect(userService.createUser).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(201);
      expect(res.send).toBeCalledWith("User is created successfully");
    });

    it("when excepton happens, 500 code and failure message will be sent", async () => {
      const req = mockRequest({});
      const res = mockResponse();
      jest.spyOn(userService, 'createUser').mockResolvedValue(Promise.reject());

      await authControllers.signup(req, res);
      expect(userService.createUser).toBeCalledTimes(1);
      expect(res.status).not.toBeCalledWith(201);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith({ message: "Something went wrong. Please try again." });
    });

    it("createUser of userService will be call with body parameter", async () => {
      const name = "any name";
      const username = "anyusername";
      const password = "anypassword";
      const email = "any@email.com";

      const req = mockRequest({
        name,
        username,
        password,
        email,
      });
      const res = mockResponse();

      const spy = jest.spyOn(userService, "createUser");
      await authControllers.signup(req, res);
      expect(spy).toHaveBeenCalledWith(name, username, password, email);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe("Login method", () => {
    it("when exception happens, 500 code and failure message will be sent", async () => {
      const req = mockRequest({});
      const res = mockResponse();
      jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(Promise.reject());

      await authControllers.login(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({ message: "Something went wrong. Try again later" });
    });

    it("userservice.getUserByUsername will be called with username from request body", async () => {

      const req = mockRequest({ username: "anyusername" });
      const res = mockResponse();
      const spy = jest.spyOn(userService, 'getUserByUsername');

      await authControllers.login(req, res);

      expect(spy).toBeCalledWith("anyusername");
    });

    it("when no user exists with the username, 404 code and 'User does not exist' message will be sent", async () => {
      const req = mockRequest({ username: "anyusername" });
      const res = mockResponse();
      jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(null);

      await authControllers.login(req, res);

      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ message: "User does not exist" });
    });

    it("when called with valid username and password, 200 code and success message with token will be sent", async () => {
      const req = mockRequest({ username: "validusername", password: "validpassword" });
      const res = mockResponse();

      jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(Promise.resolve({} as User));
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("generatedtoken");

      await authControllers.login(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({ message: "Successfully logged in", token: "generatedtoken" });
    });

    it("when called with wrong password, 401 code and failure message will be sent ", async () => {
      const req = mockRequest({ username: "validusername", password: "validpassword" });
      const res = mockResponse();

      jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(Promise.resolve({} as User));
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await authControllers.login(req, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.json).toBeCalledWith({ message: "Password is incorrect" });

    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
