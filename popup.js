let recommendations = []; // Array to hold recommendations fetched from Last.fm API


// Constants for Last.fm API and storage keys
const API_KEY = 'b98a3d70bccdb61317558cd66d6e0c35'; // Replace with your Last.fm API key
const LAST_FM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const STORAGE_KEY = 'timerInterval';

// Function to fetch music recommendations from Last.fm
async function fetchMusicRecommendations() {
  try {
    const response = await fetch(
      `${LAST_FM_API_URL}?method=chart.gettoptracks&api_key=${API_KEY}&format=json`
    );
    const data = await response.json();
    return data.tracks.track; // Adjust parsing based on Last.fm API response structure
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}
// Function to display a single recommendation
function displaySingleRecommendation(recommendationIndex) {
  const recommendationContainer = document.getElementById('recommendation-container');
  recommendationContainer.innerHTML = '';

  const track = recommendations[recommendationIndex];
  const trackElement = document.createElement('div');
  trackElement.classList.add('track', 'card');

  const trackInfo = `
    <img src="${track.image[0]?.['#text'] || 'placeholder.jpg'}" class="card-img-top" alt="${track.name}">
    <div class="card-body">
      <h5 class="card-title">${track.artist.name} - ${track.name}</h5>
      <p class="card-text">Album: ${track.album?.['#text'] || 'Unknown Album'} (${track.date?.['#text'] || 'Unknown Year'})</p>
    </div>
  `;

  trackElement.innerHTML = trackInfo;
  recommendationContainer.appendChild(trackElement);
}

// Function to show a random recommendation
function showRandomRecommendation() {
  const randomIndex = Math.floor(Math.random() * recommendations.length);
  displaySingleRecommendation(randomIndex);
}

// Show a random recommendation when the extension opens
document.addEventListener('DOMContentLoaded', () => {
  // Fetch recommendations from Last.fm API
  fetchMusicRecommendations().then((data) => {
    recommendations = data;
    showRandomRecommendation(); // Display a random recommendation on load
  }).catch((error) => {
    console.error('Error fetching recommendations:', error);
  });
});

// Event listener for the "Show Recommendation" button
document.getElementById('show-recommendation-btn').addEventListener('click', showRandomRecommendation);
