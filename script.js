let tokenData = []; // Tüm token verileri
let currentTokenIndex = 0; // Sayfalama için indeks takip

// API'den token profil verilerini alıyoruz
async function fetchTokenProfiles() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
            method: 'GET',
            headers: {},
        });

        const data = await response.json();
        console.log('Fetched data:', data); // API'den gelen veriyi konsola yazdırıyoruz

        // Eğer veri gelirse, token verilerini diziye ekle
        if (data && Array.isArray(data)) {
            tokenData = [...tokenData, ...data]; // Yeni token verilerini ekle
            displayTokenProfiles(); // Veriyi sayfada göster
        } else {
            console.error('Token verisi alınamadı veya veri formatı yanlış');
        }
    } catch (error) {
        console.error("API hatası:", error);
    }
}

// Sayfada token'ları gösterme
function displayTokenProfiles() {
    const tokenList = document.getElementById('token-list');
    
    // Her seferinde token-list içeriğini temizle (yeni veri eklenirken eski veriyi sil)
    tokenList.innerHTML = '';

    // En son 20 token'i göster
    const tokensToShow = tokenData.slice(currentTokenIndex, currentTokenIndex + 20);
    tokensToShow.forEach(token => {
        const tokenCard = document.createElement('div');
        tokenCard.classList.add('token-card');

        // Token ikonu
        const tokenIcon = document.createElement('img');
        tokenIcon.src = token.icon || 'default-icon.png'; // Varsayılan bir ikon kullan
        tokenIcon.alt = 'Token Icon';

        // Token detayları
        const tokenInfo = document.createElement('div');
        
        // Token adı
        const tokenName = document.createElement('h3');
        tokenName.innerText = token.tokenAddress || 'Token Address Unavailable';

        // Token açıklaması
        const tokenDescription = document.createElement('p');
        tokenDescription.innerText = token.description || 'No description available.';
        
        // Chain ID ve token adresi
        const chainId = document.createElement('p');
        chainId.innerText = `Chain: ${token.chainId ? token.chainId.toUpperCase() : 'N/A'}`;
        
        const tokenAddress = document.createElement('p');
        tokenAddress.innerText = `Token Address: ${token.tokenAddress || 'N/A'}`;
        tokenAddress.classList.add('token-address'); // Kopyalama için class ekliyoruz

        // Token linki (buy token vs.)
        const tokenLink = document.createElement('a');
        tokenLink.href = token.url || '#';
        tokenLink.target = '_blank';
        tokenLink.innerText = 'Official Website';

        // Token linklerini al ve ekle
        if (token.links && Array.isArray(token.links)) {
            token.links.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = link.url || '#';
                linkElement.target = '_blank';
                linkElement.innerText = link.label.charAt(0).toUpperCase() + link.label.slice(1);
                tokenInfo.appendChild(linkElement);
            });
        }

        // Token bilgilerini ekle
        tokenInfo.appendChild(tokenName);
        tokenInfo.appendChild(tokenDescription);
        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddress);
        tokenInfo.appendChild(tokenLink);

        // Token kartını tamamla ve sayfada göster
        tokenCard.appendChild(tokenIcon);
        tokenCard.appendChild(tokenInfo);

        // Token kartını ekleyin
        tokenList.appendChild(tokenCard);
    });

    // Sayfalama için indeks artırma
    currentTokenIndex += 20;
}

// API verilerini saniyede 1 kez alıyoruz (60 kez bir dakika içinde)
setInterval(fetchTokenProfiles, 1000); // 1000 ms, yani 1 saniye

// Sayfa yüklendiğinde hemen API verilerini çek
fetchTokenProfiles();

// Sayfada aşağı kaydırma olduğunda yeni token'ları yükleme
window.addEventListener('scroll', function() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 10) {
        // Eğer sayfa sonuna geldiysek yeni token'ları göster
        displayTokenProfiles();
    }
});
