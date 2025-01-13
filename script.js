let tokenData = []; // Token verileri burada tutulacak

// Sayfa yüklendiğinde son 10 token'ı al
async function fetchInitialTokenProfiles() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
            method: 'GET',
            headers: {},
        });

        const data = await response.json();
        
        // Son 10 token'ı sayfada göster
        if (data && data.length > 0) {
            tokenData = data.slice(0, 10); // Son 10 token
            displayTokenProfiles(); // Tokenları görüntüle
        }

    } catch (error) {
        console.error("API hatası:", error);
    }
}

// Token URL'lerinden "Token Symbol" almak için fonksiyon
async function fetchTokenSymbol(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        
        // Sayfa içeriğini bir DOM'a çeviriyoruz
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // "chakra-heading custom" sınıfına sahip bir öğe arıyoruz
        const headingElement = doc.querySelector('[class*="chakra-heading custom"]');
        
        if (headingElement) {
            // Title bilgisini alıyoruz
            const tokenSymbol = headingElement.getAttribute('title');
            return tokenSymbol || 'N/A'; // Eğer title yoksa 'N/A' döndür
        } else {
            return 'N/A'; // Eğer token symbol bulunamazsa
        }
    } catch (error) {
        console.error("Sayfa içeriği alınırken hata oluştu:", error);
        return 'N/A';
    }
}

// Token'ları sayfada göster
async function displayTokenProfiles() {
    const tokenList = document.getElementById('token-list');
    tokenList.innerHTML = ''; // Listemizi temizliyoruz

    // Token verilerinin her birini ekleyelim
    for (const token of tokenData) {
        const tokenCard = document.createElement('div');
        tokenCard.classList.add('token-card');

        // Token icon'u
        const tokenIcon = document.createElement('img');
        tokenIcon.src = token.icon;
        tokenIcon.alt = 'Token Icon';

        // Token bilgileri
        const tokenInfo = document.createElement('div');
        const tokenName = document.createElement('h3');
        tokenName.innerText = token.tokenAddress || 'Token Address Unavailable';

        const tokenSymbol = document.createElement('p'); // Token Symbol
        tokenSymbol.innerText = `Token Symbol: ${await fetchTokenSymbol(token.url)}`;

        const tokenDescription = document.createElement('p');
        tokenDescription.innerText = `"${token.description || 'No description available.'}"`;

        // Chain Id ve tokenAddress bilgileri
        const chainId = document.createElement('p');
        chainId.innerText = `Chain: ${token.chainId.toUpperCase() || 'N/A'}`;

        const tokenAddress = document.createElement('p');
        tokenAddress.innerText = `Token Address: ${token.tokenAddress || 'N/A'}`;

        // Copy butonu
        const copyButton = document.createElement('span');
        copyButton.innerText = 'Copy';
        copyButton.classList.add('copy-button');
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(token.tokenAddress);
            alert('Token Address copied to clipboard!');
        });

        const tokenAddressContainer = document.createElement('div');
        tokenAddressContainer.classList.add('token-address-container');
        tokenAddressContainer.appendChild(tokenAddress);
        tokenAddressContainer.appendChild(copyButton);

        // Buy Token linki
        const tokenLink = document.createElement('a');
        tokenLink.href = token.url;
        tokenLink.target = '_blank';
        tokenLink.innerText = 'Buy Token';

        tokenInfo.appendChild(tokenName);
        tokenInfo.appendChild(tokenSymbol); // Token symbol'ü ekliyoruz
        tokenInfo.appendChild(tokenDescription);
        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddressContainer);
        tokenInfo.appendChild(tokenLink);

        tokenCard.appendChild(tokenIcon);
        tokenCard.appendChild(tokenInfo);

        tokenList.appendChild(tokenCard);
    }
}

// Yeni token'ı kontrol et ve sayfada daha önce yoksa ekle
async function checkNewToken() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
            method: 'GET',
            headers: {},
        });

        const data = await response.json();

        // En son gelen token
        const newToken = data[0];

        // Yeni token daha önce eklenmiş mi?
        const tokenExists = tokenData.some(token => token.tokenAddress === newToken.tokenAddress);
        
        // Eğer yeni token daha önce eklenmemişse, ekle
        if (!tokenExists) {
            tokenData.unshift(newToken); // En üstte ekle
            displayTokenProfiles(); // Tokenları tekrar göster
        }
    } catch (error) {
        console.error("API hatası:", error);
    }
}

// İlk başta son 10 token'ı çek
fetchInitialTokenProfiles();

// Her saniye yeni token'ları kontrol et
setInterval(checkNewToken, 1000);
