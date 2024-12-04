(function() {
  const container = document.createElement('div');
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
  
  iframe.src = `${window.location.origin}/embed/${embedId}`;
  iframe.style.width = '100%';
  iframe.style.height = '800px'; // Increased height to accommodate episode list
  iframe.style.border = '1px solid #e2e8f0'; // Added subtle border
  iframe.style.borderRadius = '8px';
  iframe.allow = 'autoplay';
  
  container.appendChild(iframe);
  
  if (scriptTag && scriptTag.parentNode) {
    scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
  }
})();
