import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { useState } from "react";
import { Episode } from "@/types/episode";

const Embed = () => {
  const { embedId } = useParams();
  const [currentEpisode, setCurrentEpisode] = useState<Episode>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);

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
    return [...episodesToSort].sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  };

  const handleNext = () => {
    if (!currentEpisode || episodes.length === 0) return;
    
    const currentIndex = episodes.findIndex(
      episode => episode.audioUrl === currentEpisode.audioUrl
    );
    
    if (currentIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentIndex + 1]);
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["playerSettings", embedId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_settings")
        .select("*")
        .eq("id", embedId)
        .single();

      if (error) throw error;

      try {
        const response = await fetch(data.feed_url);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        const parsedEpisodes = Array.from(items).map((item): Episode => {
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

        const sortedEpisodes = sortEpisodes(parsedEpisodes, data.sort_ascending);
        setEpisodes(sortedEpisodes);

        if (sortedEpisodes.length > 0) {
          const initialEpisode = data.show_first_post ? 
            sortedEpisodes[0] : 
            sortedEpisodes[sortedEpisodes.length - 1];
          setCurrentEpisode(initialEpisode);
        }

        return data;
      } catch (error) {
        console.error("Error fetching feed:", error);
        throw error;
      }
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full bg-white">
      {currentEpisode && (
        <AudioPlayer
          title={currentEpisode.title}
          audioSrc={currentEpisode.audioUrl}
          imageUrl={currentEpisode.imageUrl}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default Embed;