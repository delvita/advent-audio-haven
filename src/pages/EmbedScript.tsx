import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { generateEmbedScript } from '@/utils/generateEmbed';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    const script = generateEmbedScript(embedId, window.location.origin);
    
    // Instead of setting contentType directly, we'll just write the script
    // The server should set the correct Content-Type header
    document.write(script);
  }, [embedId]);

  return null;
};

export default EmbedScript;