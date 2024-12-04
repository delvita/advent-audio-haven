import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Colors {
  text: string;
  primary: string;
  secondary: string;
  background: string;
}

interface PlayerSettings {
  id: string;
  name: string;
  feed_url: string;
  colors: Colors;
  list_height: string;
  sort_ascending: boolean;
  show_first_post: boolean;
  player_type: string;
}

const defaultSettings: Partial<PlayerSettings> = {
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

const Customize = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Partial<PlayerSettings>>(defaultSettings);

  const { data: existingSettings, isLoading } = useQuery({
    queryKey: ["playerSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as unknown as PlayerSettings;
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
        })
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
    onError: (error) => {
      toast({
        title: "Fehler beim Speichern",
        description: "Ihre Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(settings);
  };

  if (isLoading) {
    return <div>Lädt...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Player Anpassungen</h1>
      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
                placeholder="Mein Podcast Player"
              />
            </div>

            <div>
              <Label htmlFor="feed_url">Feed URL</Label>
              <Input
                id="feed_url"
                value={settings.feed_url}
                onChange={(e) =>
                  setSettings({ ...settings, feed_url: e.target.value })
                }
                placeholder="https://example.com/feed.xml"
              />
            </div>

            <div>
              <Label htmlFor="player_type">Player Größe</Label>
              <Select
                value={settings.player_type}
                onValueChange={(value) =>
                  setSettings({ ...settings, player_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wähle eine Größe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Klein</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="big">Groß</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="list_height">Listenhöhe (px)</Label>
              <Input
                id="list_height"
                type="number"
                value={settings.list_height}
                onChange={(e) =>
                  setSettings({ ...settings, list_height: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sort_ascending">Aufsteigend sortieren</Label>
              <Switch
                id="sort_ascending"
                checked={settings.sort_ascending}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, sort_ascending: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show_first_post">Ersten Beitrag anzeigen</Label>
              <Switch
                id="show_first_post"
                checked={settings.show_first_post}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, show_first_post: checked })
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Einstellungen speichern
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Customize;