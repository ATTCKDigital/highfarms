const CACHE_KEY = 'game_start_timestamp';

export function getGameStartTimestamp(): number {
  // Try to get from application cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    return parseInt(cached, 10);
  }

  // If not found, create new timestamp
  const timestamp = Date.now();
  localStorage.setItem(CACHE_KEY, timestamp.toString());
  return timestamp;
}

export function updateCacheManifest(timestamp: number) {
  const manifest = document.querySelector('html')?.getAttribute('manifest');
  if (manifest) {
    const comment = `# Game started: ${new Date(timestamp).toISOString()}`;
    fetch(manifest)
      .then(response => response.text())
      .then(content => {
        const updatedContent = content.replace(
          /# Game started:.*$/m,
          comment
        );
        // Update manifest through service worker if available
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.controller?.postMessage({
            type: 'UPDATE_MANIFEST',
            content: updatedContent
          });
        }
      })
      .catch(console.error);
  }
}