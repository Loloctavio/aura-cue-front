import { Link } from "react-router-dom";
import { Button, Card, CardTitle, Divider, H1, Muted, Page, Pill, PrimaryButton, Row, Stack } from "../components/ui";
import { isAuthed } from "../lib/auth";

const AGENTS = [
  {
    name: "Discovery",
    desc: "Scouts fresh tracks that still sit close to your taste profile.",
    signal: "Novelty and adjacency",
    image: "/discovery.png",
    accent: "rgba(37, 87, 214, 0.16)",
  },
  {
    name: "Genre",
    desc: "Keeps the recommendation set anchored to scenes, subgenres, and style references.",
    signal: "Style and scene",
    image: "/genre.png",
    accent: "rgba(236, 111, 69, 0.18)",
  },
  {
    name: "Rhythm",
    desc: "Tunes pacing, groove, and momentum around the activity behind the prompt.",
    signal: "Tempo and energy",
    image: "/rythm.png",
    accent: "rgba(245, 188, 114, 0.2)",
  },
  {
    name: "Language",
    desc: "Filters around language, vocal presence, and lyrical density.",
    signal: "Language and voice",
    image: "/language.png",
    accent: "rgba(37, 87, 214, 0.12)",
  },
  {
    name: "Popularity",
    desc: "Balances recognisable records with overlooked songs that still fit.",
    signal: "Mainstream vs hidden gems",
    image: "/popularity.png",
    accent: "rgba(236, 111, 69, 0.12)",
  },
  {
    name: "Mood",
    desc: "Keeps the emotional tone consistent from the first song to the last.",
    signal: "Emotional fit",
    image: "/mood.png",
    accent: "rgba(122, 162, 255, 0.14)",
  },
  {
    name: "Playlist",
    desc: "Shapes sequence and transitions so the list feels intentionally built.",
    signal: "Pacing and transitions",
    image: "/playlist.png",
    accent: "rgba(245, 188, 114, 0.16)",
  },
] as const;

const WORKFLOW = [
  {
    title: "Interpret the brief",
    body: "Your prompt is parsed for mood, activity, genre, language, energy, and implied pacing.",
  },
  {
    title: "Agents collaborate",
    body: "Each specialist contributes candidates from a different musical angle instead of one generic pass.",
  },
  {
    title: "Rank and verify",
    body: "Matches are deduplicated, prioritised by consensus, and linked back to Spotify when available.",
  },
];

const METADATA = [
  {
    label: "suggested_by",
    desc: "Shows which agents contributed to each track.",
  },
  {
    label: "verified.status",
    desc: "Explains whether a Spotify match was found.",
  },
  {
    label: "verified.confidence",
    desc: "Reports how strong the track match appears to be.",
  },
  {
    label: "verified.spotify_url",
    desc: "Provides a direct Spotify link when the song is matched.",
  },
];

