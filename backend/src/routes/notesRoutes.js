import express from "express";
import { getAllNotesHandler, addNoteHandler, getNotesByIdHandler }  from "../handlers/notesHandler.js";

const noteRouter = express.Router();

noteRouter.get("/notes", getAllNotesHandler);
noteRouter.post("/notes", addNoteHandler);
noteRouter.get("/notes/:id", getNotesByIdHandler);

export default noteRouter;

