import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";
import "./style.css";

export default function App() {
  /* Lazy loading of a state:
   * Pass a function and wrap the expensive code inside a function during state initialization
   * This will ensure that the code gets executed only once even when React re-renders
   * */
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function moveCurrentToFront() {
    setNotes((oldNotes) => {
      const currNoteIndex = oldNotes.findIndex(
        (note) => note.id === currentNoteId
      );
      if (currNoteIndex > -1) {
        oldNotes.unshift(oldNotes.splice(currNoteIndex, 1)[0]);
      }
      return oldNotes;
    });
  }

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes((oldNotes) => {
      const newNotes = [];

      oldNotes.map((oldNote) => {
        if (oldNote.id === currentNoteId) {
          newNotes.unshift({ ...oldNote, body: text });
        } else {
          newNotes.push(oldNote);
        }
      });
      return newNotes;
    });

    // This works but does not make the current note the first one
    // setNotes((oldNotes) =>
    //   oldNotes.map((oldNote) => {
    //     return oldNote.id === currentNoteId
    //       ? { ...oldNote, body: text }
    //       : oldNote;
    //   })
    // );
  }

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  function deleteNote(event, noteId) {
    console.log(event)
    event.stopPropagation()
    setNotes((oldNotes) => {
      const afterDeletion = oldNotes.filter(
        (note) => note.id !== noteId
      );
      if(noteId === currentNoteId) {
        setCurrentNoteId((noteId) => afterDeletion[0]|| "");
      }
      return afterDeletion;
    });
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>Markdown Note Editor</h1>
          <h3>You have no notes</h3>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
