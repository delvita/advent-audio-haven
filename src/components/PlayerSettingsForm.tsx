import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ColorPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

          <div>
            <Label htmlFor="player_type">Player Größe</Label>
            <Select
              value={settings.player_type}
              onValueChange={(value) =>
                updateSettings({ player_type: value })
              }
              name="player_type"
            >
              <SelectTrigger id="player_type">
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
              name="list_height"
              type="number"
              value={settings.list_height}
              onChange={(e) =>
                updateSettings({ list_height: e.target.value })
              }
              autoComplete="off"
            />
          </div>

          <ColorPicker
            label="Text Farbe"
            value={settings.colors?.text || defaultSettings.colors.text}
            onChange={(value) =>
              updateSettings({
                colors: { ...settings.colors, text: value },
              })
            }
          />

          <ColorPicker
            label="Primär Farbe"
            value={settings.colors?.primary || defaultSettings.colors.primary}
            onChange={(value) =>
              updateSettings({
                colors: { ...settings.colors, primary: value },
              })
            }
          />

          <ColorPicker
            label="Sekundär Farbe"
            value={settings.colors?.secondary || defaultSettings.colors.secondary}
            onChange={(value) =>
              updateSettings({
                colors: { ...settings.colors, secondary: value },
              })
            }
          />

          <ColorPicker
            label="Hintergrund"
            value={settings.colors?.background || defaultSettings.colors.background}
            onChange={(value) =>
              updateSettings({
                colors: { ...settings.colors, background: value },
              })
            }
          />

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