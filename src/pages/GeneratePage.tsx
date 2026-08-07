import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePlaylist, savePlaylist } from "../features/playlists/playlists.api";
import type { PlaylistDraftOut, Song } from "../features/playlists/playlists.types";
import { safeSpotifyTrackUrl } from "../lib/externalUrls";
import {
  Button,
  Card,
  CardTitle,
  Chip,
  Equalizer,
  Eyebrow,
  FieldLabel,
  H1,
  Muted,
  Page,
  PrimaryButton,
  Row,
  Spinner,
  Textarea,
} from "../components/ui";

const EXAMPLE_PROMPTS = [
  "Late-night indie with nostalgic vocals",
  "High-energy gym set, no slow songs",
  "Rainy Sunday jazz and soft keys",
];

function songLabel(song: Song) {
  const artist = (song.artist ?? "Unknown artist").toString();
  const track = (song.track ?? "Unknown track").toString();
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

function TrackRow({ song, index }: { song: Song; index: number }) {
  const spotifyUrl = safeSpotifyTrackUrl(song.spotify_url) ?? safeSpotifyTrackUrl(song.verified?.spotify_url);

  return (
    <div className="track rise" style={{ ["--d" as string]: `${Math.min((index % 15) * 40, 480)}ms` }}>
      <span className="track-idx">{String(index + 1).padStart(2, "0")}</span>
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
      <div className="section-head">
        <div>
          <Eyebrow>Studio</Eyebrow>
          <H1 style={{ marginTop: 12 }}>Generate</H1>
        </div>
        {isGenerating ? (
          <Chip tone="warm">
            <span className="pulse-dot" />
            agents working
          </Chip>
        ) : draft ? (
          <Chip tone="ok">draft ready · {draft.total_songs} songs</Chip>
        ) : (
          <Chip>no draft yet</Chip>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gap: 18,
          alignItems: "start",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        }}
      >
        {/* ---- Console ---- */}
        <div style={{ display: "grid", gap: 14, alignSelf: "start" }}>
          <Card tinted>
            <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
            <Textarea
              id="prompt"
              rows={5}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe the vibe, context, and constraints..."
            />

            <Row style={{ marginTop: 12, gap: 8 }}>
              {EXAMPLE_PROMPTS.map((example) => (
                <Chip
                  key={example}
                  className="chip--action"
                  role="button"
                  tabIndex={0}
                  onClick={() => setPrompt(example)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setPrompt(example);
                  }}
                >
                  {example}
                </Chip>
              ))}
            </Row>

            <div className="hairline" />

            <div style={{ display: "grid", gap: 10 }}>
              <PrimaryButton
                disabled={!prompt || isGenerating || isSaving}
                onClick={onGenerate}
                style={{ width: "100%" }}
              >
                {isGenerating && <Spinner />}
                {isGenerating ? "Generating..." : "Generate playlist"}
              </PrimaryButton>

              <Row style={{ gap: 10 }}>
                <Button
                  disabled={!draft || isGenerating || isSaving}
                  onClick={onSave}
                  style={{ flex: 1 }}
                >
                  {isSaving && <Spinner />}
                  {isSaving ? "Saving..." : "Save to library"}
                </Button>
                <Button
                  className="btn--ghost"
                  disabled={!draft || isGenerating || isSaving}
                  onClick={() => {
                    setDraft(null);
                    setPage(1);
                  }}
                >
                  Clear
                </Button>
              </Row>
            </div>
          </Card>

          <Card>
            <Eyebrow>Signal map</Eyebrow>
            <div style={{ marginTop: 14, display: "grid" }}>
              {[
                ["Mood and intent", "Emotional tone, activity, and situational cues from your prompt."],
                ["Constraint handling", "Genre, language, energy, popularity, and vocal preferences."],
                ["Sequence logic", "Ordering decisions so the set feels like a playlist, not a random list."],
              ].map(([title, body], index) => (
                <div
                  key={title}
                  style={{ padding: "12px 0", borderTop: index === 0 ? "none" : "1px solid var(--border)" }}
                >
                  <strong style={{ fontSize: 14 }}>{title}</strong>
                  <Muted style={{ fontSize: 13.5, lineHeight: 1.6 }}>{body}</Muted>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ---- Results feed ---- */}
        {!draft && !isGenerating && (
          <Card dashed style={{ alignSelf: "stretch", minHeight: 460, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ maxWidth: 380, padding: "30px 8px" }}>
              <Equalizer style={{ opacity: 0.35 }} />
              <CardTitle style={{ marginTop: 18, fontSize: 22 }}>Your draft lands here</CardTitle>
              <Muted style={{ lineHeight: 1.7 }}>
                Write a brief, hit generate, and the agent crew fills this panel with 35–50 sequenced,
                Spotify-verified tracks.
              </Muted>
              <Row style={{ justifyContent: "center", marginTop: 20, gap: 8 }}>
                <Chip>01 write</Chip>
                <Chip>02 generate</Chip>
                <Chip>03 save</Chip>
              </Row>
            </div>
          </Card>
        )}

        {isGenerating && (
          <Card className="scale-in" style={{ alignSelf: "stretch", minHeight: 460, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ maxWidth: 420, padding: "30px 8px" }}>
              <Equalizer style={{ height: 64 }} />
              <CardTitle style={{ marginTop: 20, fontSize: 22 }}>Building your playlist</CardTitle>
              <Muted style={{ lineHeight: 1.7 }}>
                Interpreting your prompt, merging agent candidates, and checking Spotify matches.
              </Muted>
              <div style={{ marginTop: 24, display: "grid", gap: 10, textAlign: "left" }}>
                {[
                  ["Reading the brief", "0s"],
                  ["Collecting candidates", "0.7s"],
                  ["Preparing the draft", "1.4s"],
                ].map(([label, delay]) => (
                  <div key={label} className="working-step mono" style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", animationDelay: delay }}>
                    <span className="pulse-dot" style={{ animationDelay: delay }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {draft && !isGenerating &&
          (() => {
            const totalPages = Math.max(1, Math.ceil(draft.songs.length / SONGS_PER_PAGE));
            const currentPage = Math.min(page, totalPages);
            const pageStart = (currentPage - 1) * SONGS_PER_PAGE;
            const paginatedSongs = draft.songs.slice(pageStart, pageStart + SONGS_PER_PAGE);

            return (
              <Card className="rise" style={{ alignSelf: "start", padding: "clamp(14px, 2.4vw, 22px)" }}>
                <div style={{ padding: "6px 8px 0" }}>
                  <Row style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <Eyebrow>Draft</Eyebrow>
                      <CardTitle style={{ fontSize: "clamp(20px, 3vw, 26px)", marginTop: 10 }}>
                        {draft.name_suggestion}
                      </CardTitle>
                      <Muted style={{ lineHeight: 1.6 }}>{draft.description_suggestion ?? "No description"}</Muted>
                    </div>
                    <Chip>
                      {currentPage} / {totalPages}
                    </Chip>
                  </Row>
                  <div className="hairline" style={{ margin: "16px 0 8px" }} />
                </div>

                <div>
                  {paginatedSongs.map((song, index) => (
                    <TrackRow
                      key={`${songLabel(song)}-${pageStart + index}`}
                      song={song}
                      index={pageStart + index}
                    />
                  ))}
                </div>

                {draft.songs.length > SONGS_PER_PAGE ? (
                  <Row style={{ marginTop: 16, padding: "0 8px", justifyContent: "space-between", gap: 12 }}>
                    <Muted className="mono" style={{ margin: 0, fontSize: 12 }}>
                      {pageStart + 1}–{Math.min(pageStart + SONGS_PER_PAGE, draft.songs.length)} of {draft.songs.length}
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
            );
          })()}
      </div>
    </Page>
  );
}
