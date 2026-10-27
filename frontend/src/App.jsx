import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(loadUser);

  const handleAuth = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/signin"
            element={user ? <Navigate to="/" /> : <Signin onAuth={handleAuth} />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup onAuth={handleAuth} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
