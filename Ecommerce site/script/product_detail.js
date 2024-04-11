import { filterProductById } from './product.js'

// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the product ID from the URL
const productId = urlParams.get('productId');

// Asynchronous function to add product details to HTML
// Asynchronous function to add product details to HTML
const addProductToHtml = async () => {
  try {
    // Find the product details based on the product ID (assuming productId is defined somewhere)
    const product = filterProductById(parseInt(productId));

    if (product !== null) {
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

      $('body').find('.product-title').html(product.name);
      $('body').find('.product-link').html(product.category);
    }
    else {
      $('.p-detail-card').html('<h2>Oops! We were unavailable to find the product you were looking for.</h2>')
    }


  } catch (error) {
    console.error('Error fetching product details: ', error);
  }

};

// Call the function to add product details to HTML
addProductToHtml();