import { useState, useEffect } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [ searchError, setSearchError ] = useState("");

  const baseURL ="https://notes-app-iota-murex.vercel.app";

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

      const result = await res.json();

      if (res.ok) {
        setNotes([...notes, result.data]);
      }
    } catch (error) {
      console.log("Error adding note", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseURL}/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes((notes) => notes.filter((note) => note.id !== id));
      }
      fetchNotes();
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
    if(!note ) {
      setSearchError("Note tidak ditemukan.");
    } else {
      setSearchResult(note);
    }
  };



  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col pt-24 items-center bg-blue-100">
        <NoteForm onAddNote={addNote} />

         <form onSubmit={handleSearch} className="container flex justify-between gap-2 max-w-xl w-full">
          <input
            type="text"
            placeholder="Cari judul Note"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="bg-white rounded px-4 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Search
          </button>

        </form>

        {searchError && (
          <div className="mb-4 text-red-600 font-semibold">{searchError}</div>
        )}

         {searchResult && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Hasil Pencarian:</h3>
            <NoteItem
              note={searchResult}
              onDelete={handleDelete}
              onUpdate={handleUpdateNote}
            />
          </div>
        )}

        <NoteList
          notes={notes}
          onDelete={handleDelete}
          onUpdate={handleUpdateNote}
          onGetByTitle={getNoteByTitle}
        />
      </main>
    </>
  );
}

export default App;

// ================== Komponen ==================

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 flex justify-center bg-white shadow">
      <div className="flex justify-between px-5 py-5 container">
        <img src="/logo.svg" alt="Logo" />
      </div>
    </nav>
  );
};

const NoteForm = ({ onAddNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddNote(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <main className="w-full flex justify-center bg-blue-100 py-10 px-5">
      <section className="container max-w-xl px-5 mb-8 w-full p-10 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Create Note</h1>
          <p className="text-sm text-gray-500">Fill in the details below:</p>
          <input
            type="text"
            placeholder="Title"
            className="rounded-sm outline outline-gray-400 p-3"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            className="resize-y min-h-14 rounded-sm outline outline-gray-400 p-3"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold rounded-lg py-3  cursor-pointer hover:bg-blue-600 transition-colors"
          >
            Add note
          </button>
        </form>
      </section>
    </main>
  );
};

const NoteItem = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg shadow-md bg-white w-[300px] p-5">
      {isEditing ? (
        <>
          <input
            className="rounded-sm outline outline-gray-400 p-3 mb-1 w-full"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className="rounded-sm outline outline-gray-400 p-3 w-full"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => {
              onUpdate(note.id, editTitle, editContent);
              setIsEditing(false);
            }}
          >
            Save
          </button>
          <button
            className="bg-gray-400 text-white px-3 py-1 rounded mr-2 mx-1"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className="font-medium text-xl">{note.title}</p>
          <p className="text-sm text-gray-500">
            ~{showFormattedDate(note.created_at)}
          </p>
          <p className="mt-2">{note.content}</p>
          <div className="mt-4 flex gap-2">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => onDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

  
const NoteList = ({ notes, onDelete, onUpdate }) => {
  return (
    <section className="container py-8 px-5">
      <h2 className="inline-flex items-center justify-center gap-2 text-2xl font-medium mb-6">
        <img src="/note.svg" alt="note icon" className="w-8 h-8" />
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
            />
          ))
        ) : (
          <h1 className="">Data Kosong</h1>
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
