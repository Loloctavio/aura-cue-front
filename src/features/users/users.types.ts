export type SpotifyInfo = {
  spotify_user_id?: string | null;
  expires_at?: string | null;
  connected_at?: string | null;
};

export type UserOut = {
  id: string;
  username: string;
  gmail: string;
  profile_photo?: string | null;
  playlists?: string[];
  spotify_connected?: boolean;
  spotify?: SpotifyInfo | null;
  created_at: string;
  updated_at: string;
};

export type UserUpdate = {
  username?: string | null;
  profile_photo?: string | null;
};

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
};
