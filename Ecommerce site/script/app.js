let products = [];
$.ajax({
  type: "GET",
  url: "/Ecommerce site/script/json/product.json",
  success: function (data) {
    products = data;
  },
});

function filterProducts(category = null, offer = null, id_index = 0) {
  return products.filter(
    (item) =>
      (category === null ? true : item.category == category) &&
      (offer === null ? true : item.offer == offer) &&
      item.id > id_index
  );
}

function filterProductById(id) {
  let row = products.filter((item) => item.id == id);
  return row.length == 0 ? null : row[0];
}

function createProductCard(product) {
  let productCard = document.createElement("div");
  productCard.classList.add("product-card");
  productCard.dataset.id = product.id;
  productCard.innerHTML = `
    ${
      product.offer_discount == 0
        ? ""
        : `<div class="badge1">${product.offer_discount}% off</div>`
    }
    <div class="product-body">
        <div class="product-thumb">
            <img src="${product.image1}" alt="${product.name}" >
        </div>
        <div class="product-details">
            <span class="product-category">${product.brand}</span>
            <h4><a class="product_name">${product.name}</a></h4>
            <p>${product.description}</p>
            
        </div>
    </div>
    <div class="product-footer">
        <div class="product-bottom-details">
            ${
              product.offer_discount == 0
                ? `<div class="product-price">$${product.price}.00</div>`
                : `<div class="product-price"><small>$${
                    product.price
                  }.00</small>$${(
                    product.price *
                    (1 - product.offer_discount / 100)
                  ).toFixed(2)}</div>`
            }
        </div>
        <div class="product-links">
            <a href=""><i class="fa fa-shopping-cart add_cart"></i></a>
        </div>
    </div>
    `;

  return productCard;
}

function checkPermission() {
  if (!localStorage.getItem("current_user")) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

//cart array
let carts = JSON.parse(localStorage.getItem("cartItems")) || {};

// Function to add data to HTML dynamically
const addDataToHtml = (data) => {
  $("body")
    .find(".card.products")
    .each((i, element) => {
      let filteredData = [];
      if ($(element).hasClass("spring_products")) {
        filteredData = fetchItems(null, "Spring");
      } else if ($(element).hasClass("category_display")) {
        filteredData = fetchItems("camera", null);
      } else if ($(element).hasClass("best_selling_products")) {
        filteredData = fetchItems(null, "Best_selling");
      }

      $(filteredData).each((i, item) => {
        $(element).append(createProductCard(item));
      });
    });
};

const addProductToCart = (productId) => {
  let user_email = localStorage.getItem("user_email");

  // Initialize cart for user if it doesn't exist
  if (!carts[user_email]) {
    carts[user_email] = { cart: {} };
  }

  // If the product is not in the cart, add it with a quantity of 1
  if (!carts[user_email].cart[productId]) {
    carts[user_email].cart[productId] = { id: productId, quantity: 1 };
    // If the product is already in the cart, increment its quantity
  } else {
    carts[user_email].cart[productId].quantity += 1;
  }

  $("body")
    .find("span.cart_span")
    .html(carts[user_email].length + 1);

  updateCartInLocalStorage(); // Call function to update cart items in local storage
};
// Function to update cart items in local storage
const updateCartInLocalStorage = () => {
  localStorage.setItem("cartItems", JSON.stringify(carts));
};

//fetch using categories
function fetchItems(category = null, offer = null) {
  let filteredProducts = filterProducts(category, offer);
  if (window.location.href.includes("products")) {
    return filteredProducts;
  }
  return filteredProducts.slice(0, 4);
}

// Function to initialize the app
const initApp = () => {
  addDataToHtml(products);
};

$(document).ready(function () {
  initApp(); // Initialize the app when the page loads

  $("body").on("click", ".categories .category", function () {
    let category = $(this).attr("data-category");
    let container = $(this).closest(".container");

    container.find(".active").removeClass("active");
    $(this).addClass("active");
    container.find(".card.products").html("");

    fetchItems(category, null).forEach((product) => {
      container.find(".card.products").append(createProductCard(product));
    });
  });

  $("body").on("click", ".product-body", function () {
    let productId = $(this).closest(".product-card").attr("data-id");

    // Redirect to product_detail.html with the product ID as a query parameter
    window.open(`product_detail.html?productId=${productId}`, "_blank");
    // window.location.href = `product_detail.html?productId=${productId}`;
  });

  $("body").on("click", ".add_cart", function (e) {
    if (!checkPermission()) {
      e.preventDefault();
      return;
    }

    let productId = $(this).closest(".product-card").attr("data-id");
    addProductToCart(productId);
  });
});
