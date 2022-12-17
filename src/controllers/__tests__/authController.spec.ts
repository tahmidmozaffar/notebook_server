import { User } from "../../models/user.model";
import userService from "../../services/user.service";
import { mockRequest, mockResponse } from "../../test-utils/mockUtils";
import authControllers from "../auth.controller";

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
    })
  });
});
