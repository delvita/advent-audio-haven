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

  const getFallbackImage = () => {
    return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&h=500";
  };

  const getValidImageUrl = (item: Element): string => {
    // Try different possible image sources
    const itunesImage = item.querySelector("itunes\\:image")?.getAttribute("href");
    const mediaContent = item.querySelector("media\\:content, content")?.getAttribute("url");
    const enclosureImage = Array.from(item.querySelectorAll("enclosure"))
      .find(enc => enc.getAttribute("type")?.startsWith("image/"))
      ?.getAttribute("url");
    const description = item.querySelector("description")?.textContent;
    const imgMatch = description?.match(/<img[^>]+src="([^">]+)"/);

    // Return the first valid image URL found, or fallback
    return itunesImage || 
           mediaContent || 
           enclosureImage || 
           (imgMatch && imgMatch[1]) || 
           getFallbackImage();
  };

  const fetchFeed = async () => {
    try {
      const response = await fetch(getProxiedUrl(defaultSettings.feed_url || ""));
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");
      const items = xml.querySelectorAll("item");

      const parsedEpisodes = Array.from(items).map((item) => {
        const title = item.querySelector("title")?.textContent || "Untitled Episode";
        const audioUrl = item.querySelector("enclosure")?.getAttribute("url") || "";
        const imageUrl = getValidImageUrl(item);
        
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
          audioSrc={currentEpisode.audioUrl}
          imageUrl={currentEpisode.imageUrl}
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