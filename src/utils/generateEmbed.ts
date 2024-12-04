export const generateEmbedScript = (embedId: string, host: string) => {
  return `
// Prevent multiple initializations
if (!window.audioPlayerInitialized) {
  window.audioPlayerInitialized = true;
  
  (function() {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.maxWidth = '800px';
    container.style.margin = '0 auto';
    
    const iframe = document.createElement('iframe');
    iframe.src = '${host}/embed/${embedId}';
    iframe.style.width = '100%';
    iframe.style.height = '800px';
    iframe.style.border = '1px solid #e2e8f0';
    iframe.style.borderRadius = '8px';
    iframe.allow = 'autoplay';
    
    container.appendChild(iframe);
    
    const scriptTag = document.currentScript;
    if (scriptTag && scriptTag.parentNode) {
      scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
    }
  })();
}
  `.trim();
};