function safeSpotifyUrl(value: unknown, resource: "track" | "playlist"): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "open.spotify.com") return null;
    if (!url.pathname.startsWith(`/${resource}/`)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function safeSpotifyTrackUrl(value: unknown): string | null {
  return safeSpotifyUrl(value, "track");
}

export function safeSpotifyPlaylistUrl(value: unknown): string | null {
  return safeSpotifyUrl(value, "playlist");
}

export function safeSpotifyAuthorizationUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "accounts.spotify.com" ? url.toString() : null;
  } catch {
    return null;
  }
}
