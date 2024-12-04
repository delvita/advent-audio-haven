import { Colors } from "@/types/player";
import { Json } from "@/integrations/supabase/types";

export const convertJsonToColors = (json: Json): Colors => {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    const jsonObject = json as Record<string, Json>;
    return {
      text: String(jsonObject.text || '#000000'),
      primary: String(jsonObject.primary || '#9b87f5'),
      secondary: String(jsonObject.secondary || '#7E69AB'),
      background: String(jsonObject.background || '#ffffff'),
    };
  }
  return {
    text: '#000000',
    primary: '#9b87f5',
    secondary: '#7E69AB',
    background: '#ffffff',
  };
};