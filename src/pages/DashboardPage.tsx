import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listMyPlaylists } from "../features/playlists/playlists.api";
import { Button, Card, CardTitle, H1, Muted, Page, Pill, Row, Stack } from "../components/ui";
import type { PlaylistOut } from "../features/playlists/playlists.types";

const THEME_ICON_RULES: Array<{ icon: string; keywords: string[] }> = [
  { icon: "🌙", keywords: ["night", "late", "midnight", "moon", "after hours"] },
  { icon: "☀️", keywords: ["summer", "sun", "beach", "day", "sunset", "sunrise"] },
  { icon: "🌧️", keywords: ["rain", "storm", "sad", "melancholy", "cry"] },
  { icon: "🔥", keywords: ["party", "workout", "gym", "energy", "hype", "dance", "club"] },
  { icon: "💕", keywords: ["love", "romance", "date", "heart", "crush"] },
  { icon: "🌿", keywords: ["chill", "focus", "study", "calm", "ambient", "lofi"] },
  { icon: "🚗", keywords: ["drive", "road", "trip", "highway", "car"] },
  { icon: "🎸", keywords: ["rock", "indie", "guitar", "band", "alt"] },
  { icon: "🎧", keywords: ["mix", "playlist", "beats", "vibe", "music"] },
];

