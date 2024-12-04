import { useRef, useState, useEffect } from "react";
import { AudioControls } from "./AudioControls";
import { ProgressBar } from "./ProgressBar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onNext) onNext();
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

  return (
    <Card className="overflow-hidden">
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
        </div>
      </div>
    </Card>
  );
};