document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('cover').querySelector('form');
    const searchInput = document.getElementById('search-input');
    const gallery = document.getElementById('image-gallery');
    const hotKeywords = document.querySelectorAll('.hot-keyword');

    // Handle form submission for searches
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        performSearch(searchInput.value.trim());
    });

    // Handle clicks on hot search keywords
    hotKeywords.forEach(keyword => {
        keyword.addEventListener('click', function() {
            searchInput.value = keyword.textContent;
            performSearch(keyword.textContent);
        });
    });

    // Function to perform the search and fetch images
    function performSearch(query) {
        const accessKey = "ZbDbaDiQO3NFU2JPM0HGyhV1lxs4HkhrCo9qPnBdDbU"; // Use your actual Unsplash access key
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayImages(data.results);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
                alert('Failed to fetch images');
            });
    }

    // Display images in the gallery
    function displayImages(images) {
        gallery.innerHTML = ''; // Clear existing images
        images.forEach(image => {
            const imgElement = document.createElement('div');
            imgElement.className = 'column';
            imgElement.innerHTML = `<img class="lazy" data-src="${image.urls.regular}" src="placeholder.jpg" alt="${image.alt_description}" style="width:100%; height:350px;">`;
            gallery.appendChild(imgElement);
        });
        initializeLazyLoad();
    }

    // Initialize lazy loading for images using Intersection Observer
    function initializeLazyLoad() {
        const lazyloadImages = document.querySelectorAll("img.lazy");
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img); // Stop observing the image once it has loaded
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        lazyloadImages.forEach(img => observer.observe(img));
    }
});
