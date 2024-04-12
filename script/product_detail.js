// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the product ID from the URL
const productId = urlParams.get("productId");

// Asynchronous function to add product details to HTML
// Asynchronous function to add product details to HTML
const addProductToHtml = async () => {
  $.ajax({
    type: "GET",
    url: "/script/json/product.json",
    success: function (data) {
      try {
        let row = data.filter((item) => item.id == productId);

        // Find the product details based on the product ID (assuming productId is defined somewhere)
        const product = row.length == 0 ? null : row[0];

        if (product !== null) {
          // Accessing elements by class name
          const productImages = document.querySelectorAll(".product-image");
          const thumbnailImages = document.querySelectorAll(".thumbnail-image");
          productImages.forEach((image, index) => {
            image.src = product[`image${index + 1}`];
          });

          // Update src attributes of thumbnail images
          thumbnailImages.forEach((image, index) => {
            image.src = product[`image${index + 1}`];
          });

          $("body").find(".product-title").html(product.name);
          $("body").find(".product-link").html(product.category);
          $("body").find(".p-detail-rating").html(product.product_rating);
          $("body").find(".p-detail-description").html(product.description);
          $("body").find(".p-detail-color span").html(product.product_color);
          $("body").find(".p-detail-shipping-fee span").html(product.shipping_fee);

          if (product.offer_discount > 0) {
            $("body").find(".product-price").html(`
            <p class="last-price">Old Price: <span>$${product.price}</span></p>
            <p class="new-price">New Price: <span>$${product.price - (product.price * (product.offer_discount / 100))} (${product.offer_discount}% off)</span></p>
            `);
          }
          else {
            $("body").find(".product-price").html(`
            <p class="new-price">Price: <span>$${product.price}</span></p>
            `);
          }

          for (let i=0; i < Math.floor(product.product_rating); i++) {
            $("body").find(".product-rating").append('<i class="fas fa-star"></i>');
          }

          if (product.product_rating > Math.floor(product.product_rating)) {
            $("body").find(".product-rating").append('<i class="fas fa-star-half-alt"></i>');
          }

          var totalStars = $("body").find(".product-rating").find('i').length;

          for (let i = 0; i < 5 - totalStars; i++) {
            $("body").find(".product-rating").append('<i class="far fa-star"></i>')
          }

        } else {
          $(".p-detail-card").html(
            "<h2>Oops! We were unavailable to find the product you were looking for.</h2>"
          );
        }
      } catch (error) {
        console.error("Error fetching product details: ", error);
      }
    },
  });
};

$(document).ready(function () {
  // Call the function to add product details to HTML
  addProductToHtml();

  $("body").on("click", ".btn-add-cart", function (e) {
    if (!checkPermission()) {
      e.preventDefault();
      return;
    }

    addProductToCart(productId);
  });
});
