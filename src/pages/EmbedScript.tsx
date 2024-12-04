import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { generateEmbedScript } from '@/utils/generateEmbed';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    const script = generateEmbedScript(embedId, window.location.origin);
    
    // Set the content type to JavaScript
    document.contentType = 'application/javascript';
    
    // Write the script directly to the document
    document.write(script);
  }, [embedId]);

  return null;
};

export default EmbedScript;