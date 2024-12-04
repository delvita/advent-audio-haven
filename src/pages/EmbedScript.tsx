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
        
        // Insert the iframe after the script tag
        document.currentScript.insertAdjacentElement('afterend', iframe);
      })();
    `;

    // Write the script content directly to the document
    const scriptElement = document.createElement('script');
    scriptElement.textContent = script;
    document.body.appendChild(scriptElement);
  }, [embedId]);

  return null;
};

export default EmbedScript;