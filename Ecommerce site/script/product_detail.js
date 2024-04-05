// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the product ID from the URL
const productId = urlParams.get('productId');

// Asynchronous function to add product details to HTML
// Asynchronous function to add product details to HTML
const addProductToHtml = async () => {
    try {
         // Load product data from the JSON file
         const response = await fetch('script/json/product.json');
         const products = await response.json();

        // Find the product details based on the product ID (assuming productId is defined somewhere)
        const product = getProductDetails(products, parseInt(productId));
        
        // Accessing elements by class name
const productImages = document.querySelectorAll('.product-image');
const thumbnailImages = document.querySelectorAll('.thumbnail-image');
productImages.forEach((image, index) => {
  image.src = product[`image${index + 1}`];
});

// Update src attributes of thumbnail images
thumbnailImages.forEach((image, index) => {
  image.src = product[`image${index + 1}`]; 
});

    } catch (error) {
        console.error('Error fetching product details: ', error);
    }   

};

/**
 * Function to fetch product details by ID.
 * @param {Array} products - Array of product objects.
 * @param {number} productId - ID of the product to fetch details for.
 * @returns {Object} - Details of the product with the specified ID.
 */
const getProductDetails = (products, productId) => {
    return products.find(product => product.id === productId);
};

// Call the function to add product details to HTML
addProductToHtml();