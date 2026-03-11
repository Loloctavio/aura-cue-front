import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, deleteMe, disconnectSpotify, getSpotifyConnectUrl, me, updateMe } from "../features/users/users.api";
import { clearToken } from "../lib/auth";
import { useTheme } from "../theme";
import {
  Button,
  Card,
  CardTitle,
  DangerButton,
  H1,
  Input,
  Muted,
  Page,
  PrimaryButton,
  Row,
  Stack,
  Divider,
  Pill,
} from "../components/ui";

export function ProfilePage() {
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users", "me"],
    queryFn: me,
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!data) return;
    setUsername(data.username ?? "");
  }, [data]);

  const updateMut = useMutation({
    mutationFn: () => updateMe({ username }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users", "me"] }),
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const passMut = useMutation({
    mutationFn: () => changePassword({ old_password: oldPassword, new_password: newPassword }),
    onSuccess: () => {
      setOldPassword("");
      setNewPassword("");
      alert("Password updated.");
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      clearToken();
      qc.clear();
      nav("/");
    },
  });

  const connectSpotifyMut = useMutation({
    mutationFn: () => getSpotifyConnectUrl("/dashboard"),
    onSuccess: (url) => {
      window.location.assign(url);
    },
  });

  const disconnectSpotifyMut = useMutation({
    mutationFn: disconnectSpotify,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const spotify = params.get("spotify");
    if (!spotify) return;

    if (spotify === "connected") {
      qc.invalidateQueries({ queryKey: ["users", "me"] });
    }

    const message = params.get("message");
    if (spotify === "error") {
      alert(message ? `Spotify error: ${message}` : "Spotify connection failed.");
    }

    // Clear callback params so future reconnect callbacks always trigger this effect.
    nav("/profile", { replace: true });
  }, [location.search, qc, nav]);

  const logout = () => {
    clearToken();
    qc.clear();
    nav("/");
  };

  if (isLoading) return <Page>Loading...</Page>;
  if (!data) return <Page>Could not load profile.</Page>;
  const spotifyConnected = Boolean(data.spotify_connected || data.spotify?.spotify_user_id);

  return (
    <Page>
      <Row style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <div style={{ flex: 1, minWidth: "min(100%, 220px)" }}>
          <Pill style={{ width: "fit-content", marginBottom: 14 }}>Account settings</Pill>
          <H1>Profile</H1>
          <Muted style={{ fontSize: "clamp(15px, 3.8vw, 18px)", lineHeight: 1.65 }}>
            Your account, Spotify connection, theme preference, and security settings.
          </Muted>
        </div>

        <Row>
          <Pill>{data.gmail}</Pill>
          <Button onClick={logout}>Logout</Button>
        </Row>
      </Row>

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
          gap: 14,
        }}
      >
        <Card>
          <Stack>
            <div>
              <Muted>Username</Muted>
              <Input value={username} onChange={(event) => setUsername(event.target.value)} />
            </div>

            <Divider />

            <Row>
              <Pill>Theme: {theme === "light" ? "Light" : "Dark"}</Pill>
              <Button onClick={toggle}>Switch to {theme === "light" ? "Dark" : "Light"}</Button>
            </Row>

            <Row>
              <PrimaryButton disabled={updateMut.isPending} onClick={() => updateMut.mutate()}>
                {updateMut.isPending ? "Saving..." : "Save profile"}
              </PrimaryButton>
              <Link to="/dashboard" style={{ alignSelf: "center", fontWeight: 600 }}>
                Back
              </Link>
            </Row>
          </Stack>
        </Card>

        <Card>
          <CardTitle>Spotify</CardTitle>
          <Muted style={{ lineHeight: 1.65 }}>Connect your account to create playlists directly in Spotify.</Muted>

          <Divider />

          <Stack>
            <Row>
              <Pill>
                {spotifyConnected ? "Spotify connected" : "Spotify not connected"}
              </Pill>
            </Row>

            {data.spotify?.spotify_user_id ? (
              <Muted style={{ marginTop: 0 }}>Spotify user: {data.spotify.spotify_user_id}</Muted>
            ) : null}

            <PrimaryButton
              onClick={() => connectSpotifyMut.mutate()}
              disabled={spotifyConnected || connectSpotifyMut.isPending}
              style={{ width: "fit-content" }}
            >
              {connectSpotifyMut.isPending ? "Connecting..." : spotifyConnected ? "Connected" : "Connect with Spotify"}
            </PrimaryButton>

            <DangerButton
              onClick={() => {
                if (confirm("Disconnect your Spotify account?")) disconnectSpotifyMut.mutate();
              }}
              disabled={!spotifyConnected || disconnectSpotifyMut.isPending}
              style={{ width: "fit-content" }}
            >
              {disconnectSpotifyMut.isPending ? "Disconnecting..." : "Disconnect Spotify"}
            </DangerButton>

            <Muted style={{ marginTop: 0 }}>
              Spotify data used in this app stays linked to Spotify content and links.
            </Muted>
          </Stack>
        </Card>

        <Card>
          <CardTitle>Security</CardTitle>
          <Muted>Change password</Muted>

          <Divider />

          <Stack>
            <Input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />

            <PrimaryButton
              disabled={passMut.isPending || !oldPassword || !newPassword}
              onClick={() => passMut.mutate()}
              style={{ width: "fit-content" }}
            >
              {passMut.isPending ? "Updating..." : "Update password"}
            </PrimaryButton>

            <Divider style={{ marginTop: 16 }} />

            <Muted>Danger zone</Muted>
            <DangerButton
              disabled={deleteMut.isPending}
              onClick={() => {
                if (confirm("Delete account permanently?")) deleteMut.mutate();
              }}
            >
              {deleteMut.isPending ? "Deleting..." : "Delete account"}
            </DangerButton>
          </Stack>
        </Card>
      </div>
    </Page>
  );
}
