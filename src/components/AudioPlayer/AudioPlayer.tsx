import { useRef, useState, useEffect } from "react";
import { AudioControls } from "./AudioControls";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Repeat, SkipForward } from "lucide-react";

interface AudioPlayerProps {
  audioSrc: string;
  title: string;
  imageUrl?: string;
  onNext?: () => void;
}

export const AudioPlayer = ({ audioSrc, title, imageUrl, onNext }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showEndActions, setShowEndActions] = useState(false);
  const { toast } = useToast();
  const nextTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Start playing when a new episode is selected
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay was prevented
        setIsPlaying(false);
      });
    }
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setShowEndActions(true);
      
      // Auto-play next episode after 5 seconds
      if (onNext) {
        nextTimeoutRef.current = setTimeout(() => {
          setShowEndActions(false);
          onNext();
        }, 5000);
      }
    };
    const handleError = () => {
      toast({
        title: "Fehler beim Abspielen",
        description: "Die Audio-Datei konnte nicht geladen werden.",
        variant: "destructive",
      });
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      if (nextTimeoutRef.current) {
        clearTimeout(nextTimeoutRef.current);
      }
    };
  }, [onNext, toast]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        duration
      );
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setShowEndActions(false);
      if (nextTimeoutRef.current) {
        clearTimeout(nextTimeoutRef.current);
      }
    }
  };

  const handleNextEpisode = () => {
    if (nextTimeoutRef.current) {
      clearTimeout(nextTimeoutRef.current);
    }
    setShowEndActions(false);
    if (onNext) onNext();
  };

  return (
    <div className="relative">
      <audio ref={audioRef} src={audioSrc} />
      <div className="flex flex-col sm:flex-row">
        {imageUrl && (
          <div className="w-full sm:w-1/3">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover aspect-square sm:aspect-auto"
            />
          </div>
        )}
        <div className="flex-1 p-6 space-y-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          {showEndActions ? (
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReplay}
                className="flex items-center gap-2"
              >
                <Repeat className="w-5 h-5" />
                Wiederholen
              </Button>
              <Button
                size="lg"
                onClick={handleNextEpisode}
                className="flex items-center gap-2 animate-pulse"
              >
                <SkipForward className="w-5 h-5" />
                Nächste Episode
              </Button>
            </div>
          ) : (
            <>
              <AudioControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onSkipForward={handleSkipForward}
                onSkipBackward={handleSkipBackward}
              />
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};