function getPlaylistThemeIcon(playlist: PlaylistOut) {
  const searchText = [
    playlist.name,
    playlist.description,
    playlist.source_prompt,
    ...playlist.songs.flatMap((song) => (Array.isArray(song.genres) ? song.genres : [])),
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  const match = THEME_ICON_RULES.find((rule) => rule.keywords.some((keyword) => searchText.includes(keyword)));
  return match?.icon ?? "🎵";
}

function getPlaylistSummary(playlist: PlaylistOut) {
  const songs = Array.isArray(playlist.songs) ? playlist.songs : [];
  const verifiedCount = songs.filter((song) => {
    const status = song.verified?.status?.toLowerCase() ?? "";
    return status === "verified" || status === "matched" || status === "found";
  }).length;

  const topAgents = Array.from(
    songs.reduce((counts, song) => {
      for (const agent of Array.isArray(song.suggested_by) ? song.suggested_by : []) {
        counts.set(agent, (counts.get(agent) ?? 0) + 1);
      }
      return counts;
    }, new Map<string, number>()),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([agent]) => agent);

  const genreSet = new Set(
    songs.flatMap((song) => (Array.isArray(song.genres) ? song.genres : [])).filter((value): value is string => Boolean(value)),
  );

  return {
    verifiedCount,
    topAgents,
    genreCount: genreSet.size,
  };
}

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["playlists", "me"],
    queryFn: () => listMyPlaylists({ limit: 50, skip: 0 }),
  });

  const playlists = data ?? [];

  return (
    <Page>
      <Card
        style={{
          overflow: "hidden",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--panel-strong) 88%, rgba(37, 87, 214, 0.08)) 0%, color-mix(in srgb, var(--panel-strong) 88%, rgba(236, 111, 69, 0.08)) 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Pill style={{ width: "fit-content", margin: "0 auto 14px" }}>Library overview</Pill>
          <H1>My Playlists</H1>
          <Muted style={{ fontSize: "clamp(15px, 3.8vw, 18px)", maxWidth: 620, lineHeight: 1.65, marginInline: "auto" }}>
            Review saved playlists, reopen drafts you want to export, and jump back into generation without losing
            the rest of your library.
          </Muted>
          <div style={{ marginTop: 18 }}>
            <Link to="/generate">
              <Button>+ Generate</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 18 }}>
        {isLoading && (
          <Stack>
            <Card>
              <Muted>Loading playlists...</Muted>
            </Card>
            <Card>
              <Muted>Fetching your library...</Muted>
            </Card>
          </Stack>
        )}

        {error && (
          <Card>
            <CardTitle>Could not load playlists</CardTitle>
            <Muted>Try refreshing or login again if your token expired.</Muted>
          </Card>
        )}

        {!isLoading && !error && playlists.length === 0 && (
          <Card
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--panel-strong) 90%, rgba(245, 188, 114, 0.1)) 0%, var(--panel) 100%)",
            }}
          >
            <CardTitle>No playlists yet</CardTitle>
            <Muted>Generate your first playlist and save it to see it here.</Muted>
            <div style={{ marginTop: 12 }}>
              <Link to="/generate">
                <Button>Go to Generate</Button>
              </Link>
            </div>
          </Card>
        )}

        {!isLoading && !error && playlists.length > 0 && (
          <div style={{ display: "grid", gap: 16, marginTop: 4 }}>
            {playlists.map((playlist) => {
              const summary = getPlaylistSummary(playlist);
              const icon = getPlaylistThemeIcon(playlist);

              return (
                <Link key={playlist.id} to={`/playlists/${playlist.id}`} style={{ color: "inherit" }}>
                  <Card
                    style={{
                      padding: 20,
                      background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--panel-strong) 94%, rgba(37, 87, 214, 0.05)) 0%, var(--panel) 100%)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gap: 18,
                        alignItems: "center",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <Row style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                          <div style={{ flex: 1, minWidth: 220 }}>
                            <Row style={{ gap: 10, marginBottom: 14 }}>
                              <Pill style={{ width: "fit-content" }}>Saved playlist</Pill>
                              <span
                                aria-hidden="true"
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 14,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 22,
                                  background: "color-mix(in srgb, var(--panel-strong) 92%, rgba(236, 111, 69, 0.08))",
                                  border: "1px solid var(--border)",
                                }}
                              >
                                {icon}
                              </span>
                            </Row>
                            <CardTitle style={{ fontSize: "clamp(24px, 4vw, 30px)" }}>{playlist.name ?? "Untitled"}</CardTitle>
                            <Muted style={{ marginTop: 8, lineHeight: 1.65 }}>
                              {playlist.description ?? "No description"}
                            </Muted>
                          </div>
                          <Pill style={{ minWidth: 94, justifyContent: "center" }}>{playlist.total_songs} songs</Pill>
                        </Row>

                        <Row style={{ marginTop: 16, gap: 8 }}>
                          {summary.topAgents.length > 0 ? (
                            summary.topAgents.map((agent) => (
                              <Pill key={`${playlist.id}-${agent}`} style={{ minHeight: 30 }}>
                                {agent}
                              </Pill>
                            ))
                          ) : (
                            <Pill style={{ minHeight: 30 }}>No agent data</Pill>
                          )}
                        </Row>
                      </div>

                      <div style={{ display: "grid", gap: 10 }}>
                        <Row style={{ gap: 10, flexWrap: "nowrap", overflowX: "auto" }}>
                          <Card style={{ padding: 14, minWidth: 130, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                            <CardTitle style={{ fontSize: 18 }}>{summary.verifiedCount}</CardTitle>
                            <Muted style={{ marginTop: 4 }}>Verified tracks</Muted>
                          </Card>
                          <Card style={{ padding: 14, minWidth: 130, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                            <CardTitle style={{ fontSize: 18 }}>{summary.genreCount}</CardTitle>
                            <Muted style={{ marginTop: 4 }}>Genres tagged</Muted>
                          </Card>
                          <Card style={{ padding: 14, minWidth: 130, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                            <CardTitle style={{ fontSize: 18 }}>{summary.topAgents.length || "-"}</CardTitle>
                            <Muted style={{ marginTop: 4 }}>Lead agents</Muted>
                          </Card>
                        </Row>

                        <Row style={{ justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                          <Muted style={{ margin: 0 }}>Theme cue: {icon} auto-matched from the playlist text.</Muted>
                          <Muted style={{ margin: 0 }}>
                            Updated: {playlist.updated_at ? new Date(playlist.updated_at).toLocaleDateString() : "-"}
                          </Muted>
                        </Row>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Page>
  );
}
