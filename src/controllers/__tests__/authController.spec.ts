import { User } from "../../models/user.model";
import userService from "../../services/user.service";
import { mockRequest, mockResponse } from "../../test-utils/mockUtils";
import authControllers from "../auth.controller";

describe("Auth controller tests", () => {
  describe("Signup method", () => {

    it("when there is no exception, createUser will be called, 201 code and success message will be sent", async () => {
      const req = mockRequest();
      const res = mockResponse();

      jest.spyOn(userService, 'createUser').mockResolvedValue({} as User);
      await authControllers.signup(req, res);

      expect(userService.createUser).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(201)
      expect(res.send).toBeCalledWith("User is created successfully")
    });
  });
});
