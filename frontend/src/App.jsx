import { useState, useEffect } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const baseURL = "https://notes-app-iota-murex.vercel.app";

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${baseURL}/notes`);
      const result = await res.json();
      setNotes(result.data);
    } catch {
      console.log("Error fetching notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (newTitle, newContent) => {
    try {
      const res = await fetch(`${baseURL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (res.ok) fetchNotes();
    } catch {
      console.log("Error adding note");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseURL}/notes/${id}`, { method: "DELETE" });
      if (res.ok) fetchNotes();
    } catch {
      console.log("Error deleting note");
    }
  };

  const handleUpdateNote = async (id, updateTitle, updateContent) => {
    try {
      const res = await fetch(`${baseURL}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updateTitle, content: updateContent }),
      });
      const result = await res.json();
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? result.data : note))
      );
    } catch {
      console.log("Error updating note");
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main
        className={`min-h-screen flex flex-col pt-24 items-center transition-colors duration-300 ${
          darkMode ? "bg-[#0D1117]" : "bg-[#F9FAFB]"
        }`}
      >
        <NoteForm onAddNote={addNote} darkMode={darkMode} />
        <NoteList
          notes={notes}
          onDelete={handleDelete}
          onUpdate={handleUpdateNote}
          searchTitle={searchTitle}
          setSearchTitle={setSearchTitle}
          darkMode={darkMode}
        />
      </main>
    </>
  );
}

export default App;

// ================== Navbar ==================
const Navbar = ({ darkMode, toggleDarkMode }) => (
  <nav
    className={`w-full fixed top-0 flex justify-center z-10 ${
      darkMode ? "bg-[#1E2D3D] shadow-lg" : "bg-white shadow"
    }`}
  >
    <div className="flex items-center px-5 py-5 container w-full justify-between">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="w-[50px]" />
        {/* <p
          className={`text-lg font-semibold ${
            darkMode ? "text-[#E5E7EB]" : "text-[#1F2937]"
          }`}
        >
          Note.com
        </p> */}
      </div>
      <button
        onClick={toggleDarkMode}
        className={`ml-auto flex items-center gap-2 p-2 rounded-full transition-colors duration-200 border ${
          darkMode
            ? "bg-[#3B82F6] hover:bg-[#60A5FA] text-[#E5E7EB] border-[#2E3A46]"
            : "bg-white hover:bg-[#3B82F6] text-[#1F2937] border-[#E5E7EB]"
        }`}
      >
        <span className="text-xl">{darkMode ? "☀️" : "🌙"}</span>
      </button>
    </div>
  </nav>
);

