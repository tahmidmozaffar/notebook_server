import { mockRequest, mockResponse } from "../../test-utils/mockUtils";
import { confirmPasswordValidation, emailValidation, fieldValidation } from "../validation";

describe("validation middleware tests", () => {
  let res: any;
  let nextSpy: any;

  beforeEach(() => {
    res = mockResponse();
    nextSpy = jest.fn();
  });

  describe("fieldValidation method", () => {
    it("when email is given, next method will be called", () => {
      const func = fieldValidation('email');
      const req = mockRequest({ body: { email: "any@email.com" } });

      func(req, res, nextSpy);

      expect(res.status).not.toBeCalledWith(422);
      expect(res.send).not.toBeCalledWith({ message: "Email is required" });
      expect(nextSpy).toBeCalledTimes(1);
    });

    it("when email is not given, next method will not be called", () => {
      const func = fieldValidation('email');
      const req = mockRequest({ body: {} });

      func(req, res, nextSpy);

      expect(res.status).toBeCalledWith(422);
      expect(res.send).toBeCalledWith({ message: "Email is required" });
      expect(nextSpy).not.toBeCalled();
    });
  });

  describe("confirmPasswordValidation method", () => {
    it("when new password and confirm password are same, next method will be called", () => {
      const req = mockRequest({ body: { newPassword: "password", confirmPassword: "password" } });

      confirmPasswordValidation(req, res, nextSpy);

      expect(res.status).not.toBeCalledWith(422);
      expect(res.send).not.toBeCalledWith({ message: "Password does not match" });
      expect(nextSpy).toBeCalledTimes(1);
    });

    it("when new password and confirm password are different, next method will not be called", () => {
      const req = mockRequest({ body: { newPassword: "password", confirmPassword: "otherpassword" } });

      confirmPasswordValidation(req, res, nextSpy);

      expect(res.status).toBeCalledWith(422);
      expect(res.send).toBeCalledWith({ message: "Password does not match" });
      expect(nextSpy).not.toBeCalled();
    });
  });

  describe("emailValidation method", () => {
    it("when email is not given, 422 code will be sent", () => {
      const req = mockRequest({ body: {} });

      emailValidation(req, res, nextSpy);

      expect(res.status).toBeCalledWith(422);
      expect(res.send).toBeCalledWith({ message: "Email is required" });
      expect(nextSpy).not.toBeCalled();
    });

    it("when email is valid, next method will be called", () => {

      const emails = [
        'any@email.com',
        '12asd@email.com',
        'asdasd12@email.com',
      ];

      emails.forEach(email => {
        const req = mockRequest({ body: { email } });

        emailValidation(req, res, nextSpy);

        expect(res.status).not.toBeCalledWith(422);
        expect(res.send).not.toBeCalledWith({ message: "Email is invalid" });
        expect(nextSpy).toBeCalledTimes(1);

        jest.clearAllMocks();
      });

    });

    it("when email is invalid, next method will not be called", () => {

      const emails = [
        'any @email.com',
        '12asd@email. com',
        'asdasd12@ email.com',
        'invalid.com',
        'any@emailcom',
        'any@email.',
      ];

      emails.forEach(email => {
        const req = mockRequest({ body: { email } });

        emailValidation(req, res, nextSpy);

        expect(res.status).toBeCalledWith(422);
        expect(res.send).toBeCalledWith({ message: "Email is invalid" });
        expect(nextSpy).not.toBeCalled();
      });
    });
  });
});
