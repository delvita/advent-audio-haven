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
    <Card className="mt-4 p-4 max-h-[400px] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Episodes ({episodes.length})</h3>
      <div className="space-y-2">
        {episodes.map((episode, index) => (
          <button
            key={index}
            onClick={() => onEpisodeSelect(episode)}
            className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${
              currentEpisode?.audioUrl === episode.audioUrl
                ? "bg-primary/10 text-primary"
                : "hover:bg-accent"
            }`}
          >
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 text-left">
              <h4 className="font-medium line-clamp-2">{episode.title}</h4>
              {episode.duration && (
                <span className="text-sm text-muted-foreground">{episode.duration}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};