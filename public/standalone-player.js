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
  episodeTitle.style.backgroundColor = '#f8fafc';
  
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
    div.style.padding = '15px';
    div.style.margin = '5px 0';
    div.style.borderRadius = '6px';
    div.style.cursor = 'pointer';
    div.style.transition = 'all 0.2s';
    div.style.backgroundColor = '#f8fafc';
    div.style.border = '1px solid transparent';
    
    div.addEventListener('mouseover', () => {
      div.style.backgroundColor = '#f1f5f9';
      div.style.borderColor = '#e2e8f0';
    });
    
    div.addEventListener('mouseout', () => {
      if (!div.classList.contains('episode-active')) {
        div.style.backgroundColor = '#f8fafc';
        div.style.borderColor = 'transparent';
      }
    });
    
    div.innerHTML = `
      <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px;">${episode.title}</div>
      ${episode.duration ? `<div style="color: #64748b; font-size: 0.875rem;">${formatDuration(episode.duration)}</div>` : ''}
    `;
    
    div.addEventListener('click', () => {
      audio.src = episode.audioUrl;
      audio.play();
      episodeTitle.textContent = episode.title;
      
      // Update active episode styling
      document.querySelectorAll('.episode-active').forEach(el => {
        el.classList.remove('episode-active');
        el.style.backgroundColor = '#f8fafc';
        el.style.borderColor = 'transparent';
      });
      div.classList.add('episode-active');
      div.style.backgroundColor = '#f1f5f9';
      div.style.borderColor = '#e2e8f0';
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
        duration: item.querySelector('itunes\\:duration')?.textContent,
        pubDate: new Date(item.querySelector('pubDate')?.textContent || '').getTime()
      }));

      // Sort episodes by publication date (ascending - oldest first)
      episodes.sort((a, b) => a.pubDate - b.pubDate);
      
      episodes.forEach(episode => {
        const episodeElement = createEpisodeElement(episode);
        episodeList.appendChild(episodeElement);
      });
      
      // Load first (oldest) episode
      if (episodes.length > 0) {
        const firstEpisode = episodes[0];
        audio.src = firstEpisode.audioUrl;
        episodeTitle.textContent = firstEpisode.title;
        episodeList.firstChild.classList.add('episode-active');
        episodeList.firstChild.style.backgroundColor = '#f1f5f9';
        episodeList.firstChild.style.borderColor = '#e2e8f0';
      }
    } catch (error) {
      console.error('Error loading podcast feed:', error);
      episodeList.innerHTML = '<div style="padding: 20px; color: #ef4444;">Error loading podcast feed</div>';
    }
  };
  
  // Find target div and insert player
  const targetDiv = document.getElementById('jsplayer');
  if (targetDiv) {
    targetDiv.appendChild(container);
    
    // Get feed URL from script tag data attribute or use default
    const scriptTag = document.currentScript;
    const feedUrl = scriptTag?.getAttribute('data-feed-url') || 'https://wirfamilien.ch/tag/advent/feed';
    loadPodcast(feedUrl);
  } else {
    console.error('Target div with id "jsplayer" not found');
  }
})();