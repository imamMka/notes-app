import express from "express";
import { getAllNotesHandler, addNoteHandler, getNotesByIdHandler, updateNoteByIdHandler, deleteNoteByIdHandler }  from "../handlers/notesHandler.js";

const noteRouter = express.Router();

noteRouter.get("/notes", getAllNotesHandler);
noteRouter.post("/notes", addNoteHandler);
noteRouter.get("/notes/:id", getNotesByIdHandler);
noteRouter.put("/notes/:id", updateNoteByIdHandler);
noteRouter.delete("/notes/:id", deleteNoteByIdHandler);

export default noteRouter;

