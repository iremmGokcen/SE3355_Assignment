console.log("Script.js çalışıyor!");

// Dinamik Arama ve Form Gönderimi
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const productCards = document.querySelectorAll('.product-card');
const categoryLinks = document.querySelectorAll('.category-list li');

// Dinamik Arama
searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();

    // Ürün Kartlarını Filtrele
    productCards.forEach(card => {
        const adNo = card.getAttribute('data-ad_no')?.toLowerCase() || '';
        const description = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const price = card.querySelector('.card-text:nth-of-type(1)')?.textContent.toLowerCase() || '';
        const city = card.querySelector('.card-text:nth-of-type(2)')?.textContent.toLowerCase() || '';
        const category = card.getAttribute('data-category')?.toLowerCase() || '';

        if (adNo.includes(query) || description.includes(query) || price.includes(query) || city.includes(query) || category.includes(query)) {
            card.style.display = ''; // Göster
        } else {
            card.style.display = 'none'; // Gizle
        }
    });

    // Kategorileri Filtrele
    categoryLinks.forEach(link => {
        const categoryName = link.querySelector('span:first-child')?.textContent.toLowerCase() || '';
        const hasVisibleCards = Array.from(productCards).some(
            card => card.style.display === '' && card.getAttribute('data-category')?.toLowerCase() === categoryName
        );

        if (hasVisibleCards) {
            link.style.display = ''; // Göster
        } else {
            link.style.display = 'none'; // Gizle
        }
    });
});

// Form Gönderimini Durdur ve Dinamik Aramayı Çalıştır
searchForm.addEventListener('submit', function (e) {
    if (searchInput.value.trim() === '') {
        e.preventDefault(); // Boş arama yapmayı engelle
    }
});
