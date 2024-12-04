import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
}

export const AudioControls = ({
  isPlaying,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
}: AudioControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onSkipBackward}
        className="hover:text-primary transition-colors"
      >
        <SkipBack className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
        className="h-12 w-12 rounded-full border-2 border-primary hover:bg-primary/10"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onSkipForward}
        className="hover:text-primary transition-colors"
      >
        <SkipForward className="h-6 w-6" />
      </Button>
    </div>
  );
};