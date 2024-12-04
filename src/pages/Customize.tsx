import { useState } from "react";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { PlayerSettings } from "@/types/player";
import { usePlayerSettings } from "@/hooks/usePlayerSettings";
import { PlayerSettingsForm } from "@/components/PlayerSettingsForm";
import { PlayerSettingsTable } from "@/components/PlayerSettingsTable";
import { convertJsonToColors } from "@/utils/typeConversions";
import { EpisodeList } from "@/components/AudioPlayer/EpisodeList";
import { Card } from "@/components/ui/card";

const Customize = () => {
  const [previewSettings, setPreviewSettings] = useState<Partial<PlayerSettings>>();
  const { existingSettings, isLoading, mutation } = usePlayerSettings();

  const handleSettingsChange = (newSettings: Partial<PlayerSettings>) => {
    setPreviewSettings(newSettings);
  };

  const handleSubmit = (newSettings: Partial<PlayerSettings>) => {
    mutation.mutate(newSettings);
  };

  const handleEdit = (dbSettings: any) => {
    const settings = {
      ...dbSettings,
      colors: convertJsonToColors(dbSettings.colors),
    };
    setPreviewSettings(settings);
  };

  const handleDelete = (dbSettings: any) => {
    mutation.mutate({ ...dbSettings, id: "default" });
  };

  const currentSettings = previewSettings || existingSettings;

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Lädt...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Player Anpassungen</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <PlayerSettingsForm
            initialSettings={currentSettings}
            onSubmit={handleSubmit}
            onChange={handleSettingsChange}
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
            <Card className="overflow-hidden">
              {currentSettings?.feed_url && (
                <>
                  <AudioPlayer
                    feedUrl={currentSettings.feed_url}
                    colors={currentSettings.colors}
                    playerType={currentSettings.player_type}
                  />
                  <EpisodeList
                    feedUrl={currentSettings.feed_url}
                    colors={currentSettings.colors}
                    listHeight={currentSettings.list_height}
                    sortAscending={currentSettings.sort_ascending}
                    showFirstPost={currentSettings.show_first_post}
                  />
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;