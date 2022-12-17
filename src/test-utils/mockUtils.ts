import { Request, Response } from "express";

export const mockRequest = (body?: any): Request => ({
  body,
} as Request);

export const mockResponse = (): Response => {
  type ResponseOb = {
    status?: any,
    send?: any,
    json?: any,
  }
  const res: ResponseOb = {};

  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};
