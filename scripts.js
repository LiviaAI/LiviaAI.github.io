let currentImage = 1;
const imageElement = document.getElementById("slider-img");

function changeImage() {
    currentImage = currentImage === 1 ? 2 : 1;
    imageElement.src = `livia${currentImage}.png`;
}

// Resim değişim fonksiyonu her 4 saniyede bir çalışacak
setInterval(changeImage, 4000);

// Whitepaper indirme fonksiyonu
function downloadWhitepaper() {
    const link = document.createElement('a');
    link.href = 'whitepaper.pdf';
    link.download = 'whitepaper.pdf';
    link.click();
}

// JavaScript'in çalışıp çalışmadığını kontrol etme (opsiyonel)
console.log('JavaScript dosyası yüklendi!');