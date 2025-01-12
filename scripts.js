// Token profil verilerini al
async function fetchTokenProfiles() {
    const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
        method: 'GET',
        headers: {},
    });

    const data = await response.json();
    displayTokenProfiles(data);
}

// Token profil bilgilerini ekrana yerleştir
function displayTokenProfiles(data) {
    const tokenList = document.getElementById('token-list');
    
    const tokenCard = document.createElement('div');
    tokenCard.classList.add('token-card');

    // Token simgesi
    const tokenIcon = document.createElement('img');
    tokenIcon.src = data.icon;
    tokenIcon.alt = 'Token Icon';

    // Token başlığı ve açıklaması
    const tokenInfo = document.createElement('div');
    const tokenName = document.createElement('h3');
    tokenName.innerText = data.tokenAddress;
    const tokenDescription = document.createElement('p');
    tokenDescription.innerText = data.description;

    // Link
    const tokenLink = document.createElement('a');
    tokenLink.href = data.url;
    tokenLink.target = '_blank';
    tokenLink.innerText = 'Resmi Web Sitesi';

    // Card içeriklerini ekle
    tokenInfo.appendChild(tokenName);
    tokenInfo.appendChild(tokenDescription);
    tokenInfo.appendChild(tokenLink);
    
    tokenCard.appendChild(tokenIcon);
    tokenCard.appendChild(tokenInfo);
    
    // Listeye token'ı ekle
    tokenList.appendChild(tokenCard);
}

// İlk token profilini getir
fetchTokenProfiles();
