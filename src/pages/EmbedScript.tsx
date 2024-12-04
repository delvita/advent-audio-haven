import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const EmbedScript = () => {
  const [searchParams] = useSearchParams();
  const embedId = searchParams.get('id') || 'default';

  useEffect(() => {
    // Fetch the embed.js file and serve it
    fetch('/embed.js')
      .then(response => response.text())
      .then(script => {
        const blob = new Blob([script], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        window.location.href = url;
        URL.revokeObjectURL(url);
      });
  }, []);

  return null;
};

export default EmbedScript;