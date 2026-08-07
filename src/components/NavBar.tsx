import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../theme";

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  playlists: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h11M4 12h11M4 18h7" />
      <circle cx="18.5" cy="16.5" r="2.5" />
      <path d="M21 16.5V8l-2.5 1" />
    </svg>
  ),
  generate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  ),
} as const;

const NAV = [
  { to: "/", label: "Home", icon: ICONS.home },
  { to: "/dashboard", label: "Playlists", icon: ICONS.playlists },
  { to: "/generate", label: "Generate", icon: ICONS.generate },
  { to: "/profile", label: "Profile", icon: ICONS.profile },
] as const;

function useActivePath() {
  const { pathname } = useLocation();
  if (pathname === "/") return "/";
  if (pathname === "/dashboard" || pathname.startsWith("/playlists/")) return "/dashboard";
  if (pathname === "/generate") return "/generate";
  if (pathname === "/profile") return "/profile";
  return "";
}

export function Sidebar() {
  const active = useActivePath();
  const { theme, toggle } = useTheme();

  return (
    <aside className="sidebar">
      <Link to="/" className="side-brand">
        <img src="/icon.png" alt="" />
        AuraCue
      </Link>

      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={active === item.to ? "side-link side-link--active" : "side-link"}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}

      <div className="side-foot">
        <button type="button" className="side-link" onClick={toggle} style={{ border: "none", background: "none", cursor: "pointer", width: "100%", font: "inherit" }}>
          {theme === "light" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8" />
            </svg>
          )}
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </div>
    </aside>
  );
}

export function TabBar() {
  const active = useActivePath();

  return (
    <nav className="tabbar" aria-label="Navigation">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={active === item.to ? "tab-link tab-link--active" : "tab-link"}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
