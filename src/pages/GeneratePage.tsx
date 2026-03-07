import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePlaylist, savePlaylist } from "../features/playlists/playlists.api";
import type { PlaylistDraftOut, Song } from "../features/playlists/playlists.types";
import {
  Button,
  Card,
  CardTitle,
  H1,
  Muted,
  Page,
  PrimaryButton,
  Row,
  Stack,
  Textarea,
  Pill,
} from "../components/ui";

function songLabel(song: Song) {
  const artist = (song.artist ?? "Unknown artist").toString();
  const track = (song.track ?? "Unknown track").toString();
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

export function GeneratePage() {
  const nav = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<PlaylistDraftOut | null>(null);
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    setLoading(true);
    try {
      const generated = await generatePlaylist({ prompt, min_songs: 35, max_songs: 50 });
      setDraft(generated);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!draft) return;

    setLoading(true);
    try {
      const saved = await savePlaylist({
        name: draft.name_suggestion ?? "AI Playlist",
        description: draft.description_suggestion,
        songs: draft.songs,
        source_prompt: draft.source_prompt,
        total_songs: draft.total_songs,
      });
      nav(`/playlists/${saved.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Row style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: "min(100%, 240px)" }}>
          <H1>Generate</H1>
          <Muted style={{ fontSize: "clamp(15px, 3.8vw, 18px)" }}>Describe the vibe. We will do the rest.</Muted>
        </div>
        {draft && <Pill>{draft.total_songs} songs</Pill>}
      </Row>

      <div style={{ marginTop: 18 }}>
        <Stack>
          <Card>
            <CardTitle>Your prompt</CardTitle>
            <Muted>Try: "Late-night indie with nostalgic vocals and soft drums"</Muted>

            <div style={{ marginTop: 12 }}>
              <Textarea
                rows={4}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe your playlist..."
              />
            </div>

            <Row style={{ marginTop: 12 }}>
              <PrimaryButton disabled={!prompt || loading} onClick={onGenerate}>
                {loading ? "Generating..." : "Generate"}
              </PrimaryButton>

              <Button disabled={!draft || loading} onClick={onSave}>
                Save
              </Button>

              <Button disabled={!draft || loading} onClick={() => setDraft(null)}>
                Clear draft
              </Button>

              <Muted style={{ margin: 0 }}>{draft ? "Draft ready" : "No draft yet"}</Muted>
            </Row>
          </Card>

          {draft && (
            <Card>
              <CardTitle>{draft.name_suggestion}</CardTitle>
              <Muted>{draft.description_suggestion ?? "No description"}</Muted>

              <ol style={{ marginTop: 14, paddingLeft: 20, display: "grid", gap: 10 }}>
                {draft.songs.map((song, index) => {
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
                          <strong>{songLabel(song)}</strong>
                        </a>
                      ) : (
                        <strong>{songLabel(song)}</strong>
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
          )}
        </Stack>
      </div>
    </Page>
  );
}
