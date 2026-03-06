import { Card, CardTitle, H1, Muted, Page, Row, Pill, Stack, Divider } from "../components/ui";

const AGENTS: Array<{ name: string; desc: string; signal: string }> = [
  {
    name: "Discovery",
    desc: "Explora propuestas frescas y nuevas, manteniendo coherencia con el prompt.",
    signal: "Novedad controlada · similares · descubrimiento",
  },
  {
    name: "Genre",
    desc: "Ancla las recomendaciones a géneros o micro-géneros inferidos del prompt.",
    signal: "Género · micro-género · escena",
  },
  {
    name: "Rhythm",
    desc: "Prioriza tempo y energía (upbeat, steady, downtempo) según la actividad.",
    signal: "Tempo · groove · energía",
  },
  {
    name: "Language",
    desc: "Respeta idioma y densidad vocal. Si aplica, sugiere mezclas bilingües con intención.",
    signal: "Idioma · vocal/instrumental · mezcla",
  },
  {
    name: "Popularity",
    desc: "Balancea popularidad: mainstream / mid / deep cuts, según lo que pidas.",
    signal: "Mainstream · mid · deep cuts",
  },
  {
    name: "Mood",
    desc: "Alinea el playlist al mood: enfoque, nostalgia, euforia, calma, etc.",
    signal: "Mood · energía emocional · contexto",
  },
  {
    name: "Playlist",
    desc: "Diseña el pacing: warm-up → core → cooldown, y cuida transiciones.",
    signal: "Estructura · progresión · cohesión",
  },
];

export function AboutPage() {
  return (
    <Page>
      <Row>
        <div style={{ flex: 1 }}>
          <H1>How it works</H1>
          <Muted>
            SayPlay usa un <b>equipo de agentes</b> para proponer canciones desde ángulos distintos.
            Cada canción regresa con metadata para que puedas entender <i>por qué</i> apareció:
            <code> suggested_by</code> (qué agentes la propusieron) y <code>verified</code> (estado de verificación).
          </Muted>
        </div>
        <Pill>Multi-agent selection</Pill>
      </Row>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: 14,
        }}
      >
        <Card>
          <CardTitle>Collaboration flow</CardTitle>
          <Divider />

          <Stack>
            <div>
              <b>1) Prompt → brief compartido</b>
              <Muted>
                Tu prompt se interpreta como un brief: mood, actividad, tempo, idioma, género y nivel de popularidad.
              </Muted>
            </div>

            <div>
              <b>2) Propuestas en paralelo (equipo de agentes)</b>
              <Muted>
                Cada agente propone canciones con su especialidad. Ej: <b>Mood</b> cuida la intención emocional,
                <b>Rhythm</b> cuida el tempo, <b>Genre</b> cuida el marco de estilo, etc.
              </Muted>
            </div>

            <div>
              <b>3) Merge + diversidad</b>
              <Muted>
                Se combinan propuestas en una sola lista (35–50). Si una canción aparece recomendada por varios agentes,
                normalmente sube de prioridad. Se cuida variedad y se evitan duplicados.
              </Muted>
            </div>

            <div>
              <b>4) Verificación</b>
              <Muted>
                El backend intenta “validar” cada track (ej. para Spotify) y agrega info en <code>verified</code>:
                <code> status</code>, <code>confidence</code>, <code>spotify_url</code>, <code>preview_url</code>, etc.
              </Muted>
            </div>

            <div>
              <b>5) Transparencia por canción</b>
              <Muted>
                En tu UI puedes mostrar: <code>suggested_by</code> (quién la propuso) +{" "}
                <code>verified.status</code> (si se encontró / no se encontró / etc.).
              </Muted>
            </div>
          </Stack>
        </Card>

        <Card>
          <CardTitle>Agents involved</CardTitle>
          <Divider />

          <Stack>
            {AGENTS.map((a) => (
              <div key={a.name}>
                <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <b>{a.name}</b>
                  <Pill>{a.name}</Pill>
                </Row>
                <Muted>{a.desc}</Muted>
                <Muted style={{ marginTop: 6 }}>
                  <span style={{ opacity: 0.85 }}>Signals:</span> {a.signal}
                </Muted>
              </div>
            ))}
          </Stack>
        </Card>
      </div>

      <div style={{ marginTop: 14 }}>
        <Card>
          <CardTitle>How to read song metadata</CardTitle>
          <Divider />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 14 }}>
            <div>
              <b>suggested_by</b>
              <Muted>
                Lista de agentes que propusieron esa canción. Si ves varios (ej. <b>Mood</b> + <b>Rhythm</b>),
                suele significar que la canción encaja por múltiples razones.
              </Muted>
            </div>

            <div>
              <b>verified.status</b>
              <Muted>
                Estado de verificación (ej. <code>found</code> / <code>not_found</code> / otros). Útil para saber si
                ya tiene match confiable.
              </Muted>
            </div>

            <div>
              <b>verified.confidence</b>
              <Muted>
                Qué tan seguro fue el match. Si es alto, normalmente el track/artist coincidió bien con lo esperado.
              </Muted>
            </div>
          </div>

          <Divider />

          <Muted>
            Bonus: también puedes mostrar <code>genres</code>, <code>reason</code>, y links como{" "}
            <code>verified.spotify_url</code> / <code>verified.preview_url</code> cuando existan.
          </Muted>
        </Card>
      </div>
    </Page>
  );
}
