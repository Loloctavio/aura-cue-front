import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { GeneratePage } from "../pages/GeneratePage";
import { PlaylistDetailPage } from "../pages/PlaylistDetailPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ProtectedLayout } from "../components/ProtectedLayout";
import { LandingPage } from "../pages/LandingPage";
import { PrivacyPage } from "../pages/PrivacyPage";
import { TermsPage } from "../pages/TermsPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/terms", element: <TermsPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/generate", element: <GeneratePage /> },
          { path: "/playlists/:playlistId", element: <PlaylistDetailPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
