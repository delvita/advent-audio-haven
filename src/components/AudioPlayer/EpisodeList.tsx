import { Card } from "@/components/ui/card";

interface Episode {
  title: string;
  audioUrl: string;
  imageUrl: string;
  duration?: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisode?: Episode;
  onEpisodeSelect: (episode: Episode) => void;
}

export const EpisodeList = ({ episodes, currentEpisode, onEpisodeSelect }: EpisodeListProps) => {
  return (
    <div className="border-t">
      <div className="p-4">
        <h3 className="text-lg font-semibold">Episodes ({episodes.length})</h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {episodes.map((episode, index) => (
          <button
            key={index}
            onClick={() => onEpisodeSelect(episode)}
            className={`w-full flex items-center gap-4 p-4 transition-colors border-t first:border-t-0 ${
              currentEpisode?.audioUrl === episode.audioUrl
                ? "bg-primary/10 text-primary"
                : "hover:bg-accent"
            }`}
          >
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="w-16 h-16 rounded object-cover"
            />
            <div className="flex-1 text-left">
              <h4 className="font-medium line-clamp-2">{episode.title}</h4>
              {episode.duration && (
                <span className="text-sm text-muted-foreground mt-1">{episode.duration}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};