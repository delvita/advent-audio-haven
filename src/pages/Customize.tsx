import { useState } from "react";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { PlayerSettings } from "@/types/player";
import { usePlayerSettings } from "@/hooks/usePlayerSettings";
import { PlayerSettingsForm } from "@/components/PlayerSettingsForm";
import { PlayerSettingsTable } from "@/components/PlayerSettingsTable";
import { convertJsonToColors } from "@/utils/typeConversions";

const Customize = () => {
  const [settings, setSettings] = useState<Partial<PlayerSettings>>();
  const { existingSettings, isLoading, mutation } = usePlayerSettings();

  const handleSubmit = (newSettings: Partial<PlayerSettings>) => {
    mutation.mutate(newSettings);
  };

  const handleEdit = (dbSettings: any) => {
    setSettings({
      ...dbSettings,
      colors: convertJsonToColors(dbSettings.colors),
    });
  };

  const handleDelete = (dbSettings: any) => {
    mutation.mutate({ ...dbSettings, id: "default" });
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Lädt...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Player Anpassungen</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <PlayerSettingsForm
            initialSettings={settings}
            onSubmit={handleSubmit}
          />
          <PlayerSettingsTable
            settings={existingSettings}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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