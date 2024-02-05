import express from "express";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";

export const notesRouter = express.Router();

const notesController = new NotesController(
  new NotesBusiness(
    new NotesDataBase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
  )
);
notesRouter.use(express.json());

notesRouter.get("/", notesController.getStudents);
