(function() {
  const container = document.createElement('div');
  container.id = 'podcast-player-container';
  container.style.width = '100%';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.overflow = 'hidden';
  
  const playerContainer = document.createElement('div');
  playerContainer.id = 'podcast-player';
  playerContainer.style.width = '100%';
  playerContainer.style.height = '800px';
  playerContainer.style.border = '1px solid #e2e8f0';
  playerContainer.style.borderRadius = '8px';
  playerContainer.style.overflow = 'hidden';
  
  const scriptTag = document.currentScript;
  const embedId = scriptTag ? new URL(scriptTag.src).searchParams.get('id') : null;
  
  if (!embedId) {
    console.error('No embed ID provided');
    return;
  }
  
  const scriptUrl = new URL(scriptTag.src);
  const playerDomain = `${scriptUrl.protocol}//${scriptUrl.host}`;
  
  fetch(`${playerDomain}/embed/${embedId}`)
    .then(response => response.text())
    .then(html => {
      playerContainer.innerHTML = html;
    })
    .catch(error => {
      console.error('Error loading player:', error);
      playerContainer.innerHTML = 'Error loading player content';
    });
  
  container.appendChild(playerContainer);
  
  if (scriptTag && scriptTag.parentNode) {
    scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
  }
})();