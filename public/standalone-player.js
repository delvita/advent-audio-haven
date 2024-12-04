(function() {
  // Create container elements
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
  const playerContainer = document.createElement('div');
  playerContainer.style.width = '100%';
  playerContainer.style.border = '1px solid #e2e8f0';
  playerContainer.style.borderRadius = '8px';
  playerContainer.style.overflow = 'hidden';
  playerContainer.style.backgroundColor = '#ffffff';
  
  // Audio player elements
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.style.width = '100%';
  audio.style.margin = '20px 0';
  audio.style.padding = '0 20px';
  
  const episodeTitle = document.createElement('h2');
  episodeTitle.style.padding = '20px';
  episodeTitle.style.margin = '0';
  episodeTitle.style.borderBottom = '1px solid #e2e8f0';
  
  const episodeList = document.createElement('div');
  episodeList.style.maxHeight = '400px';
  episodeList.style.overflow = 'auto';
  episodeList.style.padding = '10px';
  
  // Add elements to containers
  playerContainer.appendChild(episodeTitle);
  playerContainer.appendChild(audio);
  playerContainer.appendChild(episodeList);
  container.appendChild(playerContainer);
  
  // Function to format duration
  const formatDuration = (duration) => {
    if (!duration) return '';
    if (/^\d+$/.test(duration)) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return duration;
  };
  
  // Function to create episode elements
  const createEpisodeElement = (episode) => {
    const div = document.createElement('div');
    div.style.padding = '10px';
    div.style.margin = '5px 0';
    div.style.borderRadius = '4px';
    div.style.cursor = 'pointer';
    div.style.transition = 'background-color 0.2s';
    div.style.backgroundColor = '#f8f9fa';
    
    div.innerHTML = `
      <div style="font-weight: bold;">${episode.title}</div>
      ${episode.duration ? `<div style="color: #666; font-size: 0.9em;">${formatDuration(episode.duration)}</div>` : ''}
    `;
    
    div.addEventListener('click', () => {
      audio.src = episode.audioUrl;
      audio.play();
      episodeTitle.textContent = episode.title;
      
      // Update active episode styling
      document.querySelectorAll('.episode-active').forEach(el => {
        el.classList.remove('episode-active');
        el.style.backgroundColor = '#f8f9fa';
      });
      div.classList.add('episode-active');
      div.style.backgroundColor = '#e2e8f0';
    });
    
    return div;
  };
  
  // Function to parse RSS feed
  const loadPodcast = async (feedUrl) => {
    try {
      const corsProxy = 'https://mf1.ch/crosproxy/?';
      const response = await fetch(corsProxy + feedUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      
      const items = xml.querySelectorAll('item');
      const episodes = Array.from(items).map(item => ({
        title: item.querySelector('title')?.textContent || 'Untitled Episode',
        audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
        duration: item.querySelector('itunes\\:duration')?.textContent
      }));
      
      episodes.forEach(episode => {
        const episodeElement = createEpisodeElement(episode);
        episodeList.appendChild(episodeElement);
      });
      
      // Load first episode
      if (episodes.length > 0) {
        const firstEpisode = episodes[0];
        audio.src = firstEpisode.audioUrl;
        episodeTitle.textContent = firstEpisode.title;
        episodeList.firstChild.classList.add('episode-active');
        episodeList.firstChild.style.backgroundColor = '#e2e8f0';
      }
    } catch (error) {
      console.error('Error loading podcast feed:', error);
      episodeList.innerHTML = '<div style="padding: 20px; color: red;">Error loading podcast feed</div>';
    }
  };
  
  // Insert player into the page
  const scriptTag = document.currentScript;
  if (scriptTag && scriptTag.parentNode) {
    scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
    
    // Get feed URL from data attribute or use default
    const feedUrl = scriptTag.getAttribute('data-feed-url') || 'https://wirfamilien.ch/tag/advent/feed';
    loadPodcast(feedUrl);
  }
})();