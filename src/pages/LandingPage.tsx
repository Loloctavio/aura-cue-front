import { Link } from "react-router-dom";
import { Button, Chip, Eyebrow, Muted, Page, PrimaryButton, Row } from "../components/ui";
import { isAuthed } from "../lib/auth";

const AGENTS = [
  {
    name: "Discovery",
    desc: "Scouts fresh tracks that still sit close to your taste profile.",
    signal: "Novelty and adjacency",
    image: "/discovery.png",
  },
  {
    name: "Genre",
    desc: "Keeps the recommendation set anchored to scenes, subgenres, and style references.",
    signal: "Style and scene",
    image: "/genre.png",
  },
  {
    name: "Rhythm",
    desc: "Tunes pacing, groove, and momentum around the activity behind the prompt.",
    signal: "Tempo and energy",
    image: "/rythm.png",
  },
  {
    name: "Language",
    desc: "Filters around language, vocal presence, and lyrical density.",
    signal: "Language and voice",
    image: "/language.png",
  },
  {
    name: "Popularity",
    desc: "Balances recognisable records with overlooked songs that still fit.",
    signal: "Mainstream vs hidden gems",
    image: "/popularity.png",
  },
  {
    name: "Mood",
    desc: "Keeps the emotional tone consistent from the first song to the last.",
    signal: "Emotional fit",
    image: "/mood.png",
  },
  {
    name: "Playlist",
    desc: "Shapes sequence and transitions so the list feels intentionally built.",
    signal: "Pacing and transitions",
    image: "/playlist.png",
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
  { label: "suggested_by", desc: "Shows which agents contributed to each track." },
  { label: "verified.status", desc: "Explains whether a Spotify match was found." },
  { label: "verified.confidence", desc: "Reports how strong the track match appears to be." },
  { label: "verified.spotify_url", desc: "Provides a direct Spotify link when the song is matched." },
];

export function LandingPage() {
  const authed = isAuthed();

  return (
    <>
      {/* Floating minimal header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          borderBottom: "1px solid var(--border)",
          background: "color-mix(in srgb, var(--bg) 82%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div
          style={{
            width: "min(1160px, 100%)",
            margin: "0 auto",
            padding: "14px clamp(16px, 4vw, 32px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: "var(--text)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: "-0.03em",
            }}
          >
            <img src="/icon.png" alt="" style={{ width: 28, height: 28, borderRadius: 8, objectFit: "cover" }} />
            AuraCue
          </Link>

          <Row style={{ gap: 8 }}>
            {authed ? (
              <Link to="/dashboard">
                <PrimaryButton className="btn--sm">Open studio</PrimaryButton>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button className="btn--ghost btn--sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <PrimaryButton className="btn--sm">Start building</PrimaryButton>
                </Link>
              </>
            )}
          </Row>
        </div>
      </header>

      <Page>
        {/* ---- Hero: text left, art right ---- */}
        <section
          style={{
            display: "grid",
            gap: "clamp(28px, 5vw, 56px)",
            alignItems: "center",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            padding: "clamp(24px, 5vw, 64px) 0",
          }}
        >
          <div>
            <Eyebrow className="rise">AI playlist studio</Eyebrow>
            <h1
              className="display rise"
              style={{
                fontSize: "clamp(2.6rem, 6.5vw, 4.6rem)",
                margin: "18px 0 0",
                ["--d" as string]: "80ms",
              }}
            >
              Prompt the vibe.
              <br />
              <span className="grad-text">Seven agents</span>
              <br />
              build the playlist.
            </h1>
            <Muted
              className="rise"
              style={{
                fontSize: "clamp(16px, 2vw, 19px)",
                lineHeight: 1.7,
                maxWidth: 520,
                marginTop: 20,
                ["--d" as string]: "160ms",
              }}
            >
              AuraCue turns a short mood brief into a complete playlist using specialized agents for
              discovery, genre, rhythm, language, popularity, mood, and sequencing.
            </Muted>

            <Row className="rise" style={{ marginTop: 28, gap: 12, ["--d" as string]: "240ms" }}>
              {authed ? (
                <Link to="/dashboard">
                  <PrimaryButton>Open studio →</PrimaryButton>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <PrimaryButton>Start building →</PrimaryButton>
                  </Link>
                  <Link to="/login">
                    <Button className="btn--ghost">Log in</Button>
                  </Link>
                </>
              )}
            </Row>

            {/* Inline hairline stats instead of stat cards */}
            <div
              className="rise"
              style={{
                display: "flex",
                gap: "clamp(18px, 3vw, 36px)",
                marginTop: 40,
                paddingTop: 22,
                borderTop: "1px solid var(--border)",
                flexWrap: "wrap",
                ["--d" as string]: "320ms",
              }}
            >
              {[
                ["07", "specialist agents"],
                ["35–50", "songs per draft"],
                ["1 click", "Spotify export"],
              ].map(([num, label]) => (
                <div key={label}>
                  <div className="display" style={{ fontSize: 26 }}>{num}</div>
                  <div className="mono" style={{ color: "var(--muted)", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-art scale-in" style={{ ["--d" as string]: "180ms" }}>
            <div className="hero-art-frame">
              <img src="/logo.png" alt="AuraCue logo" />
            </div>
            <img src="/mood.png" alt="" aria-hidden="true" className="orbit" style={{ top: "4%", left: "8%", animationDelay: "-1s" }} />
            <img src="/rythm.png" alt="" aria-hidden="true" className="orbit" style={{ top: "18%", right: "2%", animationDelay: "-3s" }} />
            <img src="/discovery.png" alt="" aria-hidden="true" className="orbit" style={{ bottom: "10%", left: "2%", animationDelay: "-2s" }} />
            <img src="/genre.png" alt="" aria-hidden="true" className="orbit" style={{ bottom: "0%", right: "12%", animationDelay: "-4.5s" }} />
          </div>
        </section>

        {/* ---- Workflow: numbered horizontal steps ---- */}
        <section style={{ marginTop: "clamp(30px, 6vw, 70px)" }}>
          <div className="section-head">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="display" style={{ fontSize: "clamp(24px, 3.4vw, 34px)", marginTop: 12 }}>
                From one sentence to a full set
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "clamp(16px, 3vw, 28px)",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            }}
          >
            {WORKFLOW.map((step, index) => (
              <div key={step.title} className="rise" style={{ ["--d" as string]: `${index * 90}ms` }}>
                <div className="ghost-num">0{index + 1}</div>
                <h3 style={{ margin: "14px 0 0", fontSize: 19 }}>{step.title}</h3>
                <Muted style={{ lineHeight: 1.7 }}>{step.body}</Muted>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Agent team: bento grid ---- */}
        <section style={{ marginTop: "clamp(40px, 7vw, 90px)" }}>
          <div className="section-head">
            <div>
              <Eyebrow>The crew</Eyebrow>
              <h2 className="display" style={{ fontSize: "clamp(24px, 3.4vw, 34px)", marginTop: 12 }}>
                Meet the agent team
              </h2>
            </div>
            <Chip>7 specialists</Chip>
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
              gridAutoRows: "auto",
            }}
          >
            {AGENTS.map((agent, index) => (
              <article
                key={agent.name}
                className={index === 0 ? "agent-tile agent-tile--feature rise" : "agent-tile rise"}
                style={{ ["--d" as string]: `${index * 60}ms` }}
              >
                <img src={agent.image} alt={`${agent.name} agent artwork`} />
                <div>
                  <Row style={{ justifyContent: "space-between", gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: index === 0 ? 24 : 17 }}>{agent.name}</h3>
                    <Chip tone="warm">{agent.signal}</Chip>
                  </Row>
                  <Muted style={{ lineHeight: 1.65, fontSize: 14 }}>{agent.desc}</Muted>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---- Metadata + notice footer band ---- */}
        <section
          style={{
            marginTop: "clamp(40px, 7vw, 90px)",
            paddingTop: 28,
            borderTop: "1px solid var(--border)",
            display: "grid",
            gap: "clamp(24px, 4vw, 48px)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          }}
        >
          <div>
            <Eyebrow>Transparency</Eyebrow>
            <h2 className="display" style={{ fontSize: 24, marginTop: 12 }}>
              Every track explains itself
            </h2>
            <div style={{ marginTop: 18, display: "grid", gap: 0 }}>
              {METADATA.map((item, index) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    padding: "12px 0",
                    borderTop: index === 0 ? "none" : "1px solid var(--border)",
                  }}
                >
                  <code style={{ flex: "0 0 auto" }}>{item.label}</code>
                  <Muted style={{ margin: 0, flex: "1 1 200px" }}>{item.desc}</Muted>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Eyebrow>Spotify notice</Eyebrow>
            <Muted style={{ lineHeight: 1.75, marginTop: 14 }}>
              Spotify is a trademark of Spotify AB. AuraCue uses Spotify matching and export
              capabilities, but it is not affiliated with or endorsed by Spotify.
            </Muted>
            <Row style={{ marginTop: 18, gap: 16 }}>
              <Link to="/privacy" style={{ fontWeight: 600, fontSize: 14 }}>Privacy Policy</Link>
              <Link to="/terms" style={{ fontWeight: 600, fontSize: 14 }}>Terms of Service</Link>
            </Row>
            <Muted className="mono" style={{ marginTop: 26, fontSize: 12 }}>
              © {new Date().getFullYear()} AuraCue
            </Muted>
          </div>
        </section>
      </Page>
    </>
  );
}
