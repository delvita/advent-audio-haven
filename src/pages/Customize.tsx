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
import { PlayerSettings, defaultSettings } from "@/types/player";
import { usePlayerSettings } from "@/hooks/usePlayerSettings";

const Customize = () => {
  const [settings, setSettings] = useState<Partial<PlayerSettings>>(defaultSettings);
  const { mutation, isLoading } = usePlayerSettings();

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