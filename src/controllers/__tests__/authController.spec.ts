import { Request, Response } from "express";
import { User } from "../../models/user.model";
import userService from "../../services/user.service";
import authControllers from "../auth.controller";

describe("Auth controller tests", () => {
  describe("Signup method", () => {

    it("when there is no exception, createUser will be called, 201 code and success message will be sent", async () => {

      const req = {
        body: {
          name: "zxczxc",
          username: "cva",
          password: "112",
          email: "tah@gmail.com"
        }
      } as Request;

      const res = {
        status: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;
      jest.spyOn(userService, 'createUser').mockResolvedValue({} as User);
      await authControllers.signup(req, res);

      expect(userService.createUser).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(201)
      expect(res.send).toBeCalledWith("User is created successfully")
    });
  });
});
