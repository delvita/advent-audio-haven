import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';
  const currentHost = window.location.origin;

  useEffect(() => {
    // Create the script content
    const script = `
      (function() {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.maxWidth = '800px';
        container.style.margin = '0 auto';
        
        const iframe = document.createElement('iframe');
        iframe.src = '${currentHost}/embed/${embedId}';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.allow = 'autoplay';
        
        container.appendChild(iframe);
        
        const scriptTag = document.currentScript;
        if (scriptTag && scriptTag.parentNode) {
          scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
        }
      })();
    `;

    // Clear any existing content
    document.open();
    
    // Write the script content directly to the document
    document.write(script);
    
    // Prevent React from re-rendering
    document.close();
  }, [embedId, currentHost]);

  return null;
};

export default EmbedScript;