import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    // Generate the embed script with proper CORS headers
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
        const currentScript = scripts[scripts.length - 1];
        currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);
      })();
    `;
    
    // Write the script to the document
    document.open('text/javascript');
    document.write(script);
    document.close();
  }, [embedId]);

  return null;
};

export default EmbedScript;