import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, deleteMe, getSpotifyConnectUrl, me, updateMe } from "../features/users/users.api";
import { clearToken } from "../lib/auth";
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
      nav("/login");
    },
  });

  const connectSpotifyMut = useMutation({
    mutationFn: () => getSpotifyConnectUrl("/profile"),
    onSuccess: (url) => {
      window.location.assign(url);
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
  }, [location.search, qc]);

  const logout = () => {
    clearToken();
    qc.clear();
    nav("/login");
  };

  if (isLoading) return <Page>Loading...</Page>;
  if (!data) return <Page>Could not load profile.</Page>;

  return (
    <Page>
      <Row style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <div style={{ flex: 1, minWidth: "min(100%, 220px)" }}>
          <H1>Profile</H1>
          <Muted style={{ fontSize: "clamp(15px, 3.8vw, 18px)" }}>Your account and security settings.</Muted>
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

            <Row>
              <PrimaryButton disabled={updateMut.isPending} onClick={() => updateMut.mutate()}>
                {updateMut.isPending ? "Saving..." : "Save profile"}
              </PrimaryButton>
              <Link to="/" style={{ alignSelf: "center", fontWeight: 600 }}>
                Back
              </Link>
            </Row>
          </Stack>
        </Card>

        <Card>
          <CardTitle>Spotify</CardTitle>
          <Muted>Connect your account to create playlists directly in Spotify.</Muted>

          <Divider />

          <Stack>
            <Row>
              <Pill>
                {data.spotify_connected ? "Spotify connected" : "Spotify not connected"}
              </Pill>
            </Row>

            {data.spotify?.spotify_user_id ? (
              <Muted style={{ marginTop: 0 }}>Spotify user: {data.spotify.spotify_user_id}</Muted>
            ) : null}

            <PrimaryButton
              onClick={() => connectSpotifyMut.mutate()}
              disabled={connectSpotifyMut.isPending}
              style={{ width: "fit-content" }}
            >
              {connectSpotifyMut.isPending ? "Connecting..." : "Connect with Spotify"}
            </PrimaryButton>
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
