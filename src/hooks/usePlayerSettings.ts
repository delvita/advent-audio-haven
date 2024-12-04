import { supabase } from "@/integrations/supabase/client";
import { PlayerSettings, PlayerSettingsDB, defaultSettings } from "@/types/player";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const usePlayerSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingSettings, isLoading } = useQuery({
    queryKey: ["playerSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as PlayerSettingsDB;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newSettings: Partial<PlayerSettings>) => {
      const { data, error } = await supabase
        .from("player_settings")
        .upsert({
          id: existingSettings?.id || "default",
          name: newSettings.name || "",
          feed_url: newSettings.feed_url || "",
          colors: newSettings.colors || defaultSettings.colors,
          list_height: newSettings.list_height || defaultSettings.list_height,
          sort_ascending: newSettings.sort_ascending ?? defaultSettings.sort_ascending,
          show_first_post: newSettings.show_first_post ?? defaultSettings.show_first_post,
          player_type: newSettings.player_type || defaultSettings.player_type,
        } as PlayerSettingsDB)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerSettings"] });
      toast({
        title: "Einstellungen gespeichert",
        description: "Ihre Änderungen wurden erfolgreich gespeichert.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler beim Speichern",
        description: "Ihre Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    },
  });

  return {
    existingSettings,
    isLoading,
    mutation,
  };
};