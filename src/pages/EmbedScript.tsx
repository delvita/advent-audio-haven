import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    // Get the current host dynamically
    const currentHost = window.location.origin;

    // Generate the embed script with dynamic host
    const script = `
      (function() {
        const iframe = document.createElement('iframe');
        iframe.src = '${currentHost}/embed/${embedId}';
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

    // Write the script content with proper content type
    document.open('text/javascript');
    document.write(script);
    document.close();
  }, [embedId]);

  return null;
};

export default EmbedScript;