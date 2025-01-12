// Fetch token profile data from API
async function fetchTokenProfiles() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
            method: 'GET',
            headers: {},
        });

        const data = await response.json();
        console.log(data); // Check the fetched data

        // Add new tokens to the webpage
        displayTokenProfiles(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Display the token profiles on the page
function displayTokenProfiles(data) {
    const tokenList = document.getElementById('token-list');
    
    if (Array.isArray(data)) {
        data.forEach(token => {
            const tokenCard = document.createElement('div');
            tokenCard.classList.add('token-card');

            // Token icon
            const tokenIcon = document.createElement('img');
            tokenIcon.src = token.icon;
            tokenIcon.alt = 'Token Icon';

            // Token details
            const tokenInfo = document.createElement('div');
            const tokenName = document.createElement('h3');
            tokenName.innerText = token.tokenAddress || 'Token Address Unavailable';
            const tokenDescription = document.createElement('p');
            tokenDescription.innerText = token.description || 'No description available.';

            // Link to token details
            const tokenLink = document.createElement('a');
            tokenLink.href = token.url;
            tokenLink.target = '_blank';
            tokenLink.innerText = 'Dexscreener';

            tokenInfo.appendChild(tokenName);
            tokenInfo.appendChild(tokenDescription);
            tokenInfo.appendChild(tokenLink);
            
            tokenCard.appendChild(tokenIcon);
            tokenCard.appendChild(tokenInfo);

            // Add new token to the top of the list
            tokenList.insertBefore(tokenCard, tokenList.firstChild);
        });
    } else {
        console.error('Invalid data format received.');
    }
}

// Periodically fetch and update token profiles every second (60 times per minute)
setInterval(fetchTokenProfiles, 1000);

// Initially fetch token profiles
fetchTokenProfiles();
