import { mockRequest, mockResponse } from "../../test-utils/mockUtils";
import { fieldValidation } from "../validation";

describe("validation middleware tests", () => {
  describe("fieldValidation method", () => {
    let res: any;
    let spyNext: any;

    beforeEach(() => {
      res = mockResponse();
      spyNext = jest.fn();
    });

    it("when email is given, next method will be called", () => {
      const func = fieldValidation('email');
      const req = mockRequest({ body: { email: "any@email.com" } });
      const res = mockResponse();
      const spyNext = jest.fn();

      func(req, res, spyNext);

      expect(res.status).not.toBeCalledWith(422);
      expect(res.send).not.toBeCalledWith({ message: "Email is required" });
      expect(spyNext).toBeCalledTimes(1);
    });

    it("when email is not given, next method will not be called", () => {
      const func = fieldValidation('email');
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      const spyNext = jest.fn();

      func(req, res, spyNext);

      expect(res.status).toBeCalledWith(422);
      expect(res.send).toBeCalledWith({ message: "Email is required" });
      expect(spyNext).not.toBeCalled();
    });
  });
});