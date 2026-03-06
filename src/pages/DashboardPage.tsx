import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listMyPlaylists } from "../features/playlists/playlists.api";
import { Card, CardTitle, H1, Muted, Page, Pill, Row, Stack, Button } from "../components/ui";

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["playlists", "me"],
    queryFn: () => listMyPlaylists({ limit: 50, skip: 0 }),
  });

  const playlists = data ?? [];

  return (
    <Page>
      <Row style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 14 }}>
        <div style={{ flex: 1, minWidth: "min(100%, 230px)" }}>
          <H1>My Playlists</H1>
          <Muted style={{ fontSize: "clamp(15px, 3.8vw, 18px)" }}>Your saved playlists in one place.</Muted>
        </div>

        <Link to="/generate">
          <Button>+ Generate</Button>
        </Link>
      </Row>

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
          <Card>
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
          <div style={{ display: "grid", gap: 14, marginTop: 4 }}>
            {playlists.map((p) => (
              <Link key={p.id} to={`/playlists/${p.id}`} style={{ color: "inherit" }}>
                <Card style={{ padding: 18 }}>
                  <Row style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <CardTitle style={{ fontSize: "clamp(24px, 6vw, 32px)" }}>{p.name ?? "Untitled"}</CardTitle>
                      <Muted style={{ marginTop: 4 }}>{p.description ?? "No description"}</Muted>
                      <Muted style={{ marginTop: 10 }}>
                        Updated: {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "-"}
                      </Muted>
                    </div>
                    <Pill style={{ minWidth: 94, justifyContent: "center" }}>{p.total_songs} songs</Pill>
                  </Row>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
