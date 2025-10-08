import { useState, useEffect } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
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
      if (res.ok) {
        fetchNotes();
      }
    } catch {
      console.log("Error adding note");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseURL}/notes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchNotes();
      }
    } catch {
      console.log("Error deleting note");
    }
  };

  const getNoteByTitle = async (title) => {
    try {
      const res = await fetch(
        `${baseURL}/notes?title=${encodeURIComponent(title)}`
      );
      const result = await res.json();
      return result.data && result.data.length > 0 ? result.data[0] : null;
    } catch {
      console.log("Error fetching note by title");
    }
  };

  const handleUpdateNote = async (id, updateTitle, updateContent) => {
    try {
      const res = await fetch(`${baseURL}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updateTitle,
          content: updateContent,
        }),
      });
      const result = await res.json();
      setNotes((prevNotes) => {
        return prevNotes.map((note) => (note.id === id ? result.data : note));
      });
      if (res.ok) {
        fetchNotes();
      }
    } catch {
      console.log("Error updating note");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    setSearchResult(null);
    if (!searchTitle) return;
    const note = await getNoteByTitle(searchTitle);
    if (!note) {
      setSearchError("Note tidak ditemukan.");
    } else {
      setSearchResult(note);
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
          handleSearch={handleSearch}
          searchError={searchError}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
          setSearchError={setSearchError}
          darkMode={darkMode}
        />
      </main>
    </>
  );
}

export default App;

// ================== Komponen ==================

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav
      className={`w-full fixed top-0 flex justify-center z-10 ${
        darkMode ? "bg-[#1E2D3D] shadow-lg" : "bg-[#FFFFFF] shadow"
      }`}
    >
      <div className="flex items-center px-5 py-5 container w-full justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-10" />
          <p
            className={`text-lg font-semibold ${
              darkMode ? "text-[#E5E7EB]" : "text-[#1F2937]"
            }`}
          >
            Note.com
          </p>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`ml-auto flex items-center gap-2 p-2 rounded-full transition-colors duration-200 border ${
            darkMode
              ? "bg-[#3B82F6] hover:bg-[#60A5FA] text-[#E5E7EB] border-[#2E3A46]"
              : "bg-[#FFFFFF] hover:bg-[#3B82F6] text-[#1F2937] border-[#E5E7EB]"
          }`}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span className="text-xl transition-all duration-300">
            {darkMode ? "☀️" : "🌙"}
          </span>
        </button>
      </div>
    </nav>
  );
};

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
    <main
      className={`w-full flex justify-center ${
        darkMode ? "bg-[#0D1117]" : "bg-[#F9FAFB]"
      } py-10 px-5`}
    >
      <section
        className={`container max-w-xl px-5 mb-8 w-full p-10 rounded-lg shadow-md transition-colors duration-300 ${
          darkMode
            ? "bg-[#1E2D3D] text-[#E5E7EB]"
            : "bg-[#FFFFFF] text-[#1F2937]"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Create Note</h1>
          <p className="text-sm text-[#9CA3AF]">
            Fill in the details below:
          </p>
          <input
            type="text"
            placeholder="Title"
            className={`rounded-sm  outline-1 p-3 ${
              darkMode
                ? "bg-[#1E2D3D] text-[#E5E7EB] outline-[#2E3A46]"
                : "bg-[#FFFFFF] text-[#1F2937] outline-[#E5E7EB]"
            }`}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            className={`rounded-sm  outline-1 p-3 ${
              darkMode
                ? "bg-[#1E2D3D] text-[#E5E7EB] outline-[#2E3A46]"
                : "bg-[#FFFFFF] text-[#1F2937] outline-[#E5E7EB]"
            }`}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className={`font-semibold rounded-lg py-3 cursor-pointer transition-colors ${
              darkMode
                ? "bg-[#3B82F6] hover:bg-[#60A5FA] text-[#E5E7EB]"
                : "bg-[#2563EB] hover:bg-[#3B82F6] text-white"
            }`}
          >
            Add note
          </button>
        </form>
      </section>
    </main>
  );
};

const NoteItem = ({ note, onDelete, onUpdate, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };
  const handleDeleteClick = () => {
    if (window.confirm("Yakin ingin menghapus note ini?")) {
      onDelete(note.id);
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md w-[300px] p-5 transition-colors duration-300 ${
        darkMode ? "bg-[#1E2D3D] text-[#E5E7EB]" : "bg-[#FFFFFF] text-[#1F2937]"
      }`}
    >
      {isEditing ? (
        <>
          <input
            className={`rounded-sm  outline-1 p-3 mb-1 w-full ${
              darkMode
                ? "bg-[#0D1117] text-[#E5E7EB] outline-[#2E3A46]"
                : "bg-[#FFFFFF] text-[#1F2937] outline-[#E5E7EB]"
            }`}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className={`rounded-sm  outline-1 p-3 w-full ${
              darkMode
                ? "bg-[#0D1117] text-[#E5E7EB] outline-[#2E3A46]"
                : "bg-[#FFFFFF] text-[#1F2937] outline-[#E5E7EB]"
            }`}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-3 py-1 rounded cursor-pointer"
              onClick={() => {
                onUpdate(note.id, editTitle, editContent);
                setIsEditing(false);
              }}
            >
              Save
            </button>
            <button
              className="bg-[#9CA3AF] hover:bg-[#6B7280] text-white px-3 py-1 rounded cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-medium text-xl">{note.title}</p>
          <p className="text-sm text-[#9CA3AF]">
            ~{showFormattedDate(note.created_at)}
          </p>
          <p className="mt-2">{note.content}</p>
          <div className="mt-4 flex gap-2">
            <button
              className="bg-[#F59E0B] hover:bg-[#FBBF24] text-white px-3 py-1 rounded cursor-pointer"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-3 py-1 rounded cursor-pointer"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const NoteList = ({
  notes = [],
  onDelete,
  onUpdate,
  searchTitle,
  setSearchTitle,
  handleSearch,
  searchError,
  searchResult,
  setSearchResult,
  setSearchError,
  darkMode,
}) => {
  return (
    <section className="container py-8 px-5">
      <form
        onSubmit={handleSearch}
        className="container flex justify-between gap-2 max-w-xl w-full mb-2"
      >
        <input
          type="text"
          placeholder="Cari judul Note"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className={`rounded px-4 py-2 w-full border transition-colors ${
            darkMode
              ? "bg-[#0D1117] text-[#E5E7EB] border-[#2E3A46]"
              : "bg-[#FFFFFF] text-[#1F2937] border-[#E5E7EB]"
          }`}
        />
        <button
          type="submit"
          className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-4 py-2 rounded cursor-pointer"
        >
          Search
        </button>
        {(searchTitle || searchResult || searchError) && (
          <button
            type="button"
            className="bg-[#9CA3AF] hover:bg-[#6B7280] text-white px-3 py-2 rounded cursor-pointer ml-2"
            onClick={() => {
              setSearchTitle("");
              setSearchResult(null);
              setSearchError("");
            }}
            title="Clear search"
          >
            &#10005;
          </button>
        )}
      </form>

      {searchError && (
        <div className="mb-4 text-[#EF4444] font-semibold">{searchError}</div>
      )}

      {searchResult && (
        <div className="">
          <h3
            className={`font-bold mb-2 ${
              darkMode ? "text-[#E5E7EB]" : "text-[#1F2937]"
            }`}
          >
            Hasil Pencarian:
          </h3>
          <NoteItem
            note={searchResult}
            onDelete={onDelete}
            onUpdate={onUpdate}
            darkMode={darkMode}
          />
        </div>
      )}

      <h2
        className={`inline-flex items-center justify-center gap-2 text-2xl font-medium mb-6 ${
          darkMode ? "text-[#E5E7EB]" : "text-[#1F2937]"
        }`}
      >
        Your Notes
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={onDelete}
              onUpdate={onUpdate}
              darkMode={darkMode}
            />
          ))
        ) : (
          <h1
            className={`font-semibold text-lg flex items-center justify-center text-center ${
              darkMode ? "text-[#E5E7EB]" : "text-[#1F2937]"
            }`}
          >
            Data Kosong
          </h1>
        )}
      </div>
    </section>
  );
};

// helper
const showFormattedDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};
