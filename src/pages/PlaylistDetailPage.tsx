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

function uniqueAgents(songs: Song[]) {
  return Array.from(
    songs.reduce((agents, song) => {
      for (const agent of Array.isArray(song.suggested_by) ? song.suggested_by : []) {
        agents.add(agent);
      }
      return agents;
    }, new Set<string>()),
  );
}

function topGenres(songs: Song[]) {
  return Array.from(
    songs.reduce((counts, song) => {
      for (const genre of Array.isArray(song.genres) ? song.genres : []) {
        counts.set(genre, (counts.get(genre) ?? 0) + 1);
      }
      return counts;
    }, new Map<string, number>()),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([genre]) => genre);
}

export function PlaylistDetailPage() {
  const SONGS_PER_PAGE = 15;
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
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!data) return;
    setName(data.name ?? "");
    setDescription(data.description ?? "");
    setPage(1);
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

  const verifiedCount = data.songs.filter(isVerified).length;
  const agentList = uniqueAgents(data.songs);
  const genreList = topGenres(data.songs);
  const promptPreview = typeof data.source_prompt === "string" && data.source_prompt.trim() ? data.source_prompt : null;
  const totalPages = Math.max(1, Math.ceil(data.songs.length / SONGS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * SONGS_PER_PAGE;
  const paginatedSongs = data.songs.slice(pageStart, pageStart + SONGS_PER_PAGE);

  return (
    <Page>
      <Row style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 14 }}>
        <div style={{ flex: 1, minWidth: "min(100%, 240px)" }}>
          <Pill style={{ width: "fit-content", marginBottom: 14 }}>Playlist detail</Pill>
          <H1>{data.name ?? "Untitled"}</H1>
          <Muted style={{ fontSize: "clamp(15px, 3.6vw, 17px)", lineHeight: 1.65 }}>
            {data.description ?? "No description"}
          </Muted>
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
          <div
            style={{
              display: "grid",
              gap: 10,
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              marginTop: 14,
            }}
          >
            <Card style={{ padding: 14, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
              <CardTitle style={{ fontSize: 18 }}>{verifiedCount}</CardTitle>
              <Muted style={{ marginTop: 4 }}>Verified songs</Muted>
            </Card>
            <Card style={{ padding: 14, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
              <CardTitle style={{ fontSize: 18 }}>{agentList.length}</CardTitle>
              <Muted style={{ marginTop: 4 }}>Agents involved</Muted>
            </Card>
          </div>

          <Divider />

          <Muted style={{ lineHeight: 1.65 }}>Created: {data.created_at ? new Date(data.created_at).toLocaleString() : "-"}</Muted>
          <Muted style={{ lineHeight: 1.65 }}>Updated: {data.updated_at ? new Date(data.updated_at).toLocaleString() : "-"}</Muted>

          {promptPreview ? (
            <>
              <Divider />
              <div>
                <Muted style={{ marginTop: 0 }}>Source prompt</Muted>
                <Card style={{ padding: 14, marginTop: 8, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                  <Muted style={{ marginTop: 0, lineHeight: 1.65, color: "var(--text)" }}>{promptPreview}</Muted>
                </Card>
              </div>
            </>
          ) : null}

          <Divider />

          <Stack style={{ gap: 12 }}>
            <div>
              <Muted style={{ marginTop: 0 }}>Contributing agents</Muted>
              <Row style={{ marginTop: 8, gap: 8 }}>
                {agentList.length > 0 ? (
                  agentList.map((agent) => (
                    <Pill key={agent} style={{ minHeight: 30 }}>
                      {agent}
                    </Pill>
                  ))
                ) : (
                  <Pill style={{ minHeight: 30 }}>No agent data</Pill>
                )}
              </Row>
            </div>

            <div>
              <Muted style={{ marginTop: 0 }}>Top genres</Muted>
              <Row style={{ marginTop: 8, gap: 8 }}>
                {genreList.length > 0 ? (
                  genreList.map((genre) => (
                    <Pill key={genre} style={{ minHeight: 30 }}>
                      {genre}
                    </Pill>
                  ))
                ) : (
                  <Pill style={{ minHeight: 30 }}>No genre tags</Pill>
                )}
              </Row>
            </div>
          </Stack>

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
          <Row style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
            <div>
              <CardTitle>Songs</CardTitle>
              <Muted>Open Spotify links when available.</Muted>
            </div>
            <Pill>
              Page {currentPage} of {totalPages}
            </Pill>
          </Row>

          <ol style={{ marginTop: 12, paddingLeft: 20, display: "grid", gap: 14 }}>
            {paginatedSongs.map((song, index) => {
              const spotifyUrl =
                typeof song.spotify_url === "string"
                  ? song.spotify_url
                  : typeof song.verified?.spotify_url === "string"
                    ? song.verified.spotify_url
                    : null;
              return (
                <li
                  key={`${songLabel(song)}-${index}`}
                  style={{
                    lineHeight: 1.45,
                    padding: "14px 0 0",
                    borderTop: index === 0 ? "none" : "1px solid var(--border)",
                  }}
                >
                  {spotifyUrl ? (
                    <a href={spotifyUrl} target="_blank" rel="noreferrer">
                      <strong style={{ fontSize: 16 }}>{songLabel(song)}</strong>
                    </a>
                  ) : (
                    <strong style={{ fontSize: 16 }}>{songLabel(song)}</strong>
                  )}
                  {song.reason ? <div style={{ color: "var(--muted)" }}>{String(song.reason)}</div> : null}
                  <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: 24,
                        padding: "0 10px",
                        borderRadius: 999,
                        border: "1px solid var(--border)",
                        fontSize: 12,
                        background: "color-mix(in srgb, var(--panel-soft) 85%, transparent)",
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
                        padding: "0 10px",
                        borderRadius: 999,
                        border: "1px solid var(--border)",
                        fontSize: 12,
                        background: isVerified(song) ? "rgba(37, 87, 214, 0.08)" : "color-mix(in srgb, var(--panel-soft) 85%, transparent)",
                        color: isVerified(song) ? "var(--accent)" : "var(--muted)",
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
                          padding: "0 10px",
                          borderRadius: 999,
                          border: "1px solid var(--border)",
                          fontSize: 12,
                          background: "color-mix(in srgb, var(--panel-soft) 85%, transparent)",
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

          {data.songs.length > SONGS_PER_PAGE ? (
            <Row style={{ marginTop: 18, justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <Muted style={{ margin: 0 }}>
                Showing {pageStart + 1}-{Math.min(pageStart + SONGS_PER_PAGE, data.songs.length)} of {data.songs.length} songs
              </Muted>
              <Row style={{ gap: 10 }}>
                <Button disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                  Previous
                </Button>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                >
                  Next
                </Button>
              </Row>
            </Row>
          ) : null}

          <Muted>
            Track metadata and links are provided by Spotify. Spotify is a trademark of Spotify AB.
          </Muted>
        </Card>
      </div>
    </Page>
  );
}
