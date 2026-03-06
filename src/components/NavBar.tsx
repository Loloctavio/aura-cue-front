import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../theme";
import { clearToken } from "../lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Row, Pill, Button, PrimaryButton } from "./ui";

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
        padding: "0 14px",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: active ? "rgba(201,115,58,0.16)" : "transparent",
        color: "var(--text)",
        fontWeight: active ? 700 : 600,
      }}
    >
      {label}
    </Link>
  );
}

export function NavBar() {
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const qc = useQueryClient();

  const logout = () => {
    clearToken();
    qc.clear();
    nav("/login");
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        padding: "clamp(8px, 2.4vw, 12px) clamp(10px, 3vw, 14px)",
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        backdropFilter: "blur(7px)",
      }}
    >
      <Card style={{ padding: 10 }}>
        <Row style={{ justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <Row style={{ flex: "1 1 520px", minWidth: 0, gap: 10 }}>
            <Pill>
              <span style={{ fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)" }}>SayPlay</span>
            </Pill>

            <Row
              style={{
                gap: 10,
                flexWrap: "nowrap",
                overflowX: "auto",
                maxWidth: "100%",
                paddingBottom: 2,
              }}
            >
              <NavItem to="/" label="Playlists" />
              <NavItem to="/generate" label="Generate" />
              <NavItem to="/profile" label="Profile" />
              <NavItem to="/about" label="How it works" />
            </Row>
          </Row>

          <Row style={{ gap: 10, marginLeft: "auto" }}>
            <Button onClick={toggle}>{theme === "light" ? "Dark" : "Light"}</Button>
            <PrimaryButton onClick={logout}>Logout</PrimaryButton>
          </Row>
        </Row>
      </Card>
    </div>
  );
}
