import { Colors } from "@/types/player";
import { Json } from "@/integrations/supabase/types";

export const convertJsonToColors = (json: Json): Colors => {
  if (typeof json === 'object' && json !== null) {
    return {
      text: String(json.text || '#000000'),
      primary: String(json.primary || '#9b87f5'),
      secondary: String(json.secondary || '#7E69AB'),
      background: String(json.background || '#ffffff'),
    };
  }
  return {
    text: '#000000',
    primary: '#9b87f5',
    secondary: '#7E69AB',
    background: '#ffffff',
  };
};