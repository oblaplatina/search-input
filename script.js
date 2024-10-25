const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const productList = document.getElementById('productList');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

let products = [];
let filteredProducts = [];
let categories = [];
let currentPage = 1;
const productsPerPage = 5;

function fetchProducts() {
    fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
            products = data.products;
            categories = [...new Set(products.map(product => product.category))];
            populateCategoryFilter();
            applyFilters();
        });
}

function populateCategoryFilter() {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    filteredProducts = products.filter(product => {
        const matchesText = product.title.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
        return matchesText && matchesCategory;
    });

    updatePagination();
    renderProducts();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

function renderProducts() {
    productList.innerHTML = '';

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    filteredProducts.slice(start, end).forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
        `;
        productList.appendChild(productCard);
    });
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedSearch = debounce(applyFilters, 500);

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
        updatePagination();
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        updatePagination();
    }
});

searchInput.addEventListener('input', debouncedSearch);
categoryFilter.addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});

fetchProducts();
