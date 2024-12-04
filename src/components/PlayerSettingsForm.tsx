import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PlayerSettings, defaultSettings } from "@/types/player";

interface PlayerSettingsFormProps {
  initialSettings?: Partial<PlayerSettings>;
  onSubmit: (settings: Partial<PlayerSettings>) => void;
  onChange?: (settings: Partial<PlayerSettings>) => void;
}

export const PlayerSettingsForm = ({ 
  initialSettings, 
  onSubmit,
  onChange 
}: PlayerSettingsFormProps) => {
  const [settings, setSettings] = useState<Partial<PlayerSettings>>(defaultSettings);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const updateSettings = (newSettings: Partial<PlayerSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    onChange?.(updatedSettings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settings);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="player_name">Name</Label>
            <Input
              id="player_name"
              name="player_name"
              value={settings.name}
              onChange={(e) =>
                updateSettings({ name: e.target.value })
              }
              placeholder="Mein Podcast Player"
              autoComplete="off"
            />
          </div>

          <div>
            <Label htmlFor="feed_url">Feed URL</Label>
            <Input
              id="feed_url"
              name="feed_url"
              value={settings.feed_url}
              onChange={(e) =>
                updateSettings({ feed_url: e.target.value })
              }
              placeholder="https://example.com/feed.xml"
              autoComplete="url"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sort_ascending">Aufsteigend sortieren</Label>
            <Switch
              id="sort_ascending"
              name="sort_ascending"
              checked={settings.sort_ascending}
              onCheckedChange={(checked) =>
                updateSettings({ sort_ascending: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show_first_post">Ersten Beitrag anzeigen</Label>
            <Switch
              id="show_first_post"
              name="show_first_post"
              checked={settings.show_first_post}
              onCheckedChange={(checked) =>
                updateSettings({ show_first_post: checked })
              }
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Einstellungen speichern
        </Button>
      </form>
    </Card>
  );
};