export function LandingPage() {
  const authed = isAuthed();

  return (
    <Page>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid var(--border)",
          borderRadius: "calc(var(--radius) + 10px)",
          padding: "clamp(22px, 5vw, 40px)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--panel-strong) 86%, rgba(236, 111, 69, 0.08)) 0%, color-mix(in srgb, var(--panel-strong) 90%, rgba(37, 87, 214, 0.08)) 58%, color-mix(in srgb, var(--panel-strong) 88%, rgba(245, 188, 114, 0.08)) 100%)",
          boxShadow: "var(--shadow-strong)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "auto -10% -22% auto",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37, 87, 214, 0.14) 0%, transparent 66%)",
          }}
        />

        <div
          style={{
            display: "grid",
            gap: 24,
            alignItems: "center",
            justifyItems: "center",
            gridTemplateColumns: "minmax(0, 1fr)",
          }}
        >
          <Stack style={{ gap: 18, justifyItems: "center", textAlign: "center", width: "100%" }}>
            <Row style={{ justifyContent: "center" }}>
              <Pill>Collaborative playlist system</Pill>
              <Pill>Spotify-linked metadata</Pill>
            </Row>

            <img
              src="/logo.png"
              alt="AuraCue logo"
              style={{
                width: "clamp(170px, 24vw, 250px)",
                height: "auto",
                display: "block",
                margin: "0 auto",
                filter: "drop-shadow(0 18px 28px rgba(21, 27, 42, 0.16))",
              }}
            />

            <div style={{ maxWidth: 760, marginInline: "auto" }}>
              <H1>Prompt the vibe. Let the agent crew build the playlist.</H1>
              <Muted style={{ fontSize: "clamp(17px, 2.3vw, 21px)", lineHeight: 1.65, marginTop: 16 }}>
                AuraCue turns a short mood brief into a complete playlist using specialized agents for discovery,
                genre, rhythm, language, popularity, mood, and sequencing.
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
                    <PrimaryButton>Start Building</PrimaryButton>
                  </Link>
                  <Link to="/login">
                    <Button>Log In</Button>
                  </Link>
                </>
              )}
            </Row>

            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                maxWidth: 760,
                width: "100%",
              }}
            >
              <Card style={{ padding: 16, background: "color-mix(in srgb, var(--panel) 92%, transparent)" }}>
                <CardTitle style={{ fontSize: 28 }}>7</CardTitle>
                <Muted style={{ marginTop: 6 }}>Specialized agents collaborating on every brief.</Muted>
              </Card>
              <Card style={{ padding: 16, background: "color-mix(in srgb, var(--panel) 92%, transparent)" }}>
                <CardTitle style={{ fontSize: 28 }}>35-50</CardTitle>
                <Muted style={{ marginTop: 6 }}>Songs per generated draft with verification metadata.</Muted>
              </Card>
              <Card style={{ padding: 16, background: "color-mix(in srgb, var(--panel) 92%, transparent)" }}>
                <CardTitle style={{ fontSize: 28 }}>100%</CardTitle>
                <Muted style={{ marginTop: 6 }}>Preserved functionality for generation, saving, and export.</Muted>
              </Card>
            </div>
          </Stack>
        </div>
      </section>

      <section
        style={{
          marginTop: 20,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        }}
      >
        {WORKFLOW.map((step, index) => (
          <Card key={step.title}>
            <Pill style={{ width: "fit-content", marginBottom: 14 }}>0{index + 1}</Pill>
            <CardTitle>{step.title}</CardTitle>
            <Muted style={{ lineHeight: 1.65 }}>{step.body}</Muted>
          </Card>
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <Card style={{ padding: "clamp(18px, 4vw, 28px)" }}>
          <Row style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
            <div>
              <CardTitle style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>Meet the agent team</CardTitle>
              <Muted style={{ maxWidth: 620, lineHeight: 1.65 }}>
                One team, seven roles. Each image now maps directly to a specialist agent so the system is easy to
                understand without repeating the same explanation across the page.
              </Muted>
            </div>
            <Pill>7 visual identities</Pill>
          </Row>

          <Divider />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 16,
            }}
          >
            {AGENTS.map((agent) => (
              <Card
                key={agent.name}
                style={{
                  width: "min(100%, 310px)",
                  flex: "0 1 310px",
                  padding: 14,
                  background: `linear-gradient(180deg, ${agent.accent} 0%, color-mix(in srgb, var(--panel-strong) 94%, transparent) 100%)`,
                }}
              >
                <img
                  src={agent.image}
                  alt={`${agent.name} agent artwork`}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    borderRadius: 22,
                    border: "1px solid var(--border)",
                    marginBottom: 14,
                  }}
                />
                <Row style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <CardTitle>{agent.name}</CardTitle>
                  <Pill style={{ minHeight: 30 }}>{agent.signal}</Pill>
                </Row>
                <Muted style={{ marginTop: 10, lineHeight: 1.65 }}>{agent.desc}</Muted>
              </Card>
            ))}
          </div>
        </Card>
      </section>

      <section
        style={{
          marginTop: 20,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        }}
      >
        <Card>
          <CardTitle>Metadata transparency</CardTitle>
          <Divider />
          <Stack>
            {METADATA.map((item) => (
              <div key={item.label}>
                <b>{item.label}</b>
                <Muted>{item.desc}</Muted>
              </div>
            ))}
          </Stack>
        </Card>

        <Card
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--panel-strong) 84%, rgba(37, 87, 214, 0.08)) 0%, color-mix(in srgb, var(--panel-strong) 86%, rgba(236, 111, 69, 0.08)) 100%)",
          }}
        >
          <CardTitle>Spotify notice</CardTitle>
          <Divider />
          <Muted style={{ lineHeight: 1.7 }}>
            Spotify is a trademark of Spotify AB. AuraCue uses Spotify matching and export capabilities, but it is not
            affiliated with or endorsed by Spotify.
          </Muted>
          <Muted style={{ lineHeight: 1.7 }}>
            <Link to="/privacy">Read the Privacy Policy</Link>
            {" · "}
            <Link to="/terms">Read the Terms of Service</Link>
          </Muted>
        </Card>
      </section>
    </Page>
  );
}
