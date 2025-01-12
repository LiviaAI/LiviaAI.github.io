let tokenData = []; // All fetched token data
let currentTokenIndex = 0; // Track the index for pagination

// Fetch token profile data from API
async function fetchTokenProfiles() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
            method: 'GET',
            headers: {},
        });

        const data = await response.json();
        console.log(data); // Log the fetched data to inspect it

        // Add new tokens to the global tokenData array
        tokenData = [...tokenData, ...data]; 

        // Display the latest 20 tokens
        displayTokenProfiles();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Display the latest 20 token profiles on the page
function displayTokenProfiles() {
    const tokenList = document.getElementById('token-list');

    // Clear the list before appending new tokens (to handle scrolling and token limit)
    tokenList.innerHTML = '';

    // Slice the token data to show only the last 20 tokens
    const tokensToShow = tokenData.slice(currentTokenIndex, currentTokenIndex + 20);
    tokensToShow.forEach(token => {
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

        // Show chainId, tokenAddress and other details
        const chainId = document.createElement('p');
        chainId.innerText = `Chain ID: ${token.chainId || 'N/A'}`;

        const tokenAddress = document.createElement('p');
        tokenAddress.innerText = `Token Address: ${token.tokenAddress || 'N/A'}`;

        // Link to token details
        const tokenLink = document.createElement('a');
        tokenLink.href = token.url;
        tokenLink.target = '_blank';
        tokenLink.innerText = 'Official Website';

        tokenInfo.appendChild(tokenName);
        tokenInfo.appendChild(tokenDescription);
        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddress);
        tokenInfo.appendChild(tokenLink);

        tokenCard.appendChild(tokenIcon);
        tokenCard.appendChild(tokenInfo);

        tokenList.appendChild(tokenCard);
    });
}

// Handle scrolling to load more tokens when scrolled to the bottom
function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    // If we're at the bottom of the page, load more tokens
    if (scrollPosition >= pageHeight - 10) {
        // Update the index to show the next batch of 20 tokens
        currentTokenIndex += 20;
        
        // If there are more tokens to show, fetch and append
        if (currentTokenIndex < tokenData.length) {
            displayTokenProfiles();
        } else {
            console.log('No more tokens to display.');
        }
    }
}

// Periodically fetch and update token profiles every second (60 times per minute)
setInterval(fetchTokenProfiles, 1000);

// Initially fetch token profiles
fetchTokenProfiles();

// Listen for scroll events to handle infinite scrolling
window.addEventListener('scroll', handleScroll);
