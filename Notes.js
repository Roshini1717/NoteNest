import React, { useState } from "react";
import axios from "axios";

const backendURL = "http://127.0.0.1:8000";

function Notes({ token }) {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState([]);

  const handleAddNote = async () => {
    try {
      const res = await axios.post(
        `${backendURL}/notes`,
        { title: noteTitle, content: noteContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.msg);
      setNoteTitle("");
      setNoteContent("");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.detail || "Server error");
      } else if (err.request) {
        alert("No response from server. Make sure backend is running!");
      } else {
        alert("Error: " + err.message);
      }
    }
  };

  const handleGetNotes = async () => {
    try {
      const res = await axios.get(`${backendURL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes);
    } catch (err) {
      if (err.response) {
        alert(err.response.data.detail || "Server error");
      } else if (err.request) {
        alert("No response from server. Make sure backend is running!");
      } else {
        alert("Error: " + err.message);
      }
    }
  };

  return (
    <div>
      <h3>Add a Note</h3>
      <input
        placeholder="Title"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
      />
      <button onClick={handleAddNote}>Add Note</button>

      <h3 style={{ marginTop: "20px" }}>Your Notes</h3>
      <button onClick={handleGetNotes}>Refresh Notes</button>
      <ul>
        {notes.map((n, index) => (
          <li key={index}>
            <b>{n.title}:</b> {n.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
