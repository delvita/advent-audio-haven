import { Json } from "@/integrations/supabase/types";

export interface Colors {
  text: string;
  primary: string;
  secondary: string;
  background: string;
}

export interface PlayerSettings {
  id: string;
  name: string;
  feed_url: string;
  colors: Colors;
  list_height: string;
  sort_ascending: boolean;
  show_first_post: boolean;
  player_type: string;
}

export interface PlayerSettingsDB {
  id: string;
  name: string;
  feed_url: string;
  colors: Json;
  list_height: string;
  sort_ascending: boolean;
  show_first_post: boolean;
  player_type: string;
  created_at?: string;
  updated_at?: string;
}

export const defaultSettings: Partial<PlayerSettings> = {
  name: "",
  feed_url: "",
  colors: {
    text: "#000000",
    primary: "#9b87f5",
    secondary: "#7E69AB",
    background: "#ffffff",
  },
  list_height: "600",
  sort_ascending: false,
  show_first_post: false,
  player_type: "medium",
};