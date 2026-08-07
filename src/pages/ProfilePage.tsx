import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, deleteMe, disconnectSpotify, getSpotifyConnectUrl, me, updateMe } from "../features/users/users.api";
import { clearToken } from "../lib/auth";
import { useTheme } from "../theme";
import {
  Button,
  Card,
  CardTitle,
  Chip,
  DangerButton,
  Eyebrow,
  FieldLabel,
  H1,
  Input,
  Muted,
  Page,
  PrimaryButton,
  Row,
  Skeleton,
  SkeletonCard,
  Spinner,
  Stack,
} from "../components/ui";

export function ProfilePage() {
  const { theme, setTheme } = useTheme();
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

  if (isLoading) {
    return (
      <Page>
        <Skeleton style={{ width: 100, height: 14 }} />
        <Skeleton style={{ width: "min(280px, 60%)", height: 46, marginTop: 18 }} />
        <div style={{ marginTop: 26, display: "grid", gap: 14, maxWidth: 760 }}>
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} className="fade-in" style={{ ["--d" as string]: "120ms" }} />
          <SkeletonCard lines={3} className="fade-in" style={{ ["--d" as string]: "240ms" }} />
        </div>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <Card dashed className="rise" style={{ textAlign: "center", padding: "clamp(30px, 6vw, 60px)" }}>
          <CardTitle>Could not load profile</CardTitle>
          <Muted>Try refreshing, or log in again if your session expired.</Muted>
        </Card>
      </Page>
    );
  }

  const spotifyConnected = Boolean(data.spotify_connected || data.spotify?.spotify_user_id);

  return (
    <Page>
      <div className="section-head">
        <div>
          <Eyebrow>Account</Eyebrow>
          <H1 style={{ marginTop: 12 }}>Profile</H1>
        </div>
        <Row style={{ gap: 10 }}>
          <Chip>{data.gmail}</Chip>
          <Button className="btn--ghost btn--sm" onClick={logout}>
            Log out
          </Button>
        </Row>
      </div>

      <div style={{ display: "grid", gap: 14, maxWidth: 760 }}>
        {/* ---- Identity ---- */}
        <Card className="rise">
          <Eyebrow>Identity</Eyebrow>
          <Stack style={{ marginTop: 14 }}>
            <div>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
            </div>
            <PrimaryButton
              disabled={updateMut.isPending}
              onClick={() => updateMut.mutate()}
              style={{ width: "fit-content" }}
            >
              {updateMut.isPending && <Spinner />}
              {updateMut.isPending ? "Saving..." : "Save profile"}
            </PrimaryButton>
          </Stack>
        </Card>

        {/* ---- Appearance ---- */}
        <Card className="rise" style={{ ["--d" as string]: "80ms" }}>
          <Eyebrow>Appearance</Eyebrow>
          <Muted style={{ marginTop: 12 }}>Theme follows this setting on every device you log in from.</Muted>
          <Row style={{ marginTop: 14, gap: 8 }}>
            <Button
              className={theme === "light" ? "btn--sm" : "btn--ghost btn--sm"}
              style={theme === "light" ? { borderColor: "var(--primary)", color: "var(--primary)" } : undefined}
              onClick={() => setTheme("light")}
            >
              ☀ Light
            </Button>
            <Button
              className={theme === "dark" ? "btn--sm" : "btn--ghost btn--sm"}
              style={theme === "dark" ? { borderColor: "var(--primary)", color: "var(--primary)" } : undefined}
              onClick={() => setTheme("dark")}
            >
              ☾ Dark
            </Button>
          </Row>
        </Card>

        {/* ---- Spotify ---- */}
        <Card className="rise" style={{ ["--d" as string]: "160ms" }}>
          <Row style={{ justifyContent: "space-between", gap: 10 }}>
            <Eyebrow>Spotify</Eyebrow>
            <Chip tone={spotifyConnected ? "ok" : undefined}>
              <span className={spotifyConnected ? "dot dot--ok" : "dot dot--muted"} />
              {spotifyConnected ? "connected" : "not connected"}
            </Chip>
          </Row>
          <Muted style={{ marginTop: 12, lineHeight: 1.65 }}>
            Connect your account to create playlists directly in Spotify.
          </Muted>
          {data.spotify?.spotify_user_id ? (
            <Muted className="mono" style={{ fontSize: 12 }}>user · {data.spotify.spotify_user_id}</Muted>
          ) : null}

          <Row style={{ marginTop: 16, gap: 10 }}>
            <PrimaryButton
              onClick={() => connectSpotifyMut.mutate()}
              disabled={spotifyConnected || connectSpotifyMut.isPending}
            >
              {connectSpotifyMut.isPending && <Spinner />}
              {connectSpotifyMut.isPending ? "Connecting..." : spotifyConnected ? "Connected" : "Connect with Spotify"}
            </PrimaryButton>

            <DangerButton
              onClick={() => {
                if (confirm("Disconnect your Spotify account?")) disconnectSpotifyMut.mutate();
              }}
              disabled={!spotifyConnected || disconnectSpotifyMut.isPending}
            >
              {disconnectSpotifyMut.isPending && <Spinner />}
              {disconnectSpotifyMut.isPending ? "Disconnecting..." : "Disconnect"}
            </DangerButton>
          </Row>

          <Muted className="mono" style={{ fontSize: 11.5, marginTop: 14 }}>
            Spotify data used in this app stays linked to Spotify content and links.
          </Muted>
        </Card>

        {/* ---- Security ---- */}
        <Card className="rise" style={{ ["--d" as string]: "240ms" }}>
          <Eyebrow>Security</Eyebrow>
          <Stack style={{ marginTop: 14 }}>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              }}
            >
              <div>
                <FieldLabel htmlFor="old-pass">Current password</FieldLabel>
                <Input
                  id="old-pass"
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="new-pass">New password</FieldLabel>
                <Input
                  id="new-pass"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
            </div>

            <PrimaryButton
              disabled={passMut.isPending || !oldPassword || !newPassword}
              onClick={() => passMut.mutate()}
              style={{ width: "fit-content" }}
            >
              {passMut.isPending && <Spinner />}
              {passMut.isPending ? "Updating..." : "Update password"}
            </PrimaryButton>
          </Stack>
        </Card>

        {/* ---- Danger zone ---- */}
        <Card
          className="rise"
          style={{
            borderColor: "color-mix(in srgb, var(--danger) 34%, transparent)",
            ["--d" as string]: "320ms",
          }}
        >
          <Eyebrow style={{ color: "var(--danger)" }}>Danger zone</Eyebrow>
          <Muted style={{ marginTop: 12 }}>
            Deleting your account removes your library and settings permanently.
          </Muted>
          <DangerButton
            style={{ marginTop: 14 }}
            disabled={deleteMut.isPending}
            onClick={() => {
              if (confirm("Delete account permanently?")) deleteMut.mutate();
            }}
          >
            {deleteMut.isPending && <Spinner />}
            {deleteMut.isPending ? "Deleting..." : "Delete account"}
          </DangerButton>
        </Card>
      </div>
    </Page>
  );
}
