let tokenData = [];
let currentTokenIndex = 0;

async function fetchTokenProfiles() {
    try {
        document.getElementById('loading').style.display = 'block'; // Yükleme göstergesi açılır
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', { method: 'GET' });
        const data = await response.json();

        // Yeni token'ları ekle
        tokenData = [...tokenData, ...data];

        // Verileri ekranda göster
        displayTokenProfiles();

        document.getElementById('loading').style.display = 'none'; // Yükleme göstergesi kapanır
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayTokenProfiles() {
    const tokenList = document.getElementById('token-list');
    tokenList.innerHTML = '';

    const tokensToShow = tokenData.slice(currentTokenIndex, currentTokenIndex + 20);
    tokensToShow.forEach(token => {
        const tokenCard = document.createElement('div');
        tokenCard.classList.add('token-card');

        // Icon
        const tokenIcon = document.createElement('img');
        tokenIcon.src = token.icon;
        tokenIcon.alt = 'Token Icon';

        const tokenInfo = document.createElement('div');
        
        // ChainId ve Token Address
        const chainId = document.createElement('p');
        chainId.innerText = `CHAIN: ${token.chainId ? token.chainId.toUpperCase() : 'N/A'}`;
        
        const tokenAddress = document.createElement('p');
        tokenAddress.innerText = `Token Address: ${token.tokenAddress || 'N/A'}`;
        tokenAddress.title = token.tokenAddress;

        const description = document.createElement('p');
        description.innerText = `"${token.description || 'No description available.'}"`;

        const buyTokenLink = document.createElement('a');
        buyTokenLink.href = token.url;
        buyTokenLink.target = '_blank';
        buyTokenLink.innerText = 'BUY TOKEN';

        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddress);
        tokenInfo.appendChild(description);
        tokenInfo.appendChild(buyTokenLink);

        tokenCard.appendChild(tokenIcon);
        tokenCard.appendChild(tokenInfo);

        tokenList.appendChild(tokenCard);
    });
}

setInterval(fetchTokenProfiles, 1000); // Her saniye veri çekecek

fetchTokenProfiles();
