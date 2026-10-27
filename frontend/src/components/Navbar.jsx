import { Link, NavLink } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          YouTube Blog
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="btn btn-ghost" onClick={onLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin">Sign in</NavLink>
              <Link to="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
