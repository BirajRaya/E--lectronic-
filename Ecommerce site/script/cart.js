let carts = JSON.parse(localStorage.getItem('cartItems')) || {};

// Function to update cart items in local storage
const updateCartInLocalStorage = () => {
    localStorage.setItem('carts', JSON.stringify(carts));
};

// Asynchronous function to add cart items to HTML
const addCartToHtml = async () => {
    // Get the cart container in the HTML
    const cartTable = document.querySelector('.table');
    const subtotalCell = document.querySelector('.Subtotal');
    const discountCell = document.querySelector('.discount');
    const totalAmountCell = document.querySelector('.total_amount');

    let subtotal = 0;

    try {
        // Load product data from the JSON file
        const response = await fetch('script/json/product.json');
        const products = await response.json();

        let user_email = localStorage.getItem('user_email');
        
        // Load cart items from local storage based on user's email
        if (carts[user_email] && carts[user_email].cart) {
            const cartItems = carts[user_email].cart;

            console.log(carts[user_email].cart);

            // If there are cart items stored
            if (Object.keys(cartItems).length > 0) {
                // Iterate through the cart items
                for (const productId in cartItems) {
                    if (cartItems.hasOwnProperty(productId)) {
                        const cartItem = cartItems[productId];
                        // Find the corresponding product details by matching the ID
                        const product = getProductDetails(products, parseInt(cartItem.id));

                        if (product) {
                            // Create a new table row for the cart item
                            const cartRow = document.createElement('tr');

                            // Set the inner HTML of the row
                            cartRow.innerHTML = `
                                <td>
                                    <div class="cart-info">
                                        <img src="${product.image}" alt="${product.name}">
                                        <div>
                                            <p class="text h11">${product.name}</p>
                                            <small class="text h11">Price: CAD ${product.price}</small><br>
                                            <a href="#0" class="remove text">Remove</a>
                                        </div>
                                    </div>
                                </td>
                                <td><label><input type="number" value="${cartItem.quantity}" class="text quantity" data-id="${productId}" min="1" max="50" onkeydown="return false"></label></td>
                                <td class="text h11 price">CAD ${product.price * cartItem.quantity}</td>
                            `;

                            // Append the new row to the table
                            cartTable.appendChild(cartRow);
                            subtotal += product.price * cartItem.quantity; 
                        } else {
                            console.error('Product details not found for item with id:', productId);
                        }
                    }
                }
                
                // Calculate discount (assuming a fixed percentage)
                const discountPercent = 10; // Assuming a 10% discount
                const discount = (subtotal * discountPercent) / 100;

                // Update subtotal, discount, and total amount in HTML
                subtotalCell.innerHTML = `CAD ${subtotal}`;
                discountCell.innerHTML = `CAD ${discount}`;
                totalAmountCell.innerHTML = `CAD ${subtotal - discount}`;
            } else {
                console.log('Cart is empty');
            }
        } else {
            console.log('Cart is empty');
        }

        // Add event listener for quantity change
        cartTable.addEventListener('input', function(event) {
            if (event.target.classList.contains('quantity')) {
                const productId = event.target.dataset.id;
                const quantity = parseInt(event.target.value);

                // Update the quantity in the cartItems array
                if (carts[user_email].cart[productId]) {
                    carts[user_email].cart[productId].quantity = quantity;

                    // Update the price in the HTML display
                    const priceCell = event.target.parentElement.parentElement.nextElementSibling;
                    const product = getProductDetails(products, parseInt(productId));
                    if (product) {
                        priceCell.textContent = `CAD ${product.price * quantity}`;
                    }

                    // Recalculate subtotal
                    subtotal = 0;
                    for (const productId in carts[user_email].cart) {
                        if (carts[user_email].cart.hasOwnProperty(productId)) {
                            const cartItem = carts[user_email].cart[productId];
                            const product = getProductDetails(products, parseInt(productId));
                            if (product) {
                                subtotal += product.price * cartItem.quantity;
                            }
                        }
                    }

                    // Calculate discount (assuming a fixed percentage)
                    const discountPercent = 10; // Assuming a 10% discount
                    const discount = (subtotal * discountPercent) / 100;

                    // Update subtotal, discount, and total amount in HTML
                    subtotalCell.innerHTML = `CAD ${subtotal}`;
                    discountCell.innerHTML = `CAD ${discount}`;
                    totalAmountCell.innerHTML = `CAD ${subtotal - discount}`;

                    // Update the cartItems in local storage
                    updateCartInLocalStorage();
                }
            }
        });

        // Add event listener for remove link
        cartTable.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove')) {
                const row = event.target.closest('tr');
                if (row) {
                    const productId = row.querySelector('.quantity').dataset.id;

                    // Remove the item from cartItems object
                    delete carts[user_email].cart[productId];

                    // Remove the row from HTML
                    row.remove();

                    // Recalculate subtotal
                    subtotal = 0;
                    for (const productId in carts[user_email].cart) {
                        if (carts[user_email].cart.hasOwnProperty(productId)) {
                            const cartItem = carts[user_email].cart[productId];
                            const product = getProductDetails(products, parseInt(productId));
                            if (product) {
                                subtotal += product.price * cartItem.quantity;
                            }
                        }
                    }

                    // Calculate discount (assuming a fixed percentage)
                    const discountPercent = 10; // Assuming a 10% discount
                    const discount = (subtotal * discountPercent) / 100;

                    // Update subtotal, discount, and total amount in HTML
                    subtotalCell.innerHTML = `CAD ${subtotal}`;
                    discountCell.innerHTML = `CAD ${discount}`;
                    totalAmountCell.innerHTML = `CAD ${subtotal - discount}`;

                    // Update the cartItems in local storage
                    updateCartInLocalStorage();
                }
            }
        });
    } catch (error) {
        console.error('Error adding cart items to HTML:', error);
    }
}

/**
 * Function to fetch product details by ID.
 * @param {Array} products - Array of product objects.
 * @param {number} productId - ID of the product to fetch details for.
 * @returns {Object} - Details of the product with the specified ID.
 */
const getProductDetails = (products, productId) => {
    return products.find(product => product.id === productId);
}

// Call the function to add cart items to HTML
addCartToHtml();
