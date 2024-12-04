import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { generateEmbedScript } from '@/utils/generateEmbed';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    const script = generateEmbedScript(embedId, window.location.origin);
    document.open();
    document.write(script);
    document.close();
  }, [embedId]);

  return null;
};

export default EmbedScript;