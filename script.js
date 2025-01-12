let tokenData = [];
let currentTokenIndex = 0;

async function fetchTokenProfiles() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', { method: 'GET' });
        const data = await response.json();

        // Yeni token'ları ekle
        tokenData = [...tokenData, ...data];

        // Verileri ekranda göster
        displayTokenProfiles();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayTokenProfiles() {
    const tokenList = document.getElementById('token-list');

    const tokensToShow = tokenData.slice(currentTokenIndex, currentTokenIndex + 20);
    tokensToShow.forEach(token => {
        const tokenCard = document.createElement('div');
        tokenCard.classList.add('token-card');

        // Token icon
        const tokenIcon = document.createElement('img');
        tokenIcon.src = token.icon;
        tokenIcon.alt = 'Token Icon';

        const tokenInfo = document.createElement('div');
        
        // ChainId ve Token Address
        const chainId = document.createElement('p');
        chainId.innerText = `CHAIN: ${token.chainId ? token.chainId.toUpperCase() : 'N/A'}`;
        
        const tokenAddressContainer = document.createElement('div');
        const tokenAddress = document.createElement('p');
        tokenAddress.innerText = `Token Address: ${token.tokenAddress || 'N/A'}`;
        tokenAddress.title = token.tokenAddress;

        const copyButton = document.createElement('span');
        copyButton.classList.add('copy-button');
        copyButton.innerText = 'Copy';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(token.tokenAddress);
        };

        tokenAddressContainer.appendChild(tokenAddress);
        tokenAddressContainer.appendChild(copyButton);

        const description = document.createElement('p');
        description.innerText = `"${token.description || 'No description available.'}"`;

        // Links
        token.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = '_blank';
            linkElement.innerText = link.label.charAt(0).toUpperCase() + link.label.slice(1);
            tokenInfo.appendChild(linkElement);
        });

        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddressContainer);
        tokenInfo.appendChild(description);

        tokenCard.appendChild(tokenIcon);
        tokenCard.appendChild(tokenInfo);

        tokenList.appendChild(tokenCard);
    });

    // Scroll sonrası yeni token'lar için indexi güncelle
    currentTokenIndex += 20;
}

setInterval(fetchTokenProfiles, 1000); // Her saniye veri çekecek

fetchTokenProfiles();
