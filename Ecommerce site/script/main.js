window.onload = function () {
    // Function to check for current user and update navbar
    const checkCurrentUser = () => {
        let name = localStorage.getItem('current_user');
        let signupLink = document.getElementById('signup');
        let userAuth = document.getElementById('user_auth');
        if (name) {
            // Hide all signup links
            signupLink.style.display = 'none';
            userAuth.style.display = 'flex'; // Display the user authentication section
            addCartToHTML();
        }
    };

    // Function to add cart items to HTML
    const addCartToHTML = () => {
        let totalQuantity = 0;
        if (localStorage.getItem('cartItems')) {
            let carts = JSON.parse(localStorage.getItem('cartItems'));
            for (let user_email in carts) {
                for (let productId in carts[user_email].cart) {
                    totalQuantity += carts[user_email].cart[productId].quantity;
                }
            }
        }
        console.log(totalQuantity);
        // Assuming you have an element with id 'cart' to display the cart count
        document.getElementById('cart').innerHTML = `${totalQuantity}`;
    };

    checkCurrentUser();
}

