import { Card, CardTitle, Divider, Muted, Page, Stack } from "../components/ui";

export function PrivacyPage() {
  return (
    <Page>
      <Card>
        <CardTitle>Privacy Policy</CardTitle>
        <Divider />
        <Stack>
          <Muted>
            SayPlay uses Spotify APIs to verify tracks and optionally create playlists in your Spotify account after you
            grant consent.
          </Muted>
          <Muted>
            We do not ask for your Spotify password. Spotify authorization is handled through Spotify OAuth screens.
          </Muted>
          <Muted>
            If you disconnect Spotify, the app removes stored Spotify connection tokens from your account record.
          </Muted>
          <Muted>
            Spotify content in SayPlay is displayed with links back to Spotify and is not offered as downloadable audio.
          </Muted>
        </Stack>
      </Card>
    </Page>
  );
}
