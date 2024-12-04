import { useEffect, useState } from "react";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { EpisodeList } from "@/components/AudioPlayer/EpisodeList";
import { useToast } from "@/hooks/use-toast";
import { defaultSettings, getProxiedUrl } from "@/types/player";

interface Episode {
  title: string;
  audioUrl: string;
  imageUrl: string;
  duration?: string;
}

const Index = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>();
  const { toast } = useToast();

  const fetchFeed = async () => {
    try {
      const response = await fetch(getProxiedUrl(defaultSettings.feed_url || ""));
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");
      const items = xml.querySelectorAll("item");

      const parsedEpisodes = Array.from(items).map((item) => {
        const title = item.querySelector("title")?.textContent || "";
        const audioUrl = item.querySelector("enclosure")?.getAttribute("url") || "";
        const imageUrl = item.querySelector("image")?.textContent || 
                        item.querySelector("itunes\\:image")?.getAttribute("href") ||
                        "/placeholder.svg";
        
        return {
          title,
          audioUrl,
          imageUrl,
        };
      });

      setEpisodes(parsedEpisodes);
      if (parsedEpisodes.length > 0 && !currentEpisode) {
        setCurrentEpisode(parsedEpisodes[0]);
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
    fetchFeed();
  }, []);

  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Advent Podcast</h1>
      {currentEpisode && (
        <AudioPlayer
          title={currentEpisode.title}
          audioSrc={currentEpisode.audioSrc}
          onNext={() => {
            const currentIndex = episodes.findIndex(
              (ep) => ep.audioUrl === currentEpisode.audioUrl
            );
            if (currentIndex < episodes.length - 1) {
              setCurrentEpisode(episodes[currentIndex + 1]);
            }
          }}
        />
      )}
      <EpisodeList
        episodes={episodes}
        currentEpisode={currentEpisode}
        onEpisodeSelect={handleEpisodeSelect}
      />
    </div>
  );
};

export default Index;