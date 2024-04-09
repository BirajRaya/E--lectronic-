function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain attribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /*make an HTTP request using the attribute value as the file name:*/
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /*remove the attribute, and call this function once more:*/
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /*exit the function:*/
            return;
        }
    }
};

// Select the container where products will be displayed
let springProductsHtml = document.querySelector('.spring_products');
let bestSellingProductsHtml = document.querySelector('.best_selling_products');



//span tag for cart
let cart = document.querySelector('.cart_span');
//cart array
let carts = JSON.parse(localStorage.getItem('cartItems')) || {};



// Function to add data to HTML dynamically
const addDataToHtml = (data) => {
    data.forEach(product => {
        // Create a new product element
        let newProduct = document.createElement('div');
        newProduct.classList.add('product-card');
        newProduct.dataset.id = product.id;
        newProduct.innerHTML = `
        <div class="badge1">${product.offer_discount}% off</div>
        <div class="product-tumb">
            <img src="${product.image1}" alt="${product.name}" >
        </div>
        <div class="product-details">
            <span class="product-catagory">${product.brand}</span>
            <h4><a class="product_name">${product.name}</a></h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, possimus nostrum!</p>
            <div class="product-bottom-details">
                <div class="product-price"><small>$${product.price}.00</small>$${(product.price * (1 - product.offer_discount / 100)).toFixed(2)}</div>
                <div class="product-links">
                    <a href=""><i class="fa fa-shopping-cart add_cart"></i></a>
                </div>
            </div>
        </div>
        `;

        // Check the offer type and append the product to the corresponding container
        if (product.offer === "Spring") {
            springProductsHtml.appendChild(newProduct);
        } else if (product.offer === "Best_selling") {
            bestSellingProductsHtml.appendChild(newProduct);
        }
    });
}


// Event listener for "Add to Cart" button click
document.addEventListener('click', (e) => {
    // Get the element that was clicked
    let clickedElement = e.target;

    // Check if the clicked element has the class "add_cart"
    if (clickedElement.classList.contains('add_cart')) {
        // Check if there is a current user in local storage
        if (!localStorage.getItem('current_user')) {
            // If not, redirect the user to the login page
            window.location.href = 'login.html';
            e.preventDefault();
            return; // Stop further execution of the function
        }
        // Retrieve the product ID from the dataset of the parent product card
        let productId = clickedElement.closest('.product-card').dataset.id;
        // Prevent the default form submission behavior
        e.preventDefault();


        addProductToCart(productId); // Call function to add product to cart
    }
    // Check if the clicked element has the class "add_cart"
    if (clickedElement.classList.contains('cart_image')) {
        // Check if there is a current user in local storage
        if (!localStorage.getItem('current_user')) {
            // If not, redirect the user to the login page
            window.location.href = 'login.html';
            e.preventDefault();
            return; // Stop further execution of the function
        }
    }

    if (clickedElement.classList.contains('product_name')) {


        // Retrieve the product ID from the dataset of the parent product card
        let productId = clickedElement.closest('.product-card').dataset.id;

        // Redirect to product_detail.html with the product ID as a query parameter
        window.location.href = `product_detail.html?productId=${productId}`;
        e.preventDefault();


    }
});




const addProductToCart = (productId) => {
    let user_email = localStorage.getItem('user_email');

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

    updateCartInLocalStorage(); // Call function to update cart items in local storage

}
// Function to update cart items in local storage
const updateCartInLocalStorage = () => {
    localStorage.setItem('cartItems', JSON.stringify(carts));
};



//category filter
// Call fetchItems with "camera" category by default
fetchItems('camera');

//fetch using categories
function fetchItems(category) {
    // Get all category elements
    const categoryElements = document.querySelectorAll('.category');

    // Loop through each category element
    categoryElements.forEach(element => {
        // Remove "active" class from all category elements
        element.classList.remove('active');
        // Add "active" class to the clicked category element
        if (element.dataset.category === category) {
            element.classList.add('active');
        }
    });

    fetch('script/json/product.json')
        .then(response => response.json())
        .then(data => {
            const itemsInCategory = data.filter(item => item.category === category);
            displayItems(itemsInCategory);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayItems(items) {
    let categoryFilter = document.querySelector('.category_display');

    // Clear existing products
    categoryFilter.innerHTML = '';

    // Shuffle the array of items
    shuffle(items);

    // Iterate over the items, limiting to a maximum of 4
    for (let i = 0; i < Math.min(items.length, 4); i++) {
        let product = items[i];
        let fiter_product = document.createElement('div');
        fiter_product.classList.add('product-card');
        fiter_product.dataset.id = product.id;
        fiter_product.innerHTML = `
    <div class="badge1">${product.offer_discount}% off</div>
    <div class="product-tumb">
        <img src="${product.image1}" alt="${product.name}">
    </div>
    <div class="product-details">
        <span class="product-catagory">${product.brand}</span>
        <h4><a href="#">${product.name}</a></h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, possimus nostrum!</p>
        <div class="product-bottom-details">
            <div class="product-price"><small>$${product.price}.00</small>$${(product.price * (1 - product.offer_discount / 100)).toFixed(2)}</div>
            <div class="product-links">

                <a href=""><i class="fa fa-shopping-cart add_cart"></i></a>
            </div>
        </div>
    </div>
    `;

        categoryFilter.appendChild(fiter_product);
    }
}

/**
 * Shuffles the elements of an array in random order.
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} - The shuffled array.
 */
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}






// Function to initialize the app
const initApp = () => {
    fetch('script/json/product.json') // Fetch JSON data
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            addDataToHtml(data); // Call function to add data to HTML
        })
        .catch(error => console.error('Error:', error)); // Handle errors
}

initApp(); // Initialize the app when the page loads



