import { Link } from "react-router-dom";
import { Button, Card, CardTitle, Divider, Muted, Page, Pill, PrimaryButton, Row, Stack } from "../components/ui";
import { isAuthed } from "../lib/auth";

const AGENTS: Array<{ name: string; desc: string; signal: string }> = [
  {
    name: "Discovery",
    desc: "Finds fresh songs close to your taste.",
    signal: "Novelty and adjacency",
  },
  {
    name: "Genre",
    desc: "Anchors recommendations to genre and subgenre intent.",
    signal: "Style and scene",
  },
  {
    name: "Rhythm",
    desc: "Matches tempo and groove to your activity.",
    signal: "Tempo and energy",
  },
  {
    name: "Language",
    desc: "Respects language constraints and vocal density.",
    signal: "Language and voice",
  },
  {
    name: "Popularity",
    desc: "Balances hits, mid-tier, and deep cuts.",
    signal: "Mainstream vs hidden gems",
  },
  {
    name: "Mood",
    desc: "Aligns the playlist with emotional intention.",
    signal: "Emotional fit",
  },
  {
    name: "Playlist",
    desc: "Shapes flow from warm-up to cooldown.",
    signal: "Pacing and transitions",
  },
];

export function LandingPage() {
  const authed = isAuthed();

  return (
    <Page>
      <div
        style={{
          padding: "clamp(20px, 5vw, 40px)",
          borderRadius: "calc(var(--radius) + 10px)",
          border: "1px solid var(--border)",
          background:
            "linear-gradient(130deg, color-mix(in srgb, var(--panel) 78%, #c9733a 22%) 0%, var(--panel) 45%, color-mix(in srgb, var(--panel) 80%, #3a7bc9 20%) 100%)",
          boxShadow: "var(--shadow)",
        }}
      >
        <Stack style={{ alignItems: "center", justifyItems: "center", gap: 14 }}>
          <Row style={{ justifyContent: "center", width: "100%" }}>
            <Pill>AI Collaborative Playlist Builder</Pill>
            <Pill>Verified songs by Spotify</Pill>
          </Row>

          <img
            src="/logo.png"
            alt="AuraCue logo"
            style={{
              width: "clamp(190px, 30vw, 290px)",
              height: "auto",
              display: "block",
              filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.18))",
            }}
          />

          <div style={{ width: "min(820px, 100%)", textAlign: "center" }}>
            <Muted style={{ fontSize: "clamp(20px, 3.4vw, 28px)", marginTop: 0, lineHeight: 1.34 }}>
              Describe a vibe. A team of music agents builds, verifies, and refines your playlist with transparent
              song-level metadata.
            </Muted>
          </div>

          <Row style={{ justifyContent: "center" }}>
            {authed ? (
              <Link to="/dashboard">
                <PrimaryButton>Open Dashboard</PrimaryButton>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <PrimaryButton>Get Started</PrimaryButton>
                </Link>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              </>
            )}
          </Row>
          <Muted style={{ marginTop: 0, textAlign: "center" }}>
            Spotify is a trademark of Spotify AB. This app is not affiliated with or endorsed by Spotify.
            {" "}
            <Link to="/privacy">Privacy Policy</Link>
          </Muted>
        </Stack>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: 14,
        }}
      >
        <Card>
          <CardTitle>How It Works</CardTitle>
          <Divider />
          <Stack>
            <div>
              <b>1) Prompt as brief</b>
              <Muted>Mood, activity, genre, language and energy are inferred from your request.</Muted>
            </div>
            <div>
              <b>2) Multi-agent generation</b>
              <Muted>Specialized agents propose songs in parallel from different angles.</Muted>
            </div>
            <div>
              <b>3) Merge and rank</b>
              <Muted>Recommendations are deduplicated and prioritized by consensus.</Muted>
            </div>
            <div>
              <b>4) Spotify verification</b>
              <Muted>Each song includes verification metadata and links when available.</Muted>
            </div>
          </Stack>
        </Card>

        <Card>
          <CardTitle>Metadata Transparency</CardTitle>
          <Divider />
          <Stack>
            <div>
              <b>`suggested_by`</b>
              <Muted>Shows which agents proposed each song.</Muted>
            </div>
            <div>
              <b>`verified.status`</b>
              <Muted>Shows whether a Spotify match was found.</Muted>
            </div>
            <div>
              <b>`verified.confidence`</b>
              <Muted>Confidence level for track matching quality.</Muted>
            </div>
            <div>
              <b>`verified.spotify_url`</b>
              <Muted>Direct Spotify link when matched.</Muted>
            </div>
          </Stack>
        </Card>
      </div>

      <div style={{ marginTop: 14 }}>
        <Card>
          <CardTitle>Agent Team</CardTitle>
          <Divider />
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" }}>
            {AGENTS.map((agent) => (
              <div key={agent.name}>
                <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <b>{agent.name}</b>
                  <Pill>{agent.signal}</Pill>
                </Row>
                <Muted>{agent.desc}</Muted>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}
