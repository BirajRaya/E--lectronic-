if (!localStorage.getItem('current_user')) {
    window.location.href = 'login.html';
}

const cartTable = document.querySelector('.table');
const subtotalCell = document.querySelector('.Subtotal');
const taxCell = document.querySelector('.tax');
const totalAmountCell = document.querySelector('.total_amount');

let CADDollar = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
});

function updatePrices(subtotal) {
    const taxPercent = 13; // Assuming a 13% tax
    const tax = (subtotal * taxPercent) / 100;

    // Update subtotal, tax, and total amount in HTML
    subtotalCell.innerHTML = `CAD ${CADDollar.format(subtotal)}`;
    taxCell.innerHTML = `CAD ${CADDollar.format(tax)}`;
    totalAmountCell.innerHTML = `CAD ${CADDollar.format(subtotal + tax)}`;
}

// Asynchronous function to add cart items to HTML
const addCartToHtml = async () => {
    let subtotal = 0;

    $.ajax({
        type: "GET",
        url: "/script/json/product.json",
        success: function (data) {
            products = data;

            try {
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
                                                <img src="${product.image1}" alt="${product.name}">
                                                <div>
                                                    <p class="text h11">${product.name}</p>
                                                    <small class="text h11">Price: CAD ${CADDollar.format(product.price)}</small><br>
                                                    ${product.offer_discount > 0 ? `<small class="text h11">Discounted price: CAD ${CADDollar.format(product.price - (product.price * (product.offer_discount / 100)))}</small><br>`: ''}
                                                    ${product.offer_discount > 0 ? `<small class="text h11">Offer: ${product.offer}<br>`: ''}
                                                    ${product.offer_discount > 0 ? `<small class="text h11">Discount: ${product.offer_discount}%<br>`: ''}
                                                    <a class="remove text">Remove</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td><label><input type="number" value="${cartItem.quantity}" class="text quantity" data-id="${productId}" min="1" max="50" onkeydown="return false"></label></td>
                                        <td class="text h11 price">CAD ${CADDollar.format((product.price - (product.price * (product.offer_discount / 100))) * cartItem.quantity)}</td>
                                    `;

                                    // Append the new row to the table
                                    cartTable.appendChild(cartRow);
                                    subtotal += (product.price - (product.price * (product.offer_discount / 100))) * cartItem.quantity;
                                } else {
                                    console.error('Product details not found for item with id:', productId);
                                }
                            }
                        }

                        updatePrices(subtotal);
                    } else {
                        $('body').find('.small-container').html('<h2>Your cart is empty.</h2>');
                    }

                    // Add event listener for quantity change
                    cartTable.addEventListener('input', function (event) {
                        if (event.target.classList.contains('quantity')) {
                            const productId = event.target.dataset.id;
                            const quantity = parseInt(event.target.value);

                            // Update the quantity in the cartItems array
                            if (carts[user_email].cart[productId]) {
                                carts[user_email].cart[productId].quantity = quantity;
                                console.log(carts[user_email].cart[productId].quantity);

                                // Update the cartItems in local storage
                                updateCartInLocalStorage();

                                // Update the price in the HTML display
                                const priceCell = event.target.parentElement.parentElement.nextElementSibling;
                                const product = getProductDetails(products, parseInt(productId));
                                if (product) {
                                    priceCell.textContent = `CAD ${CADDollar.format((product.price - (product.price * (product.offer_discount / 100))) * quantity)}`;
                                }

                                // Recalculate subtotal
                                subtotal = 0;
                                for (const productId in carts[user_email].cart) {
                                    if (carts[user_email].cart.hasOwnProperty(productId)) {
                                        const cartItem = carts[user_email].cart[productId];
                                        const product = getProductDetails(products, parseInt(productId));
                                        if (product) {
                                            subtotal += (product.price - (product.price * (product.offer_discount / 100))) * cartItem.quantity;
                                        }
                                    }
                                }

                                updatePrices(subtotal);
                            }
                        }
                    });

                    // Add event listener for remove link
                    cartTable.addEventListener('click', function (event) {
                        if (event.target.classList.contains('remove')) {
                            const row = event.target.closest('tr');
                            if (row) {
                                const productId = row.querySelector('.quantity').dataset.id;

                                // Remove the item from cartItems object
                                delete carts[user_email].cart[productId];

                                // Remove the row from HTML
                                row.remove();

                                // Update the cartItems in local storage
                                updateCartInLocalStorage();

                                if (Object.keys(carts[user_email].cart).length == 0) {
                                    $('body').find('.small-container').html('<h2>Your cart is empty.</h2>');
                                    return;
                                }

                                // Recalculate subtotal
                                subtotal = 0;
                                for (const productId in carts[user_email].cart) {
                                    if (carts[user_email].cart.hasOwnProperty(productId)) {
                                        const cartItem = carts[user_email].cart[productId];
                                        const product = getProductDetails(products, parseInt(productId));
                                        if (product) {
                                            subtotal += (product.price - (product.price * (product.offer_discount / 100))) * cartItem.quantity;
                                        }
                                    }
                                }

                                updatePrices(subtotal);
                            }
                        }
                    });


                } else {
                    $('body').find('.small-container').html('<h2>Your cart is empty.</h2>');
                }


            } catch (error) {
                console.error('Error adding cart items to HTML:', error);
            }
        },
    });


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

$(document).ready(function() {
    // Call the function to add cart items to HTML
    addCartToHtml();

    $('body').on('click', '.btn-checkout', function() {
        alert('Checkout successful!');
        let user_email = localStorage.getItem('user_email');
        carts[user_email].cart = {};
        updateCartInLocalStorage();
        location.reload();
    });
});
