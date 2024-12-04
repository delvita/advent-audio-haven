import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";

const Index = () => {
  // Beispiel-Audio für den Start
  const demoTrack = {
    title: "Advent Podcast - Folge 1",
    audioSrc: "https://example.com/podcast1.mp3",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Advent Podcast</h1>
      <AudioPlayer
        title={demoTrack.title}
        audioSrc={demoTrack.audioSrc}
      />
    </div>
  );
};

export default Index;