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

const DEFAULT_FEED = "https://wirfamilien.ch/tag/advent/feed";
const CORS_PROXY = "https://mf1.ch/crosproxy/?";

export const defaultSettings: Partial<PlayerSettings> = {
  name: "",
  feed_url: DEFAULT_FEED,
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

export const getProxiedUrl = (url: string): string => {
  // Check if the URL is already using our CORS proxy
  if (url.startsWith(CORS_PROXY)) {
    return url;
  }
  
  // Check if this is our default feed or if we need to add the proxy
  return url === DEFAULT_FEED ? CORS_PROXY + url : url;
};