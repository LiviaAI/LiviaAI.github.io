// Token profil verilerini al
async function fetchTokenProfiles() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
            method: 'GET',
            headers: {},
        });

        const data = await response.json();
        console.log(data); // Burada gelen veriyi kontrol edebilirsiniz

        // Yeni token'ları sayfaya ekle
        displayTokenProfiles(data);
    } catch (error) {
        console.error("Veri alınırken bir hata oluştu:", error);
    }
}

// Token profil bilgilerini ekrana yerleştir
function displayTokenProfiles(data) {
    const tokenList = document.getElementById('token-list');
    
    if (Array.isArray(data)) {
        data.forEach(token => {
            const tokenCard = document.createElement('div');
            tokenCard.classList.add('token-card');

            // Token simgesi
            const tokenIcon = document.createElement('img');
            tokenIcon.src = token.icon;
            tokenIcon.alt = 'Token Icon';

            // Token başlığı ve açıklaması
            const tokenInfo = document.createElement('div');
            const tokenName = document.createElement('h3');
            tokenName.innerText = token.tokenAddress || 'Token Adı Bulunamadı';
            const tokenDescription = document.createElement('p');
            tokenDescription.innerText = token.description || 'Açıklama mevcut değil.';

            // Link
            const tokenLink = document.createElement('a');
            tokenLink.href = token.url;
            tokenLink.target = '_blank';
            tokenLink.innerText = 'Resmi Web Sitesi';

            tokenInfo.appendChild(tokenName);
            tokenInfo.appendChild(tokenDescription);
            tokenInfo.appendChild(tokenLink);
            
            tokenCard.appendChild(tokenIcon);
            tokenCard.appendChild(tokenInfo);

            // Yeni token'ı listenin başına ekle
            tokenList.insertBefore(tokenCard, tokenList.firstChild);
        });
    } else {
        console.error('Beklenen veri formatı alınamadı.');
    }
}

// Periyodik olarak veriyi al ve sayfaya ekle
setInterval(fetchTokenProfiles, 1000); // Her 1 saniyede bir veri al (dakikada 60 kez)

// İlk token'ları hemen al ve sayfada göster
fetchTokenProfiles();
