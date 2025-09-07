import React, { useState } from "react";
import Auth from "./components/Auth";
import Notes from "./components/Notes";
import './App.css';

function App() {
  const [token, setToken] = useState("");

  return (
    <div className="container">
      <h2>NoteNest 🪺</h2>
      {!token ? <Auth setToken={setToken} /> : <Notes token={token} />}
    </div>
  );
}

export default App;
