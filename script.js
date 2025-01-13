let tokenData = []; // Tüm token verilerini tutacağız
let currentTokenIndex = 0; // Sayfalama için token index'i

// API'den token verilerini alıyoruz
async function fetchTokenProfiles() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
            method: 'GET',
            headers: {},
        });

        const data = await response.json();
        console.log(data); // Gelen veriyi kontrol ediyoruz

        // Yeni token'ları global tokenData dizisine ekliyoruz
        tokenData = [...data, ...tokenData]; // Yeni token'lar en üstte olacak şekilde ekleniyor

        // Token'ları görüntüle
        displayTokenProfiles();
    } catch (error) {
        console.error("API hatası:", error);
    }
}

// Token'ları sayfada göster
function displayTokenProfiles() {
    const tokenList = document.getElementById('token-list');

    // Listemizi temizliyoruz, böylece her yeni sorgu sonrası eski veriler silinir
    tokenList.innerHTML = '';

    // Token verilerinin her birini ekleyelim
    tokenData.forEach(token => {
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
        tokenInfo.appendChild(tokenDescription);
        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddressContainer);
        tokenInfo.appendChild(tokenLink);

        tokenCard.appendChild(tokenIcon);
        tokenCard.appendChild(tokenInfo);

        tokenList.appendChild(tokenCard);
    });
}

// Sayfa yüklendikçe veri sorgulamak için interval
setInterval(fetchTokenProfiles, 1000);

// Başlangıçta token profillerini çekiyoruz
fetchTokenProfiles();
