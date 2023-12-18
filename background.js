// Constants for Last.fm API and storage keys
const API_KEY = 'b98a3d70bccdb61317558cd66d6e0c35'; // Replace with your Last.fm API key
const LAST_FM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const STORAGE_KEY = 'timerInterval';

// Function to periodically fetch music recommendations
function fetchRecommendationsPeriodically() {
  setInterval(async () => {
    try {
      const response = await fetch(
        `${LAST_FM_API_URL}?method=chart.gettoptracks&api_key=${API_KEY}&format=json`
      );
      const data = await response.json();
      const recommendations = data.tracks.track; // Adjust parsing based on Last.fm API response structure
      
      // Update storage with fetched recommendations (example)
      chrome.storage.sync.set({ recommendations }, () => {
        console.log('Recommendations updated:', recommendations);
      });

      // Notify the extension's components (if needed) about new recommendations
      chrome.runtime.sendMessage({ type: 'recommendationsUpdated', recommendations });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  }, 60000); // Fetch recommendations every minute (adjust as needed)
}

// Execute tasks when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  fetchRecommendationsPeriodically(); // Start periodic fetching of recommendations
});

// Example: Handle user preference updates for timer interval
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && STORAGE_KEY in changes) {
    const newInterval = changes[STORAGE_KEY].newValue;
    console.log('New timer interval set:', newInterval);

    // Update the interval for periodic fetching (example)
    clearInterval(fetchRecommendationsPeriodically); // Clear previous interval
    fetchRecommendationsPeriodically(); // Start a new interval with the updated time
  }
});
