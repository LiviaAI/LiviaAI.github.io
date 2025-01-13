let tokenData = []; // Tüm token verileri
let currentTokenIndex = 0; // Sayfalama için indeks

// Token profil verilerini API'den al
async function fetchTokenProfiles() {
    try {
        // API'den 20 token çek
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1');
        const data = await response.json();

        // Token'ları eklerken, daha önce eklenmiş olanlardan tekrarlamamak için filtrele
        data.forEach(newToken => {
            if (!tokenData.some(existingToken => existingToken.tokenAddress === newToken.tokenAddress)) {
                tokenData.push(newToken);  // Yeni token'ı ekle
            }
        });

        // Token'ları ekranda göster
        displayTokenProfiles();
    } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
    }
}

// Token'ları sayfada göster
function displayTokenProfiles() {
    const tokenList = document.getElementById('token-list');

    // Sayfa her 20 token sorgusu sonunda, token'ları güncelle
    const tokensToShow = tokenData.slice(currentTokenIndex, currentTokenIndex + 20);  // 20 token göster

    tokensToShow.forEach(token => {
        const tokenCard = document.createElement('div');
        tokenCard.classList.add('token-card');
        tokenCard.style.animation = "fadeIn 0.5s forwards";  // Animasyon ekle

        // Token ikonu
        const tokenIcon = document.createElement('img');
        tokenIcon.src = token.icon || '';  // Eğer ikon yoksa boş bırak
        tokenIcon.alt = 'Token Icon';

        // Token bilgileri
        const tokenInfo = document.createElement('div');
        const tokenName = document.createElement('h3');
        tokenName.innerText = token.tokenAddress ? token.tokenAddress : 'Token Address Unavailable';  // Eğer adres yoksa uygun metin
        const tokenDescription = document.createElement('p');
        tokenDescription.innerText = `Description: "${token.description || 'No description available.'}"`;

        // Chain ID ve Token Adresi
        const chainId = document.createElement('p');
        chainId.innerText = `Chain: ${token.chainId ? token.chainId.toUpperCase() : 'N/A'}`;

        const tokenAddress = document.createElement('p');
        tokenAddress.classList.add('token-address-container');
        tokenAddress.innerHTML = `Token Address: <span class="copy-token">${token.tokenAddress || 'N/A'}</span>`;

        // Buy Token Link
        const buyTokenLink = document.createElement('a');
        buyTokenLink.href = token.url || '#';
        buyTokenLink.target = '_blank';
        buyTokenLink.innerText = 'BUY TOKEN';

        // Token adresi üzerine gelindiğinde kopyalama butonu göster
        const copyButton = document.createElement('span');
        copyButton.classList.add('copy-button');
        copyButton.innerText = 'Copy';
        copyButton.onclick = () => copyToClipboard(token.tokenAddress);

        // Token bilgilerini bir arada tut
        tokenInfo.appendChild(tokenName);
        tokenInfo.appendChild(tokenDescription);
        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddress);
        tokenInfo.appendChild(buyTokenLink);

        tokenCard.appendChild(tokenIcon);
        tokenCard.appendChild(tokenInfo);
        tokenCard.appendChild(copyButton);

        // Yeni token'ı listenin başına ekle
        tokenList.appendChild(tokenCard);  // Yeni token'ı sona ekle
    });

    // Sayfa her token eklendiğinde currentTokenIndex'i arttır
    currentTokenIndex += tokensToShow.length;
}

// Token adresini kopyala
function copyToClipboard(address) {
    if (address) {
        const el = document.createElement('textarea');
        el.value = address;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('Token Address copied!');
    } else {
        alert('No address to copy');
    }
}

// Sayfada yeni tokenlar eklendikçe, scroll ile daha fazla yükleyebilmek için
function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    // Sayfanın altına gelindiğinde yeni tokenları yükle
    if (scrollPosition >= pageHeight - 10) {
        // Sayfada yeni tokenlar var mı?
        if (currentTokenIndex < tokenData.length) {
            displayTokenProfiles();  // Yeni tokenları göster
        } else {
            console.log('Gösterilecek başka token yok.');
        }
    }
}

// Sayfa her saniye token verisi çekecek şekilde ayarla (dakikada 60 istek)
setInterval(fetchTokenProfiles, 1000);

// İlk başta token verilerini çek
fetchTokenProfiles();

// Sayfa kaydırıldığında daha fazla token yükle
window.addEventListener('scroll', handleScroll);
