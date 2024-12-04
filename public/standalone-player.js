(function() {
  // Create container elements
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.backgroundColor = '#ffffff';
  container.style.borderRadius = '12px';
  container.style.overflow = 'hidden';
  container.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  
  const playerContainer = document.createElement('div');
  playerContainer.style.width = '100%';
  
  // Featured image container with responsive layout
  const imageContainer = document.createElement('div');
  imageContainer.style.width = '100%';
  imageContainer.style.position = 'relative';
  imageContainer.style.backgroundColor = '#f3f4f6';
  imageContainer.style.overflow = 'hidden';
  
  // Make image container responsive
  const mediaQuery = window.matchMedia('(min-width: 640px)');
  const updateLayout = (e) => {
    if (e.matches) {
      // Desktop layout
      imageContainer.style.width = '33.333%';
      imageContainer.style.position = 'absolute';
      imageContainer.style.left = '0';
      imageContainer.style.top = '0';
      imageContainer.style.bottom = '0';
      imageContainer.style.paddingBottom = '0';
      playerContainer.style.marginLeft = '33.333%';
    } else {
      // Mobile layout
      imageContainer.style.width = '100%';
      imageContainer.style.position = 'relative';
      imageContainer.style.paddingBottom = '56.25%';
      playerContainer.style.marginLeft = '0';
    }
  };
  
  mediaQuery.addListener(updateLayout);
  updateLayout(mediaQuery);
  
  const featuredImage = document.createElement('img');
  featuredImage.style.position = 'absolute';
  featuredImage.style.top = '0';
  featuredImage.style.left = '0';
  featuredImage.style.width = '100%';
  featuredImage.style.height = '100%';
  featuredImage.style.objectFit = 'cover';
  
  imageContainer.appendChild(featuredImage);
  
  // Episode title
  const episodeTitle = document.createElement('h2');
  episodeTitle.style.padding = '20px';
  episodeTitle.style.margin = '0';
  episodeTitle.style.fontSize = '1.5rem';
  episodeTitle.style.fontWeight = '600';
  episodeTitle.style.color = '#1a1a1a';
  
  // Audio player container - moved up before it's used
  const audioContainer = document.createElement('div');
  audioContainer.style.padding = '0 20px 20px';
  
  // Custom audio player
  const audio = document.createElement('audio');
  
  // Progress bar container
  const progressContainer = document.createElement('div');
  progressContainer.style.width = '100%';
  progressContainer.style.height = '4px';
  progressContainer.style.backgroundColor = '#e5e7eb';
  progressContainer.style.borderRadius = '2px';
  progressContainer.style.cursor = 'pointer';
  progressContainer.style.marginBottom = '10px';
  
  const progress = document.createElement('div');
  progress.style.width = '0%';
  progress.style.height = '100%';
  progress.style.backgroundColor = '#3b82f6';
  progress.style.borderRadius = '2px';
  progress.style.transition = 'width 0.1s';
  
  progressContainer.appendChild(progress);
  
  // Time display
  const timeDisplay = document.createElement('div');
  timeDisplay.style.display = 'flex';
  timeDisplay.style.justifyContent = 'space-between';
  timeDisplay.style.color = '#6b7280';
  timeDisplay.style.fontSize = '0.875rem';
  timeDisplay.innerHTML = '<span>0:00</span><span>0:00</span>';
  
  // Controls container
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.alignItems = 'center';
  controls.style.justifyContent = 'center';
  controls.style.gap = '20px';
  controls.style.margin = '20px 0';
  
  // Control buttons
  const createButton = (icon) => {
    const button = document.createElement('button');
    button.style.background = 'none';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.padding = '8px';
    button.style.borderRadius = '50%';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.transition = 'background-color 0.2s';
    button.innerHTML = icon;
    button.style.color = '#1a1a1a';
    
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#f3f4f6';
    });
    
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = 'transparent';
    });
    
    return button;
  };
  
  const prevButton = createButton('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>');
  const playButton = createButton('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>');
  const nextButton = createButton('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>');
  
  controls.appendChild(prevButton);
  controls.appendChild(playButton);
  controls.appendChild(nextButton);

  // Add elements to audio container
  audioContainer.appendChild(progressContainer);
  audioContainer.appendChild(timeDisplay);
  audioContainer.appendChild(controls);
  
  // Episode list
  const episodeList = document.createElement('div');
  episodeList.style.borderTop = '1px solid #e5e7eb';
  
  const episodeListTitle = document.createElement('h3');
  episodeListTitle.style.padding = '20px';
  episodeListTitle.style.margin = '0';
  episodeListTitle.style.fontSize = '1.125rem';
  episodeListTitle.style.fontWeight = '600';
  episodeListTitle.style.color = '#1a1a1a';
  
  const episodeListContainer = document.createElement('div');
  episodeListContainer.style.maxHeight = '400px';
  episodeListContainer.style.overflow = 'auto';

  const formatDuration = (duration) => {
    if (!duration) return '';
    if (/^\d+$/.test(duration)) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return duration;
  };
  
  // Function to get episode image from item
  const getEpisodeImage = (item) => {
    // Try different possible image sources in order of preference
    const itunesImage = item.querySelector('itunes\\:image')?.getAttribute('href');
    const mediaContent = item.querySelector('media\\:content')?.getAttribute('url');
    const enclosureImage = Array.from(item.querySelectorAll('enclosure'))
      .find(enc => enc.getAttribute('type')?.startsWith('image/'))
      ?.getAttribute('url');
    const description = item.querySelector('description')?.textContent;
    const imgMatch = description?.match(/<img[^>]+src="([^">]+)"/);
    
    return itunesImage || 
           mediaContent || 
           enclosureImage || 
           (imgMatch && imgMatch[1]) || 
           'placeholder.jpg';
  };
  
  // Function to create episode elements
  const createEpisodeElement = (episode) => {
    const div = document.createElement('div');
    div.style.padding = '15px 20px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.gap = '15px';
    div.style.cursor = 'pointer';
    div.style.transition = 'background-color 0.2s';
    
    const thumbnail = document.createElement('div');
    thumbnail.style.width = '48px';
    thumbnail.style.height = '48px';
    thumbnail.style.borderRadius = '8px';
    thumbnail.style.overflow = 'hidden';
    thumbnail.style.flexShrink = '0';
    thumbnail.style.position = 'relative';
    
    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = episode.imageUrl;
    thumbnailImg.style.width = '100%';
    thumbnailImg.style.height = '100%';
    thumbnailImg.style.objectFit = 'cover';
    
    const playIcon = document.createElement('div');
    playIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    playIcon.style.position = 'absolute';
    playIcon.style.top = '50%';
    playIcon.style.left = '50%';
    playIcon.style.transform = 'translate(-50%, -50%)';
    playIcon.style.opacity = '0';
    playIcon.style.transition = 'opacity 0.2s';
    
    thumbnail.appendChild(thumbnailImg);
    thumbnail.appendChild(playIcon);
    
    const content = document.createElement('div');
    content.style.flex = '1';
    content.innerHTML = `
      <div style="font-weight: 500; color: #1a1a1a; margin-bottom: 4px;">${episode.title}</div>
      ${episode.duration ? `<div style="color: #6b7280; font-size: 0.875rem;">${formatDuration(episode.duration)}</div>` : ''}
    `;
    
    div.appendChild(thumbnail);
    div.appendChild(content);
    
    div.addEventListener('mouseover', () => {
      div.style.backgroundColor = '#f9fafb';
      playIcon.style.opacity = '1';
    });
    
    div.addEventListener('mouseout', () => {
      if (!div.classList.contains('episode-active')) {
        div.style.backgroundColor = 'transparent';
        playIcon.style.opacity = '0';
      }
    });
    
    div.addEventListener('click', () => {
      audio.src = episode.audioUrl;
      audio.play();
      playButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
      episodeTitle.textContent = episode.title;
      featuredImage.src = episode.imageUrl;
      
      document.querySelectorAll('.episode-active').forEach(el => {
        el.classList.remove('episode-active');
        el.style.backgroundColor = 'transparent';
      });
      div.classList.add('episode-active');
      div.style.backgroundColor = '#f9fafb';
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
      const episodes = Array.from(items).map(item => {
        return {
          title: item.querySelector('title')?.textContent || 'Untitled Episode',
          audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
          duration: item.querySelector('itunes\\:duration')?.textContent,
          imageUrl: getEpisodeImage(item),
          pubDate: new Date(item.querySelector('pubDate')?.textContent || '').getTime()
        };
      });
      
      // Sort episodes by publication date (ascending - oldest first)
      episodes.sort((a, b) => a.pubDate - b.pubDate);
      
      episodeListTitle.textContent = `Episodes (${episodes.length})`;
      
      episodes.forEach(episode => {
        const episodeElement = createEpisodeElement(episode);
        episodeListContainer.appendChild(episodeElement);
      });
      
      // Load first (oldest) episode
      if (episodes.length > 0) {
        const firstEpisode = episodes[0];
        audio.src = firstEpisode.audioUrl;
        episodeTitle.textContent = firstEpisode.title;
        featuredImage.src = firstEpisode.imageUrl;
        episodeListContainer.firstChild.classList.add('episode-active');
        episodeListContainer.firstChild.style.backgroundColor = '#f9fafb';
      }
    } catch (error) {
      console.error('Error loading podcast feed:', error);
      episodeListContainer.innerHTML = '<div style="padding: 20px; color: #ef4444;">Error loading podcast feed</div>';
    }
  };
  
  // Audio event listeners
  audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    progress.style.width = `${(currentTime / duration) * 100}%`;
    timeDisplay.firstChild.textContent = formatDuration(Math.floor(currentTime));
    timeDisplay.lastChild.textContent = formatDuration(Math.floor(duration));
  });
  
  audio.addEventListener('ended', () => {
    playButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
  });
  
  // Progress bar click handler
  progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  });
  
  // Play/Pause button handler
  playButton.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
    } else {
      audio.pause();
      playButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    }
  });
  
  // Assemble the player
  container.appendChild(imageContainer);
  container.appendChild(playerContainer);
  
  playerContainer.appendChild(episodeTitle);
  playerContainer.appendChild(audioContainer);
  playerContainer.appendChild(episodeList);
  
  episodeList.appendChild(episodeListTitle);
  episodeList.appendChild(episodeListContainer);
  
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