// ================== Form ==================
const NoteForm = ({ onAddNote, darkMode }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddNote(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <section
      className={`container max-w-xl px-5 mb-8 w-full p-10 rounded-lg shadow-md transition-colors duration-300 ${
        darkMode
          ? "bg-[#1E2D3D] text-[#E5E7EB]"
          : "bg-white text-[#1F2937]"
      }`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Create Note</h1>
        <p>lorem ipsum dolor sit amet</p>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={`rounded-sm outline-1 p-3 ${
            darkMode
              ? "bg-[#0D1117] text-[#E5E7EB] outline-[#2E3A46]"
              : "bg-white text-[#1F2937] outline-[#E5E7EB]"
          }`}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className={`rounded-sm outline-1 p-3 ${
            darkMode
              ? "bg-[#0D1117] text-[#E5E7EB] outline-[#2E3A46]"
              : "bg-white text-[#1F2937] outline-[#E5E7EB]"
          }`}
        />
        <button
          type="submit"
          className={`font-semibold rounded-lg py-3 cursor-pointer transition-colors ${
            darkMode
              ? "bg-[#3B82F6] hover:bg-[#60A5FA]"
              : "bg-[#2563EB] hover:bg-[#3B82F6] text-white"
          }`}
        >
          Add note
        </button>
      </form>
    </section>
  );
};

// ================== Note Item ==================
const NoteItem = ({ note, onDelete, onUpdate, darkMode }) => {
  const [isOpenView, setIsOpenView] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleView = () => setIsOpenView(true);
  const handleEditOpen = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsOpenEdit(true);
  };
  const handleEditSave = () => {
    onUpdate(note.id, editTitle, editContent);
    setIsOpenEdit(false);
  };
  const handleEditCancel = () => {
    setIsOpenEdit(false);
  };

  return (
    <>
      {/* CARD UTAMA - Fixed size with clamped preview content (no scroll) */}
      <div
        onClick={handleView}
        className={`rounded-lg shadow-md w-[300px] h-[250px] flex flex-col cursor-pointer transition-all duration-300 overflow-hidden ${
          darkMode
            ? "bg-[#1E2D3D] text-[#E5E7EB] hover:bg-[#2E3A46]"
            : "bg-white text-[#1F2937] hover:bg-[#F3F4F6]"
        } hover:scale-[1.02]`}
      >
        <div className="p-4 flex-shrink-0">
          <p className="font-medium text-xl mb-1 truncate">{note.title}</p>
          <p className="text-sm text-[#9CA3AF] truncate">
            ~{showFormattedDate(note.created_at)}
          </p>
        </div>
        <div className="flex-1 p-4">
          <p className="whitespace-pre-wrap leading-relaxed text-sm line-clamp-4">
            {note.content}
          </p>
        </div>
      </div>

      {/* MODAL VIEW - Smaller fixed size with scroll for full content */}
      {isOpenView && (
        <div
          onClick={() => setIsOpenView(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`rounded-lg shadow-xl w-[400px] h-[500px] flex flex-col transition-colors duration-300 overflow-hidden ${
              darkMode
                ? "bg-[#1E2D3D] text-[#E5E7EB]"
                : "bg-white text-[#1F2937]"
            }`}
          >
            <div className="p-6 flex-shrink-0">
              <h2 className="text-2xl font-semibold mb-2 truncate">{note.title}</h2>
              <p className="text-sm text-[#9CA3AF] mb-4">
                ~{showFormattedDate(note.created_at)}
              </p>
            </div>
            <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#9CA3AF] scrollbar-track-transparent">
              <p className="whitespace-pre-wrap leading-relaxed">{note.content}</p>
            </div>
            <div className="p-6 pt-0 flex justify-end gap-2 border-t border-[#E5E7EB]/20">
              <button
                className="bg-[#F59E0B] hover:bg-[#FBBF24] text-white px-4 py-2 rounded transition-colors"
                onClick={() => {
                  setIsOpenView(false);
                  handleEditOpen();
                }}
              >
                Edit
              </button>
              <button
                className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-4 py-2 rounded transition-colors"
                onClick={() => {
                  setIsOpenView(false);
                  onDelete(note.id);
                }}
              >
                Delete
              </button>
              <button
                className="bg-[#9CA3AF] hover:bg-[#6B7280] text-white px-4 py-2 rounded transition-colors"
                onClick={() => setIsOpenView(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT - Same size as view modal with form */}
      {isOpenEdit && (
        <div
          onClick={handleEditCancel}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`rounded-lg shadow-xl w-[400px] h-[500px] flex flex-col transition-colors duration-300 overflow-hidden ${
              darkMode
                ? "bg-[#1E2D3D] text-[#E5E7EB]"
                : "bg-white text-[#1F2937]"
            }`}
          >
            <div className="p-6 flex-shrink-0">
              <h2 className="text-2xl font-semibold mb-4">Edit Note</h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#9CA3AF] scrollbar-track-transparent space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className={`w-full rounded-sm outline-none p-3 border ${
                  darkMode
                    ? "bg-[#0D1117] text-[#E5E7EB] border-[#2E3A46]"
                    : "bg-white text-[#1F2937] border-[#E5E7EB]"
                }`}
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content"
                className={`w-full h-[300px] rounded-sm outline-none p-3 border resize-none ${
                  darkMode
                    ? "bg-[#0D1117] text-[#E5E7EB] border-[#2E3A46]"
                    : "bg-white text-[#1F2937] border-[#E5E7EB]"
                }`}
              />
            </div>
            <div className="mt-2 p-6 pt-0 flex justify-end gap-2 border-t border-[#E5E7EB]/20">
              <button
                className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-4 py-2 rounded transition-colors"
                onClick={handleEditSave}
              >
                Save
              </button>
              <button
                className="bg-[#9CA3AF] hover:bg-[#6B7280] text-white px-4 py-2 rounded transition-colors"
                onClick={handleEditCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ================== Note List ==================
const NoteList = ({ notes, onDelete, onUpdate, searchTitle, setSearchTitle, darkMode }) => {
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <section className="container py-8 px-5">
      <div className="container flex justify-between gap-2 max-w-xl w-full mb-6">
        <input
          type="text"
          placeholder="Cari judul Note..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className={`rounded px-4 py-2 w-full border transition-colors ${
            darkMode
              ? "bg-[#0D1117] text-[#E5E7EB] border-[#2E3A46]"
              : "bg-white text-[#1F2937] border-[#E5E7EB]"
          }`}
        />
      </div>

      <h2
        className={`inline-flex items-center justify-center gap-2 text-2xl font-medium mb-6 ${
          darkMode ? "text-[#E5E7EB]" : "text-[#1F2937]"
        }`}
      >
        Your Notes
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={onDelete}
              onUpdate={onUpdate}
              darkMode={darkMode}
            />
          ))
        ) : (
          <p
            className={`font-semibold text-lg text-center ${
              darkMode ? "text-[#E5E7EB]" : "text-[#1F2937]"
            }`}
          >
            {searchTitle ? "Note tidak ditemukan." : "Belum ada Note. Tambahkan satu!"}
          </p>
        )}
      </div>
    </section>
  );
};

// ================== Helper ==================
const showFormattedDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};
