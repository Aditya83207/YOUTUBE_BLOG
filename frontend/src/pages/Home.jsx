import { API } from "../config.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getYoutubeId(url = "") {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

export default function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", youtubeUrl: "", content: "" });
  const [saving, setSaving] = useState(false);

  const loadPosts = async () => {
    try {
      const res = await fetch(`${API}/api/posts`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not load posts");
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not publish post");
      setForm({ title: "", youtubeUrl: "", content: "" });
      await loadPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await fetch(`${API}/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not delete post");
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <section className="hero">
        <h1>Notes on the videos worth your time.</h1>
        <p>
          Paste a YouTube link, write what you learned, and share it with
          everyone who hasn’t watched yet.
        </p>
        {!user && (
          <Link to="/signup" className="btn btn-primary">
            Start writing
          </Link>
        )}
      </section>

      {user && (
        <form className="card compose" onSubmit={handleCreate}>
          <h2>New post</h2>
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What is this video about?"
              required
            />
          </label>
          <label>
            YouTube link
            <input
              name="youtubeUrl"
              value={form.youtubeUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </label>
          <label>
            Your notes
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={5}
              placeholder="Key takeaways, timestamps, your opinion…"
              required
            />
          </label>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Publishing…" : "Publish post"}
          </button>
        </form>
      )}

      {error && <p className="alert">{error}</p>}

      <section className="posts">
        {loading && <p className="muted">Loading posts…</p>}
        {!loading && posts.length === 0 && (
          <p className="muted">
            No posts yet.{" "}
            {user
              ? "Publish the first one above."
              : "Sign in to publish the first one."}
          </p>
        )}

        {posts.map((post) => {
          const videoId = getYoutubeId(post.youtubeUrl);
          const isOwner = user && post.author && post.author._id === user.id;
          return (
            <article key={post._id} className="card post">
              {videoId && (
                <a
                  href={post.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="thumb"
                >
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt={`Thumbnail for ${post.title}`}
                  />
                  <span className="play" aria-hidden="true" />
                </a>
              )}
              <div className="post-body">
                <h2>{post.title}</h2>
                <p className="meta">
                  By {post.author?.name || "Unknown"} on{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="content">{post.content}</p>
                {isOwner && (
                  <button
                    className="btn btn-ghost danger"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}