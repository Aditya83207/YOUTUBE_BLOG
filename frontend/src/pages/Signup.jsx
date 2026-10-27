import { API } from "../config.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup({ onAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not sign up");
      onAuth(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-wrap">
      <form className="card auth" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        {error && <p className="alert">{error}</p>}
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password (6+ characters)
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            autoComplete="new-password"
            required
          />
        </label>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Creating account…" : "Sign up"}
        </button>
        <p className="muted">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  );
}