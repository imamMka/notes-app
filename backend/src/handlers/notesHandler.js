import { pool } from "../config/db.js";

//Mendapatkan semua catatan
export const getAllNotesHandler = async (req, res) => {
  const [notes] = await pool.query("SELECT * FROM notes");

  res.status(200).json({
    message: "success",
    data: notes,
  });
};

//Menambahkan catatan
export const addNoteHandler = async (req, res) => {
  const { title, content } = req.body;

  //validasi input
  if (!title || !title.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "Title is required",
    });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "Content is required",
    });
  }
  //simpan ke database
  const [insertResult] = await pool.query(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content]
  );

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [
    insertResult.insertId,
  ]);

  res.status(201).json({
    status: "success",
    message: "Note created",
    data: notes[0],
  });
};

//Mendapatkan catatan berdasarkan ID
export const getNotesByIdHandler = async (req, res) => {
  const { id } = req.params;

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);

  if (notes.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "note not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: notes[0],
  });
};

//Mengupdate catatan berdasarkan ID
export const updateNoteByIdHandler = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  await pool.query("UPDATE notes SET title = ?, content = ? WHERE id = ?", [
    title,
    content,
    id,
  ]);

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);

  if (notes.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "note not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Note updated successfully",
    data: notes[0],
  });
};

//Menghapus catatan berdasarkan ID
export const deleteNoteByIdHandler = async (req, res) => {
  const id = req.params.id;

  const [deleteNotes] = await pool.query("DELETE FROM notes WHERE id = ?", [id]);

  if (deleteNotes.length === 0) {
    return res.status(404).json({
      status: "fail",
      meesage: "note not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Note deletede successfully"
  });
}

