import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Pill } from "./ui";

function NavItem({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      style={{
        minHeight: 40,
        flex: "0 0 auto",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: active ? "linear-gradient(135deg, var(--accent-soft) 0%, rgba(236, 111, 69, 0.1) 100%)" : "transparent",
        color: active ? "var(--text)" : "var(--muted)",
        fontWeight: active ? 700 : 600,
        boxShadow: active ? "0 10px 24px rgba(37, 87, 214, 0.08)" : "none",
      }}
    >
      {label}
    </Link>
  );
}

export function NavBar() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 760px)");
    const sync = () => setIsMobile(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const navValue = (() => {
    if (pathname === "/") return "/";
    if (pathname === "/dashboard" || pathname.startsWith("/playlists/")) return "/dashboard";
    if (pathname === "/generate") return "/generate";
    if (pathname === "/profile") return "/profile";
    return "";
  })();

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        padding: "clamp(10px, 2.4vw, 16px) clamp(10px, 3vw, 16px)",
        background: "linear-gradient(180deg, color-mix(in srgb, var(--bg) 78%, transparent) 0%, transparent 100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Card
        style={{
          padding: 12,
          background: "color-mix(in srgb, var(--panel) 88%, transparent)",
          boxShadow: "var(--shadow-strong)",
        }}
      >
        <Row style={{ justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <Row style={{ flex: "1 1 520px", minWidth: 0, gap: 10 }}>
            <Pill
              style={{
                minHeight: 42,
                padding: "0 14px",
                background: "linear-gradient(135deg, rgba(236, 111, 69, 0.16) 0%, rgba(37, 87, 214, 0.1) 100%)",
                color: "var(--text)",
              }}
            >
              <img
                src="/icon.png"
                alt="AuraCue icon"
                style={{ width: 20, height: 20, borderRadius: 6, objectFit: "cover" }}
              />
              <span style={{ fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)" }}>AuraCue</span>
            </Pill>

            {isMobile ? (
              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  minWidth: 190,
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  background: "color-mix(in srgb, var(--panel-strong) 90%, transparent)",
                  boxShadow: "var(--shadow)",
                }}
              >
                <select
                  aria-label="Navigation"
                  value={navValue}
                  onChange={(event) => {
                    const to = event.target.value;
                    if (to) nav(to);
                  }}
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    minHeight: 46,
                    width: "100%",
                    borderRadius: 16,
                    border: "none",
                    background: "transparent",
                    color: "var(--text)",
                    padding: "0 40px 0 13px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="/">Home</option>
                  <option value="/dashboard">Playlists</option>
                  <option value="/generate">Generate</option>
                  <option value="/profile">Profile</option>
                </select>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: 12,
                    fontSize: 12,
                    color: "var(--muted)",
                    pointerEvents: "none",
                  }}
                >
                  ▾
                </span>
              </div>
            ) : (
              <Row
                style={{
                  gap: 10,
                  flexWrap: "nowrap",
                  overflowX: "auto",
                  maxWidth: "100%",
                  paddingBottom: 2,
                }}
              >
                <NavItem to="/" label="Home" />
                <NavItem to="/dashboard" label="Playlists" />
                <NavItem to="/generate" label="Generate" />
                <NavItem to="/profile" label="Profile" />
              </Row>
            )}
          </Row>
        </Row>
      </Card>
    </div>
  );
}
