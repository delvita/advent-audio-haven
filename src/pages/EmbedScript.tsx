import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    // Set response headers
    const response = new Response(null, {
      headers: {
        'Content-Type': 'application/javascript',
        'Access-Control-Allow-Origin': '*'
      }
    });

    // Generate the embed script
    const script = `
      (function() {
        const iframe = document.createElement('iframe');
        iframe.src = '${window.location.origin}/embed/${embedId}';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay';
        
        const currentScript = document.currentScript;
        if (currentScript) {
          currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);
        }
      })();
    `;

    // Write the script content
    document.open();
    document.write(script);
    document.close();
  }, [embedId]);

  return null;
};

export default EmbedScript;