import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePlaylist, exportPlaylistToSpotify, getPlaylist, updatePlaylist } from "../features/playlists/playlists.api";
import type { Song } from "../features/playlists/playlists.types";
import { safeSpotifyPlaylistUrl, safeSpotifyTrackUrl } from "../lib/externalUrls";
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
  Textarea,
} from "../components/ui";

function songLabel(song: Song) {
  const artist = (song.artist ?? "Unknown").toString();
  const track = (song.track ?? "Unknown").toString();
  return `${artist} — ${track}`;
}

function agentsFull(song: Song) {
  if (!Array.isArray(song.suggested_by) || song.suggested_by.length === 0) return "N/A";
  return song.suggested_by.join(", ");
}

function agentsLabel(song: Song) {
  const agents = Array.isArray(song.suggested_by) ? song.suggested_by : [];
  if (agents.length === 0) return "N/A";
  if (agents.length <= 2) return agents.join(", ");
  return `${agents[0]} +${agents.length - 1}`;
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
      const spotifyUrl = safeSpotifyPlaylistUrl(result.spotify_playlist_url);
      if (spotifyUrl) {
        window.open(spotifyUrl, "_blank", "noopener,noreferrer");
      }
    },
    onError: () => {
      alert("Could not export this playlist to Spotify.");
    },
  });

  if (isLoading) {
    return (
      <Page>
        <Skeleton style={{ width: 110, height: 14 }} />
        <Skeleton style={{ width: "min(420px, 70%)", height: 46, marginTop: 18 }} />
        <Skeleton style={{ width: "min(300px, 50%)", height: 14, marginTop: 14 }} />
        <div
          style={{
            marginTop: 26,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 14,
          }}
        >
          <SkeletonCard lines={6} />
          <SkeletonCard lines={4} className="fade-in" style={{ ["--d" as string]: "120ms" }} />
        </div>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <Card dashed className="rise" style={{ textAlign: "center", padding: "clamp(30px, 6vw, 60px)" }}>
          <CardTitle>Playlist not found</CardTitle>
          <Muted>It may have been deleted, or the link is out of date.</Muted>
          <div style={{ marginTop: 18 }}>
            <Link to="/dashboard">
              <Button>← Back to library</Button>
            </Link>
          </div>
        </Card>
      </Page>
    );
  }

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
      <Link to="/dashboard" className="mono" style={{ color: "var(--muted)", fontWeight: 600 }}>
        ← Library
      </Link>

      {/* ---- Header band ---- */}
      <div className="section-head" style={{ marginTop: 16, alignItems: "flex-end" }}>
        <div style={{ minWidth: "min(100%, 260px)" }}>
          <Eyebrow>Playlist</Eyebrow>
          <H1 style={{ marginTop: 12 }}>{data.name ?? "Untitled"}</H1>
          <Muted style={{ fontSize: 15.5, lineHeight: 1.65, maxWidth: 620 }}>
            {data.description ?? "No description"}
          </Muted>
          <Row style={{ marginTop: 14, gap: 8 }}>
            <Chip>{data.total_songs} songs</Chip>
            <Chip tone="ok">{verifiedCount} verified</Chip>
            <Chip>{agentList.length} agents</Chip>
          </Row>
        </div>

        <Row style={{ gap: 8, paddingBottom: 4 }}>
          <Button className="btn--ghost btn--sm" onClick={() => setEditing((value) => !value)}>
            {editing ? "Cancel" : "Edit"}
          </Button>
          <PrimaryButton className="btn--sm" disabled={exportMut.isPending} onClick={() => exportMut.mutate()}>
            {exportMut.isPending && <Spinner />}
            {exportMut.isPending ? "Saving..." : "Save to Spotify"}
          </PrimaryButton>
          <DangerButton
            className="btn--sm"
            disabled={deleteMut.isPending}
            onClick={() => {
              if (confirm("Delete this playlist?")) deleteMut.mutate();
            }}
          >
            {deleteMut.isPending && <Spinner />}
            {deleteMut.isPending ? "Deleting..." : "Delete"}
          </DangerButton>
        </Row>
      </div>

      <div
        style={{
          display: "grid",
          gap: 18,
          alignItems: "start",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        }}
      >
        {/* ---- Track table (main) ---- */}
        <Card style={{ gridColumn: "span 1", padding: "clamp(14px, 2.4vw, 22px)" }}>
          <div style={{ padding: "6px 8px 0" }}>
            <Row style={{ justifyContent: "space-between", gap: 12 }}>
              <CardTitle>Tracklist</CardTitle>
              <Chip>
                {currentPage} / {totalPages}
              </Chip>
            </Row>
            <div className="hairline" style={{ margin: "14px 0 8px" }} />
          </div>

          <div>
            {paginatedSongs.map((song, index) => {
              const absoluteIndex = pageStart + index;
              const spotifyUrl = safeSpotifyTrackUrl(song.spotify_url) ?? safeSpotifyTrackUrl(song.verified?.spotify_url);

              return (
                <div
                  key={`${songLabel(song)}-${absoluteIndex}`}
                  className="track rise"
                  style={{ ["--d" as string]: `${Math.min(index * 40, 480)}ms` }}
                >
                  <span className="track-idx">{String(absoluteIndex + 1).padStart(2, "0")}</span>
                  <div style={{ minWidth: 0 }}>
                    {spotifyUrl ? (
                      <a href={spotifyUrl} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                        <p className="track-title">{songLabel(song)} ↗</p>
                      </a>
                    ) : (
                      <p className="track-title">{songLabel(song)}</p>
                    )}
                    {song.reason ? <p className="track-sub">{String(song.reason)}</p> : null}
                    <div className="track-meta">
                      <Chip title={agentsFull(song)}>{agentsLabel(song)}</Chip>
                      <Chip tone={isVerified(song) ? "ok" : undefined}>
                        <span className={isVerified(song) ? "dot dot--ok" : "dot dot--muted"} />
                        {verificationStatus(song)}
                      </Chip>
                      {typeof song.verified?.confidence === "number" ? (
                        <Chip>{Math.round(song.verified.confidence * 100)}%</Chip>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {data.songs.length > SONGS_PER_PAGE ? (
            <Row style={{ marginTop: 16, padding: "0 8px", justifyContent: "space-between", gap: 12 }}>
              <Muted className="mono" style={{ margin: 0, fontSize: 12 }}>
                {pageStart + 1}–{Math.min(pageStart + SONGS_PER_PAGE, data.songs.length)} of {data.songs.length}
              </Muted>
              <Row style={{ gap: 8 }}>
                <Button className="btn--sm" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                  ← Prev
                </Button>
                <Button className="btn--sm" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                  Next →
                </Button>
              </Row>
            </Row>
          ) : null}

          <Muted className="mono" style={{ fontSize: 11.5, padding: "12px 8px 4px" }}>
            Track metadata and links are provided by Spotify. Spotify is a trademark of Spotify AB.
          </Muted>
        </Card>

        {/* ---- Details aside ---- */}
        <div style={{ display: "grid", gap: 14, alignSelf: "start" }}>
          {editing && (
            <Card tinted className="scale-in">
              <Eyebrow>Edit playlist</Eyebrow>
              <Stack style={{ marginTop: 14 }}>
                <div>
                  <FieldLabel htmlFor="pl-name">Name</FieldLabel>
                  <Input id="pl-name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div>
                  <FieldLabel htmlFor="pl-desc">Description</FieldLabel>
                  <Textarea id="pl-desc" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
                </div>

                <PrimaryButton disabled={updateMut.isPending} onClick={() => updateMut.mutate()} style={{ width: "fit-content" }}>
                  {updateMut.isPending && <Spinner />}
                  {updateMut.isPending ? "Saving..." : "Save changes"}
                </PrimaryButton>
              </Stack>
            </Card>
          )}

          {promptPreview ? (
            <Card>
              <Eyebrow>Source prompt</Eyebrow>
              <Muted style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text)", fontStyle: "italic" }}>
                “{promptPreview}”
              </Muted>
            </Card>
          ) : null}

          <Card>
            <Eyebrow>Contributing agents</Eyebrow>
            <Row style={{ marginTop: 12, gap: 6 }}>
              {agentList.length > 0 ? (
                agentList.map((agent) => (
                  <Chip key={agent} tone="warm">
                    {agent}
                  </Chip>
                ))
              ) : (
                <Chip>No agent data</Chip>
              )}
            </Row>

            <div className="hairline" />

            <Eyebrow>Top genres</Eyebrow>
            <Row style={{ marginTop: 12, gap: 6 }}>
              {genreList.length > 0 ? (
                genreList.map((genre) => <Chip key={genre}>{genre}</Chip>)
              ) : (
                <Chip>No genre tags</Chip>
              )}
            </Row>

            <div className="hairline" />

            <div className="mono" style={{ color: "var(--muted)", display: "grid", gap: 6 }}>
              <span>created · {data.created_at ? new Date(data.created_at).toLocaleString() : "—"}</span>
              <span>updated · {data.updated_at ? new Date(data.updated_at).toLocaleString() : "—"}</span>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
