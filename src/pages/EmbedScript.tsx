import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    // Generiere das Embed-Script
    const script = `
      (function() {
        const iframe = document.createElement('iframe');
        iframe.src = '${window.location.origin}/embed/${embedId}';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        
        // Finde das Script-Tag
        const scripts = document.getElementsByTagName('script');
        const currentScript = scripts[scripts.length - 1];
        
        // Füge den iframe nach dem Script-Tag ein
        currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);
      })();
    `;
    
    // Clear the document and write the script
    document.open('text/javascript');
    document.write(script);
    document.close();
  }, [embedId]);

  return null;
};

export default EmbedScript;