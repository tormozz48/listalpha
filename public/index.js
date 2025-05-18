/* eslint-disable */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Frontend JavaScript loaded successfully');

  const searchInput = document.querySelector('.search-box');

  searchInput.addEventListener('keydown', async (event) => {
    if (event.keyCode === 13) {
      const contentPanel = document.querySelector('.content-panel');
      contentPanel.innerHTML = '';

      searchInput.disabled = true;
      const searchValue = searchInput.value;
      await processString(searchValue);
      searchInput.disabled = false;
    }
  });

  const initialSearchValue = searchInput.value;
  if (initialSearchValue) {
    processString(initialSearchValue);
  }
});

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

    const { competitors: data } = await response.json();
    console.log(data);
    const contentPanel = document.querySelector('.content-panel');
    contentPanel.innerHTML = '';

    data.forEach((competitor) => {
      const competitorCard = document.createElement('div');
      competitorCard.className = 'competitor-card';

      const logoContainer = document.createElement('div');
      logoContainer.className = 'logo-container';

      const logo = document.createElement('img');
      logo.className = 'competitor-logo';
      logo.src = competitor.logo;
      logo.alt = `${competitor.name} logo`;
      logoContainer.appendChild(logo);

      const score = document.createElement('div');
      score.className = 'competitor-score';
      score.textContent = `${(competitor.score * 100).toFixed(0)}%`;
      logoContainer.appendChild(score);

      competitorCard.appendChild(logoContainer);

      const competitorInfo = document.createElement('div');
      competitorInfo.className = 'competitor-info';

      const name = document.createElement('div');
      name.className = 'competitor-name';
      name.textContent = competitor.name;
      competitorInfo.appendChild(name);

      const website = document.createElement('div');
      website.className = 'competitor-website';
      website.textContent = competitor.website;
      competitorInfo.appendChild(website);

      const description = document.createElement('div');
      description.className = 'competitor-description';
      description.textContent = competitor.description;
      competitorInfo.appendChild(description);

      competitorCard.appendChild(competitorInfo);
      contentPanel.appendChild(competitorCard);
    });
  } catch (error) {
    console.error('Error processing search:', error);
  }
}
