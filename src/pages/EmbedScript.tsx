import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    // Set content type header
    if (document.contentType !== 'application/javascript') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Type';
      meta.content = 'application/javascript';
      document.head.appendChild(meta);
    }

    // Generate and write the embed script
    const script = `
      (function() {
        // Create iframe element
        const iframe = document.createElement('iframe');
        
        // Set iframe attributes
        iframe.src = '${window.location.origin}/embed/${embedId}';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay';
        
        // Find the script tag and insert iframe after it
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
          if (script.src.includes('/embed.js')) {
            script.parentNode.insertBefore(iframe, script.nextSibling);
            break;
          }
        }
      })();
    `;

    document.write(script);
    document.close();
  }, [embedId]);

  return null;
};

export default EmbedScript;