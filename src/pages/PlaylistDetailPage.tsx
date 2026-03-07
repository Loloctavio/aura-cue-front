import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePlaylist, exportPlaylistToSpotify, getPlaylist, updatePlaylist } from "../features/playlists/playlists.api";
import type { Song } from "../features/playlists/playlists.types";
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
  Textarea,
  Pill,
  Divider,
} from "../components/ui";

function songLabel(song: Song) {
  const artist = (song.artist ?? "Unknown").toString();
  const track = (song.track ?? "Unknown").toString();
  return `${artist} - ${track}`;
}

function agentsLabel(song: Song) {
  if (!Array.isArray(song.suggested_by) || song.suggested_by.length === 0) return "N/A";
  return song.suggested_by.join(", ");
}

function verificationStatus(song: Song) {
  const status = song.verified?.status;
  if (!status) return "unknown";
  return status.replaceAll("_", " ");
}

function isVerified(song: Song) {
  const status = song.verified?.status?.toLowerCase() ?? "";
  return status === "verified" || status === "matched" || status === "found";
}

export function PlaylistDetailPage() {
  const { playlistId } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["playlists", "detail", playlistId],
    queryFn: () => getPlaylist(playlistId!),
    enabled: Boolean(playlistId),
  });

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!data) return;
    setName(data.name ?? "");
    setDescription(data.description ?? "");
  }, [data]);

  const updateMut = useMutation({
    mutationFn: () => updatePlaylist(playlistId!, { name, description }),
    onSuccess: (updated) => {
      qc.setQueryData(["playlists", "detail", playlistId], updated);
      qc.invalidateQueries({ queryKey: ["playlists", "me"] });
      setEditing(false);
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deletePlaylist(playlistId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["playlists", "me"] });
      nav("/dashboard");
    },
  });

  const exportMut = useMutation({
    mutationFn: () => exportPlaylistToSpotify(playlistId!, { public: true }),
    onSuccess: (result) => {
      alert("Playlist saved to Spotify successfully.");
      if (result.spotify_playlist_url) {
        window.open(result.spotify_playlist_url, "_blank", "noopener,noreferrer");
      }
    },
    onError: () => {
      alert("Could not export this playlist to Spotify.");
    },
  });

  if (isLoading) return <Page>Loading...</Page>;
  if (!data) return <Page>Playlist not found.</Page>;

  return (
    <Page>
      <Row style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 14 }}>
        <div style={{ flex: 1, minWidth: "min(100%, 240px)" }}>
          <H1>{data.name ?? "Untitled"}</H1>
          <Muted style={{ fontSize: "clamp(15px, 3.6vw, 17px)" }}>{data.description ?? "No description"}</Muted>
        </div>
        <Pill>{data.total_songs} songs</Pill>
      </Row>

      <Row style={{ marginTop: 14 }}>
        <Button onClick={() => setEditing((value) => !value)}>{editing ? "Cancel" : "Edit"}</Button>
        <PrimaryButton disabled={exportMut.isPending} onClick={() => exportMut.mutate()}>
          {exportMut.isPending ? "Saving..." : "Save to Spotify"}
        </PrimaryButton>
        <DangerButton
          disabled={deleteMut.isPending}
          onClick={() => {
            if (confirm("Delete this playlist?")) deleteMut.mutate();
          }}
        >
          {deleteMut.isPending ? "Deleting..." : "Delete"}
        </DangerButton>
        <Link to="/dashboard" style={{ alignSelf: "center", fontWeight: 600 }}>
          Back
        </Link>
      </Row>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
          gap: 14,
        }}
      >
        <Card>
          <CardTitle>Details</CardTitle>
          <Muted>Created: {data.created_at ? new Date(data.created_at).toLocaleString() : "-"}</Muted>
          <Muted>Updated: {data.updated_at ? new Date(data.updated_at).toLocaleString() : "-"}</Muted>

          {editing && (
            <>
              <Divider />
              <Stack>
                <div>
                  <Muted>Name</Muted>
                  <Input value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div>
                  <Muted>Description</Muted>
                  <Textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
                </div>

                <PrimaryButton disabled={updateMut.isPending} onClick={() => updateMut.mutate()} style={{ width: "fit-content" }}>
                  {updateMut.isPending ? "Saving..." : "Save changes"}
                </PrimaryButton>
              </Stack>
            </>
          )}
        </Card>

        <Card>
          <CardTitle>Songs</CardTitle>
          <Muted>Open Spotify links when available.</Muted>

          <ol style={{ marginTop: 12, paddingLeft: 20, display: "grid", gap: 10 }}>
            {data.songs.map((song, index) => {
              const spotifyUrl =
                typeof song.spotify_url === "string"
                  ? song.spotify_url
                  : typeof song.verified?.spotify_url === "string"
                    ? song.verified.spotify_url
                    : null;
              return (
                <li key={`${songLabel(song)}-${index}`} style={{ lineHeight: 1.35 }}>
                  {spotifyUrl ? (
                    <a href={spotifyUrl} target="_blank" rel="noreferrer">
                      {songLabel(song)}
                    </a>
                  ) : (
                    <span>{songLabel(song)}</span>
                  )}
                  {song.reason ? <div style={{ color: "var(--muted)" }}>{String(song.reason)}</div> : null}
                  <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: 24,
                        padding: "0 9px",
                        borderRadius: 999,
                        border: "1px solid var(--border)",
                        fontSize: 12,
                        color: "var(--muted)",
                      }}
                    >
                      Agent: {agentsLabel(song)}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: 24,
                        padding: "0 9px",
                        borderRadius: 999,
                        border: "1px solid var(--border)",
                        fontSize: 12,
                        color: isVerified(song) ? "var(--primary)" : "var(--muted)",
                      }}
                    >
                      Verified: {verificationStatus(song)}
                    </span>
                    {typeof song.verified?.confidence === "number" ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          minHeight: 24,
                          padding: "0 9px",
                          borderRadius: 999,
                          border: "1px solid var(--border)",
                          fontSize: 12,
                          color: "var(--muted)",
                        }}
                      >
                        Confidence: {Math.round(song.verified.confidence * 100)}%
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
          <Muted>
            Track metadata and links are provided by Spotify. Spotify is a trademark of Spotify AB.
          </Muted>
        </Card>
      </div>
    </Page>
  );
}
