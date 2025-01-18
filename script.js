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

        // Contract Address
        const contractAddress = document.createElement('p');
        contractAddress.innerText = `Contract Address: ${token.tokenAddress || 'N/A'}`;

        // Chain Id bilgisi
        const chainId = document.createElement('p');
        chainId.innerText = `Chain: ${token.chainId.toUpperCase() || 'N/A'}`;

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
        tokenAddressContainer.appendChild(copyButton);

        // Buy Token linki
        const tokenLink = document.createElement('a');
        tokenLink.href = token.url;
        tokenLink.target = '_blank';
        tokenLink.innerText = 'Buy Token';

        tokenInfo.appendChild(tokenName);
        tokenInfo.appendChild(contractAddress);  // Contract Address burada eklendi
        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddressContainer);
        tokenInfo.appendChild(tokenLink);

        // Links kısmını ekleyelim (örneğin, Website, Twitter, Telegram)
        if (token.links && token.links.length > 0) {
            const linksContainer = document.createElement('div');
            linksContainer.classList.add('token-links');

            // Linkleri düzenli göster
            token.links.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.target = '_blank';

                // Eğer link türü undefined ise "Visit Website" yazsın
                if (link.type === "undefined") {
                    linkElement.innerText = "Visit Website";
                } else {
                    linkElement.innerText = `Visit ${link.type.charAt(0).toUpperCase() + link.type.slice(1)}`;
                }

                linksContainer.appendChild(linkElement);

                // Linkler arasında boşluk ekleyelim
                linksContainer.appendChild(document.createTextNode(' - '));
            });

            // Sonundaki boşluğu temizle
            if (linksContainer.lastChild === document.createTextNode(' - ')) {
                linksContainer.removeChild(linksContainer.lastChild);
            }

            tokenInfo.appendChild(linksContainer);
        }

        // Token description kısmı
        const tokenDescription = document.createElement('p');
        tokenDescription.innerText = token.description || 'No description available.';
        tokenInfo.appendChild(tokenDescription);

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
