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
  Divider,
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
  const SONGS_PER_PAGE = 15;
  const nav = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<PlaylistDraftOut | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(1);

  const onGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generatePlaylist({ prompt, min_songs: 35, max_songs: 50 });
      setDraft(generated);
      setPage(1);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSave = async () => {
    if (!draft) return;

    setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  return (
    <Page>
      <Row style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: "min(100%, 240px)" }}>
          <Pill style={{ width: "fit-content", marginBottom: 14 }}>Create a draft</Pill>
          <H1>Generate</H1>
          <Muted style={{ fontSize: "clamp(15px, 3.8vw, 18px)", maxWidth: 640, lineHeight: 1.65 }}>
            Describe the vibe, context, and constraints. The agent system keeps the workflow intact but now presents
            the draft with clearer hierarchy and easier scanning.
          </Muted>
        </div>
        {draft && <Pill>{draft.total_songs} songs</Pill>}
      </Row>

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gap: 18,
          alignItems: "start",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        }}
      >
        <Stack style={{ alignContent: "start", alignSelf: "start" }}>
          <Card
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--panel-strong) 90%, rgba(236, 111, 69, 0.08)) 0%, var(--panel) 100%)",
            }}
          >
            <CardTitle>Your prompt</CardTitle>
            <Muted style={{ lineHeight: 1.65 }}>
              Try: "Late-night indie with nostalgic vocals and soft drums"
            </Muted>

            <div style={{ marginTop: 12 }}>
              <Textarea
                rows={4}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe your playlist..."
              />
            </div>

            <Row style={{ marginTop: 12 }}>
              <PrimaryButton disabled={!prompt || isGenerating || isSaving} onClick={onGenerate}>
                {isGenerating ? "Generating..." : "Generate"}
              </PrimaryButton>

              <Button disabled={!draft || isGenerating || isSaving} onClick={onSave}>
                {isSaving ? "Saving..." : "Save"}
              </Button>

              <Button
                disabled={!draft || isGenerating || isSaving}
                onClick={() => {
                  setDraft(null);
                  setPage(1);
                }}
              >
                Clear draft
              </Button>

              <Muted style={{ margin: 0 }}>
                {isGenerating ? "Agents are building your playlist..." : draft ? "Draft ready" : "No draft yet"}
              </Muted>
            </Row>
          </Card>

          <Card>
            <CardTitle>What the agents use</CardTitle>
            <Divider />
            <Stack style={{ gap: 12 }}>
              <div>
                <b>Mood and intent</b>
                <Muted>Emotional tone, activity, and any situational cues from your prompt.</Muted>
              </div>
              <div>
                <b>Constraint handling</b>
                <Muted>Genre, language, energy, popularity, and vocal preferences.</Muted>
              </div>
              <div>
                <b>Sequence logic</b>
                <Muted>Ordering decisions so the generated set feels like a playlist, not a random list.</Muted>
              </div>
            </Stack>
          </Card>
        </Stack>

        {!draft && !isGenerating && (
          <Card
            style={{
              alignSelf: "start",
              minHeight: 420,
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--panel-strong) 92%, rgba(37, 87, 214, 0.06)) 0%, var(--panel) 100%)",
            }}
          >
            <Pill style={{ width: "fit-content", marginBottom: 14 }}>Preview area</Pill>
            <CardTitle>Your generated playlist will appear here</CardTitle>
            <Muted style={{ lineHeight: 1.7, maxWidth: 560 }}>
              Once you generate a draft, this panel will fill with the playlist title, description, recommended songs,
              and the verification metadata for each track.
            </Muted>
            <Divider />
            <Stack style={{ gap: 12 }}>
              <Card style={{ padding: 16, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                <Muted style={{ marginTop: 0 }}>Step 1</Muted>
                <CardTitle style={{ fontSize: 18, marginTop: 6 }}>Write a prompt</CardTitle>
                <Muted>Describe mood, genre, language, popularity, or context.</Muted>
              </Card>
              <Card style={{ padding: 16, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                <Muted style={{ marginTop: 0 }}>Step 2</Muted>
                <CardTitle style={{ fontSize: 18, marginTop: 6 }}>Generate the draft</CardTitle>
                <Muted>The agent system will combine suggestions and verify tracks where possible.</Muted>
              </Card>
              <Card style={{ padding: 16, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                <Muted style={{ marginTop: 0 }}>Step 3</Muted>
                <CardTitle style={{ fontSize: 18, marginTop: 6 }}>Save when ready</CardTitle>
                <Muted>Review the recommendations, then save the playlist into your library.</Muted>
              </Card>
            </Stack>
          </Card>
        )}

        {isGenerating && (
          <Card
            style={{
              alignSelf: "start",
              minHeight: 420,
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--panel-strong) 92%, rgba(37, 87, 214, 0.08)) 0%, var(--panel) 100%)",
            }}
          >
            <Pill style={{ width: "fit-content", marginBottom: 14 }}>Generating now</Pill>
            <CardTitle>Building your playlist...</CardTitle>
            <Muted style={{ lineHeight: 1.7, maxWidth: 560 }}>
              The completed draft will appear in this panel. AuraCue is interpreting your prompt, combining agent
              recommendations, and checking Spotify matches where available.
            </Muted>
            <Divider />
            <Stack style={{ gap: 12 }}>
              <Card style={{ padding: 16, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                <CardTitle style={{ fontSize: 18 }}>Reading the brief</CardTitle>
                <Muted>Extracting mood, genre, energy, language, and sequencing signals from your prompt.</Muted>
              </Card>
              <Card style={{ padding: 16, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                <CardTitle style={{ fontSize: 18 }}>Collecting candidates</CardTitle>
                <Muted>Multiple agents are proposing tracks from different musical angles.</Muted>
              </Card>
              <Card style={{ padding: 16, background: "color-mix(in srgb, var(--panel-strong) 92%, transparent)" }}>
                <CardTitle style={{ fontSize: 18 }}>Preparing the draft</CardTitle>
                <Muted>The right side will update automatically as soon as the playlist is ready.</Muted>
              </Card>
            </Stack>
          </Card>
        )}

        {draft && !isGenerating && (
          (() => {
            const totalPages = Math.max(1, Math.ceil(draft.songs.length / SONGS_PER_PAGE));
            const currentPage = Math.min(page, totalPages);
            const pageStart = (currentPage - 1) * SONGS_PER_PAGE;
            const paginatedSongs = draft.songs.slice(pageStart, pageStart + SONGS_PER_PAGE);

            return (
              <Card
                style={{
                  alignSelf: "start",
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--panel-strong) 92%, rgba(37, 87, 214, 0.06)) 0%, var(--panel) 100%)",
                }}
              >
                <Row style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
                  <div>
                    <CardTitle>{draft.name_suggestion}</CardTitle>
                    <Muted>{draft.description_suggestion ?? "No description"}</Muted>
                  </div>
                  <Pill>
                    Page {currentPage} of {totalPages}
                  </Pill>
                </Row>

                <ol style={{ marginTop: 16, paddingLeft: 20, display: "grid", gap: 14 }}>
                  {paginatedSongs.map((song, index) => {
                    const spotifyUrl =
                      typeof song.spotify_url === "string"
                        ? song.spotify_url
                        : typeof song.verified?.spotify_url === "string"
                          ? song.verified.spotify_url
                          : null;

                    return (
                      <li
                        key={`${songLabel(song)}-${pageStart + index}`}
                        style={{
                          lineHeight: 1.45,
                          padding: "14px 0 0",
                          borderTop: index === 0 ? "none" : "1px solid var(--border)",
                        }}
                      >
                        {spotifyUrl ? (
                          <a href={spotifyUrl} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
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
                              background: isVerified(song)
                                ? "rgba(37, 87, 214, 0.08)"
                                : "color-mix(in srgb, var(--panel-soft) 85%, transparent)",
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

                {draft.songs.length > SONGS_PER_PAGE ? (
                  <Row style={{ marginTop: 18, justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <Muted style={{ margin: 0 }}>
                      Showing {pageStart + 1}-{Math.min(pageStart + SONGS_PER_PAGE, draft.songs.length)} of {draft.songs.length} songs
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
            );
          })()
        )}
      </div>
    </Page>
  );
}
