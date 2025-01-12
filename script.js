// Token bilgilerini göstermek için fonksiyon
function displayTokenProfiles() {
    const tokenList = document.getElementById('token-list');
    
    // Token veri dizisini al
    const tokensToShow = tokenData.slice(currentTokenIndex, currentTokenIndex + 20);
    tokensToShow.forEach(token => {
        const tokenCard = document.createElement('div');
        tokenCard.classList.add('token-card');
        
        // Token simgesi (icon)
        const tokenIcon = document.createElement('img');
        tokenIcon.src = token.icon;
        tokenIcon.alt = 'Token Icon';
        tokenIcon.classList.add('token-icon'); // Token simgesine stil verebiliriz
        
        // Token detayları
        const tokenInfo = document.createElement('div');
        
        // Chain ID (büyük harflerle)
        const chainId = document.createElement('p');
        chainId.innerText = `CHAIN: ${token.chainId ? token.chainId.toUpperCase() : 'N/A'}`;

        // Token adresi (kopyalayabilmek için)
        const tokenAddress = document.createElement('p');
        tokenAddress.innerText = `Token Address: ${token.tokenAddress || 'N/A'}`;
        tokenAddress.title = token.tokenAddress; // Mouse üzerine geldiğinde gösterilecek metin
        
        // Description (alıntı metin)
        const tokenDescription = document.createElement('p');
        tokenDescription.innerText = `"${token.description || 'No description available.'}"`; // Alıntı metin formatında

        // Buy Token linki
        const buyTokenLink = document.createElement('a');
        buyTokenLink.href = token.url;
        buyTokenLink.target = '_blank';
        buyTokenLink.innerText = 'BUY TOKEN'; // "Buy Token" olarak göstereceğiz
        
        // Tüm bilgileri birleştir
        tokenInfo.appendChild(chainId);
        tokenInfo.appendChild(tokenAddress);
        tokenInfo.appendChild(tokenDescription);
        tokenInfo.appendChild(buyTokenLink);

        // Token kartına simge ve bilgileri ekle
        tokenCard.appendChild(tokenIcon);
        tokenCard.appendChild(tokenInfo);
        
        // Listeye ekle
        tokenList.appendChild(tokenCard);
    });
}
