import express from "express";
import { getAllNotesHandler, addNoteHandler, getNotesByTitleHandler, updateNoteByIdHandler, deleteNoteByIdHandler }  from "../handlers/notesHandler.js";

const noteRouter = express.Router();

noteRouter.get("/notes", (req, res) => {
    const { title } = req.query;
    if (title) {
        return getNotesByTitleHandler(req, res);
    }
    return getAllNotesHandler(req, res);
});
noteRouter.post("/notes", addNoteHandler);
noteRouter.put("/notes/:id", updateNoteByIdHandler);
noteRouter.delete("/notes/:id", deleteNoteByIdHandler);

export default noteRouter;

