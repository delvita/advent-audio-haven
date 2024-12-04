import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    // Get the current host dynamically
    const currentHost = window.location.origin;

    // Generate the embed script
    const script = `
      (function() {
        // Create container div
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.maxWidth = '800px';
        container.style.margin = '0 auto';
        
        // Create and configure iframe
        const iframe = document.createElement('iframe');
        iframe.src = '${currentHost}/embed/${embedId}';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.allow = 'autoplay';
        
        // Add iframe to container
        container.appendChild(iframe);
        
        // Find the script tag that loaded this code
        const scriptTag = document.currentScript;
        if (scriptTag && scriptTag.parentNode) {
          scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
        }
      })();
    `;

    // Write the script directly to the document
    document.write(script);
    document.close();
  }, [embedId]);

  return null;
};

export default EmbedScript;