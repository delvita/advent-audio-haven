import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';
  const currentHost = window.location.origin;

  useEffect(() => {
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

    // Create a Blob containing the JavaScript code
    const blob = new Blob([script], { type: 'application/javascript' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'embed.js';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [embedId, currentHost]);

  return null;
};

export default EmbedScript;