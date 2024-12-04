(function() {
  const container = document.createElement('div');
  container.id = 'podcast-player-container';
  container.style.width = '100%';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  
  const iframe = document.createElement('iframe');
  const scriptTag = document.currentScript;
  const embedId = scriptTag ? new URL(scriptTag.src).searchParams.get('id') : null;
  
  if (!embedId) {
    console.error('No embed ID provided');
    return;
  }
  
  // Use the script's source URL to determine the player's domain
  const scriptUrl = new URL(scriptTag.src);
  const playerDomain = `${scriptUrl.protocol}//${scriptUrl.host}`;
  
  iframe.src = `${playerDomain}/embed/${embedId}`;
  iframe.style.width = '100%';
  iframe.style.height = '800px';
  iframe.style.border = '1px solid #e2e8f0';
  iframe.style.borderRadius = '8px';
  iframe.style.overflow = 'hidden';
  iframe.scrolling = 'no';
  iframe.allow = 'autoplay';
  
  container.appendChild(iframe);
  
  if (scriptTag && scriptTag.parentNode) {
    scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
  }
})();