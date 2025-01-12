// Token profil verilerini al
async function fetchTokenProfiles() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
            method: 'GET',
            headers: {},
        });

        // API'den gelen veriyi konsola yazdır
        const data = await response.json();
        console.log(data); // Burada gelen veriyi kontrol edebilirsiniz
        displayTokenProfiles(data);
    } catch (error) {
        console.error("Veri alınırken bir hata oluştu:", error);
    }
}

// Token profil bilgilerini ekrana yerleştir
function displayTokenProfiles(data) {
    const tokenList = document.getElementById('token-list');
    
    // API'den gelen verinin geçerli olup olmadığını kontrol et
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
            
            tokenList.appendChild(tokenCard);
        });
    } else {
        console.error('Beklenen veri formatı alınamadı.');
    }
}

// İlk token profilini getir
fetchTokenProfiles();
