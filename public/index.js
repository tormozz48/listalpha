/* eslint-disable */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Frontend JavaScript loaded successfully');

  // Get the search input element
  const searchInput = document.querySelector('.search-box');

  // Add keydown event listener
  searchInput.addEventListener('keydown', async (event) => {
    // Check for Enter key (keyCode 13)
    if (event.keyCode === 13) {
      // Clear previous content
      const contentPanel = document.querySelector('.content-panel');
      contentPanel.innerHTML = '';

      // Disable search input while processing
      searchInput.disabled = true;

      const searchValue = searchInput.value;
      await processString(searchValue);

      // Re-enable search input after processing
      searchInput.disabled = false;
    }
  });

  // Trigger search on page load with initial value
  const initialSearchValue = searchInput.value;
  if (initialSearchValue) {
    processString(initialSearchValue);
  }
});

// Function to send search request to backend
async function processString(searchValue) {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchValue }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('recieve data');
    console.log(data);

    // Create main content container
    const contentPanel = document.querySelector('.content-panel');
    contentPanel.innerHTML = '';

    // Process each competitor in the array
    data.forEach((competitor) => {
      // Create competitor card container
      const competitorCard = document.createElement('div');
      competitorCard.className = 'competitor-card';

      // Create and append logo
      const logo = document.createElement('img');
      logo.className = 'competitor-logo';
      logo.src = competitor.logo;
      logo.alt = `${competitor.name} logo`;
      competitorCard.appendChild(logo);

      // Create competitor info container
      const competitorInfo = document.createElement('div');
      competitorInfo.className = 'competitor-info';

      // Create and append name
      const name = document.createElement('div');
      name.className = 'competitor-name';
      name.textContent = competitor.name;
      competitorInfo.appendChild(name);

      // Create and append website
      const website = document.createElement('div');
      website.className = 'competitor-website';
      website.textContent = competitor.website;
      competitorInfo.appendChild(website);

      // Create and append description
      const description = document.createElement('div');
      description.className = 'competitor-description';
      description.textContent = competitor.description;
      competitorInfo.appendChild(description);

      // Append competitor info to card
      competitorCard.appendChild(competitorInfo);

      // Append card to content panel
      contentPanel.appendChild(competitorCard);
    });
  } catch (error) {
    console.error('Error processing search:', error);
    // TODO: Handle errors (e.g., show error message to user)
  }
}
