import React, { useState } from "react";
import axios from "axios";

const backendURL = "http://127.0.0.1:8000";

function Auth({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${backendURL}/register`, { username, password });
      alert(res.data.msg);
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

  const handleLogin = async () => {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const res = await axios.post(`${backendURL}/login`, params);
      setToken(res.data.access_token);
      alert("Login successful!");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.detail || "Invalid credentials");
      } else if (err.request) {
        alert("No response from server. Make sure backend is running!");
      } else {
        alert("Error: " + err.message);
      }
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>User Authentication</h3>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginRight: "5px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginRight: "5px" }}
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin} style={{ marginLeft: "5px" }}>Login</button>
    </div>
  );
}

export default Auth;
