import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, TabBar } from "./NavBar";

export function ProtectedLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const spotify = params.get("spotify");
    if (!spotify) return;
    if (location.pathname !== "/dashboard") return;

    navigate(`/profile${location.search}`, { replace: true });
  }, [location.pathname, location.search, navigate]);

  return (
    <div className="shell">
      <Sidebar />
      <main className="shell-main">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}
