import { api } from "../../lib/api";
import type { ChangePasswordPayload, UserOut, UserUpdate } from "./users.types";

export async function me(): Promise<UserOut> {
  const { data } = await api.get<UserOut>("/users/me");
  return data;
}

export async function updateMe(payload: UserUpdate): Promise<UserOut> {
  const { data } = await api.put<UserOut>("/users/me", payload);
  return data;
}

export async function deleteMe(): Promise<{ deleted: boolean }> {
  const { data } = await api.delete<{ deleted: boolean }>("/users/me");
  return data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<{ changed: boolean }> {
  const { data } = await api.put<{ changed: boolean }>("/users/me/password", payload);
  return data;
}

export async function getUser(userId: string): Promise<UserOut> {
  const { data } = await api.get<UserOut>(`/users/${userId}`);
  return data;
}

type SpotifyConnectResponse = {
  authorization_url: string;
};

export async function getSpotifyConnectUrl(redirectTo = "/dashboard"): Promise<string> {
  const { data } = await api.get<SpotifyConnectResponse>("/spotify/connect", {
    params: { redirect_to: redirectTo },
  });
  return data.authorization_url;
}

export async function disconnectSpotify(): Promise<{ disconnected: boolean }> {
  const { data } = await api.delete<{ disconnected: boolean }>("/spotify/disconnect");
  return data;
}
