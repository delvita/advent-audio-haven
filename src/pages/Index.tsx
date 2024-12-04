import { useEffect, useState } from "react";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { EpisodeList } from "@/components/AudioPlayer/EpisodeList";
import { useToast } from "@/hooks/use-toast";
import { defaultSettings, getProxiedUrl } from "@/types/player";
import { Card } from "@/components/ui/card";
import { Episode } from "@/types/episode";

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

    return itunesImage || 
           mediaContent || 
           enclosureImage || 
           (imgMatch && imgMatch[1]) || 
           getFallbackImage();
  };

  const getDuration = (item: Element): string | undefined => {
    const duration = item.querySelector("itunes\\:duration")?.textContent;
    if (!duration) return undefined;
    
    // Convert seconds to MM:SS format if duration is in seconds
    if (/^\d+$/.test(duration)) {
      const seconds = parseInt(duration);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return duration;
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
        const duration = getDuration(item);
        const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
        
        return {
          title,
          audioUrl,
          imageUrl,
          duration,
          pubDate,
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

  const handleNext = () => {
    const currentIndex = episodes.findIndex(
      (ep) => ep.audioUrl === currentEpisode?.audioUrl
    );
    if (currentIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentIndex + 1]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Advent Podcast</h1>
      <Card className="overflow-hidden">
        {currentEpisode && (
          <AudioPlayer
            title={currentEpisode.title}
            audioSrc={currentEpisode.audioUrl}
            imageUrl={currentEpisode.imageUrl}
            onNext={handleNext}
          />
        )}
        <EpisodeList
          episodes={episodes}
          currentEpisode={currentEpisode}
          onEpisodeSelect={handleEpisodeSelect}
        />
      </Card>
    </div>
  );
};

export default Index;
