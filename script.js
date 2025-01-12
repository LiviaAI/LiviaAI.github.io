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

        // Display the latest tokens
        displayTokenProfiles();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Display the latest tokens on the page
function displayTokenProfiles() {
    const tokenList = document.getElementById('token-list');

    // Add a slight delay and smooth transition for new token addition
    tokenList.style.transition = 'all 0.5s ease-in-out';
    
    // Slice the token data to show only the latest 20 tokens
    const tokensToShow = tokenData.slice(currentTokenIndex, currentTokenIndex + 20);
    tokensToShow.forEach(token => {
        const tokenCard = document.createElement('div');
        tokenCard.classList.add('token-card');

        // Token icon
        const tokenIcon = document.createElement('img');
        tokenIcon.src = token.icon || 'default-icon.png'; // Default icon if not available
        tokenIcon.alt = 'Token Icon';

        // Token details
        const tokenInfo = document.createElement('div');
        const tokenName = document.createElement('h3');
        tokenName.innerText = token.tokenAddress || 'Token Address Unavailable';
        const tokenDescription = document.createElement('p');
        tokenDescription.innerText = token.description || 'No description available.';

        // Show chainId, tokenAddress and other details
        const chainId = document.createElement('p');
        chainId.innerText = `Chain: ${token.chainId ? token.chainId.toUpperCase() : 'N/A'}`;

        const tokenAddress = document.createElement('p');
        tokenAddress.innerText = `Token Address: ${token.tokenAddress || 'N/A'}`;
        tokenAddress.classList.add('token-address'); // Adding a class for styling

        // Link to token details (if exists)
        const tokenLink = document.createElement('a');
        tokenLink.href = token.url || '#';
        tokenLink.target = '_blank';
        tokenLink.innerText = 'Official Website';

        // Append elements to tokenCard
        tokenInfo.appendChild(tokenName);
        tokenInfo.appendChild(tokenDescription);
        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddress);
        tokenInfo.appendChild(tokenLink);

        tokenCard.appendChild(tokenIcon);
        tokenCard.appendChild(tokenInfo);

        // Append the card to the token list
        tokenList.appendChild(tokenCard);
    });
    
    // Update the index to show the next batch of tokens
    currentTokenIndex += 20;
}

// Periodically fetch and update token profiles every 1 second (60 times per minute)
setInterval(fetchTokenProfiles, 1000); // Changed to 1 second interval

// Initially fetch token profiles
fetchTokenProfiles();

// Smooth scrolling and animation for adding new tokens
window.addEventListener('scroll', function() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    // If we're at the bottom of the page, load more tokens
    if (scrollPosition >= pageHeight - 10) {
        // Load more tokens by triggering the display function
        displayTokenProfiles();
    }
});
