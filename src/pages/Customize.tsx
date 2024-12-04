import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ColorPicker";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlayerSettings, defaultSettings } from "@/types/player";
import { usePlayerSettings } from "@/hooks/usePlayerSettings";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Customize = () => {
  const [settings, setSettings] = useState<Partial<PlayerSettings>>(defaultSettings);
  const { existingSettings, isLoading, mutation } = usePlayerSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(settings);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Lädt...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Player Anpassungen</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="p-6">
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

                <ColorPicker
                  label="Text Farbe"
                  value={settings.colors?.text || defaultSettings.colors.text}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, text: value },
                    })
                  }
                />

                <ColorPicker
                  label="Primär Farbe"
                  value={settings.colors?.primary || defaultSettings.colors.primary}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, primary: value },
                    })
                  }
                />

                <ColorPicker
                  label="Sekundär Farbe"
                  value={settings.colors?.secondary || defaultSettings.colors.secondary}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, secondary: value },
                    })
                  }
                />

                <ColorPicker
                  label="Hintergrund"
                  value={settings.colors?.background || defaultSettings.colors.background}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, background: value },
                    })
                  }
                />

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

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Gespeicherte Einstellungen</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Player Typ</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingSettings && (
                  <TableRow>
                    <TableCell>{existingSettings.name}</TableCell>
                    <TableCell>{existingSettings.player_type}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSettings(existingSettings)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => mutation.mutate({ ...existingSettings, id: "default" })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vorschau</h2>
          <div className="sticky top-4">
            <AudioPlayer
              audioSrc="https://example.com/audio.mp3"
              title="Beispiel Podcast Episode"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;