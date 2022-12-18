import { Request, Response } from "express";
import { Note } from "../models/note.model";

type RequestOb = {
  headers?: any;
  body?: any;
  params?: any;
}

export const mockRequest = ({ headers, body, params }: RequestOb): Request => ({
  headers,
  body,
  params,
} as Request);


type ResponseOb = {
  status?: any,
  send?: any,
  json?: any,
}

export const mockResponse = (): Response => {
  const res: ResponseOb = {};

  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res as Response;
};

export const mockNotes: Note[] = [
  {
    title: "anytitle 1",
    description: "anydescription 1"
  } as Note,
  {
    title: "anytitle 2",
    description: "anydescription 2"
  } as Note
];

export const mockNote: Note = {
  title: "anytitle 1",
  description: "anydescription 1"
} as Note;