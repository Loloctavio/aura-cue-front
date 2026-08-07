import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listMyPlaylists } from "../features/playlists/playlists.api";
import {
  Card,
  CardTitle,
  Chip,
  Eyebrow,
  H1,
  Muted,
  Page,
  PrimaryButton,
  Row,
  SkeletonCard,
} from "../components/ui";
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
      <div className="section-head">
        <div>
          <Eyebrow>Library</Eyebrow>
          <H1 style={{ marginTop: 12 }}>Playlists</H1>
        </div>
        <Row style={{ gap: 12 }}>
          {!isLoading && !error && <Chip>{playlists.length} saved</Chip>}
          <Link to="/generate">
            <PrimaryButton>New playlist →</PrimaryButton>
          </Link>
        </Row>
      </div>

      {isLoading && (
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          }}
        >
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} className="fade-in" style={{ ["--d" as string]: "120ms" }} />
          <SkeletonCard lines={3} className="fade-in" style={{ ["--d" as string]: "240ms" }} />
        </div>
      )}

      {error && (
        <Card dashed style={{ textAlign: "center", padding: "clamp(30px, 6vw, 60px)" }}>
          <CardTitle>Could not load playlists</CardTitle>
          <Muted>Try refreshing or login again if your token expired.</Muted>
        </Card>
      )}

      {!isLoading && !error && playlists.length === 0 && (
        <Card dashed style={{ textAlign: "center", padding: "clamp(36px, 7vw, 70px)" }}>
          <div style={{ fontSize: 40 }}>🎧</div>
          <CardTitle style={{ marginTop: 12, fontSize: 22 }}>No playlists yet</CardTitle>
          <Muted style={{ maxWidth: 380, marginInline: "auto", lineHeight: 1.7 }}>
            Generate your first playlist and save it to see it here.
          </Muted>
          <div style={{ marginTop: 20 }}>
            <Link to="/generate">
              <PrimaryButton>Go to Generate →</PrimaryButton>
            </Link>
          </div>
        </Card>
      )}

      {!isLoading && !error && playlists.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          }}
        >
          {playlists.map((playlist, index) => {
            const summary = getPlaylistSummary(playlist);
            const icon = getPlaylistThemeIcon(playlist);

            return (
              <Link key={playlist.id} to={`/playlists/${playlist.id}`} style={{ color: "inherit", display: "grid" }}>
                <Card
                  hover
                  className="rise"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    ["--d" as string]: `${Math.min(index * 60, 420)}ms`,
                  }}
                >
                  <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                        background: "color-mix(in srgb, var(--primary) 9%, transparent)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {icon}
                    </span>
                    <Chip>{playlist.total_songs} songs</Chip>
                  </Row>

                  <div style={{ flex: 1 }}>
                    <CardTitle style={{ fontSize: 20 }}>{playlist.name ?? "Untitled"}</CardTitle>
                    <Muted
                      style={{
                        lineHeight: 1.6,
                        fontSize: 14,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {playlist.description ?? "No description"}
                    </Muted>
                  </div>

                  <div
                    className="mono"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      flexWrap: "wrap",
                      paddingTop: 12,
                      borderTop: "1px solid var(--border)",
                      color: "var(--muted)",
                    }}
                  >
                    <span>{summary.verifiedCount} verified · {summary.genreCount} genres</span>
                    <span>{playlist.updated_at ? new Date(playlist.updated_at).toLocaleDateString() : "—"}</span>
                  </div>

                  {summary.topAgents.length > 0 && (
                    <Row style={{ gap: 6 }}>
                      {summary.topAgents.map((agent) => (
                        <Chip key={`${playlist.id}-${agent}`} tone="warm">
                          {agent}
                        </Chip>
                      ))}
                    </Row>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </Page>
  );
}
