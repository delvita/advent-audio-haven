import { useState, useEffect } from "react";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { PlayerSettings } from "@/types/player";
import { usePlayerSettings } from "@/hooks/usePlayerSettings";
import { PlayerSettingsForm } from "@/components/PlayerSettingsForm";
import { PlayerSettingsTable } from "@/components/PlayerSettingsTable";
import { convertJsonToColors } from "@/utils/typeConversions";
import { EpisodeList } from "@/components/AudioPlayer/EpisodeList";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Episode {
  title: string;
  audioUrl: string;
  imageUrl: string;
  duration?: string;
}

const Customize = () => {
  const [previewSettings, setPreviewSettings] = useState<Partial<PlayerSettings>>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>();
  const { existingSettings, isLoading, mutation } = usePlayerSettings();
  const { toast } = useToast();

  const getFallbackImage = () => {
    return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&h=500";
  };

  const getValidImageUrl = (item: Element): string => {
    const itunesImage = item.querySelector("itunes\\:image")?.getAttribute("href");
    const mediaContent = item.querySelector("media\\:content, content")?.getAttribute("url");
    const enclosureImage = Array.from(item.querySelectorAll("enclosure"))
      .find(enc => enc.getAttribute("type")?.startsWith("image/"))
      ?.getAttribute("url");
    const description = item.querySelector("description")?.textContent;
    const imgMatch = description?.match(/<img[^>]+src="([^">]+)"/);

    return itunesImage || 
           mediaContent || 
           enclosureImage || 
           (imgMatch && imgMatch[1]) || 
           getFallbackImage();
  };

  const getDuration = (item: Element): string | undefined => {
    const duration = item.querySelector("itunes\\:duration")?.textContent;
    if (!duration) return undefined;
    
    if (/^\d+$/.test(duration)) {
      const seconds = parseInt(duration);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return duration;
  };

  const sortEpisodes = (episodesToSort: Episode[], ascending: boolean) => {
    return ascending ? [...episodesToSort] : [...episodesToSort].reverse();
  };

  const fetchFeed = async (feedUrl: string) => {
    try {
      const response = await fetch(feedUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");
      const items = xml.querySelectorAll("item");

      let parsedEpisodes = Array.from(items).map((item) => {
        const title = item.querySelector("title")?.textContent || "Untitled Episode";
        const audioUrl = item.querySelector("enclosure")?.getAttribute("url") || "";
        const imageUrl = getValidImageUrl(item);
        const duration = getDuration(item);
        
        return {
          title,
          audioUrl,
          imageUrl,
          duration,
        };
      });

      const shouldSortAscending = previewSettings?.sort_ascending ?? existingSettings?.sort_ascending ?? false;
      parsedEpisodes = sortEpisodes(parsedEpisodes, shouldSortAscending);

      setEpisodes(parsedEpisodes);

      const showFirstPost = previewSettings?.show_first_post ?? existingSettings?.show_first_post ?? false;
      if (parsedEpisodes.length > 0) {
        setCurrentEpisode(showFirstPost ? parsedEpisodes[0] : parsedEpisodes[parsedEpisodes.length - 1]);
      }
    } catch (error) {
      toast({
        title: "Error loading feed",
        description: "Could not load the podcast feed. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (previewSettings?.feed_url) {
      fetchFeed(previewSettings.feed_url);
    } else if (existingSettings?.feed_url) {
      fetchFeed(existingSettings.feed_url);
    }
  }, [previewSettings?.feed_url, existingSettings?.feed_url]);

  useEffect(() => {
    if (episodes.length > 0) {
      const shouldSortAscending = previewSettings?.sort_ascending ?? existingSettings?.sort_ascending ?? false;
      const sortedEpisodes = sortEpisodes(episodes, shouldSortAscending);
      setEpisodes(sortedEpisodes);

      const showFirstPost = previewSettings?.show_first_post ?? existingSettings?.show_first_post ?? false;
      setCurrentEpisode(showFirstPost ? sortedEpisodes[0] : sortedEpisodes[sortedEpisodes.length - 1]);
    }
  }, [previewSettings?.sort_ascending, previewSettings?.show_first_post]);

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

  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  const currentSettings = previewSettings || (existingSettings ? {
    ...existingSettings,
    colors: convertJsonToColors(existingSettings.colors)
  } : undefined);

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
              {currentEpisode && (
                <AudioPlayer
                  title={currentEpisode.title}
                  audioSrc={currentEpisode.audioUrl}
                  imageUrl={currentEpisode.imageUrl}
                />
              )}
              <EpisodeList
                episodes={episodes}
                currentEpisode={currentEpisode}
                onEpisodeSelect={handleEpisodeSelect}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
