// Function to check for current user and update navbar
function checkCurrentUser() {
    let name = localStorage.getItem('current_user');
    let signupLink = document.getElementById('signup');
    let userAuth = document.getElementById('user_auth');
    let cart = document.getElementById("cart_div");
    if (name) {
        // Hide all signup links
        signupLink.style.display = 'none';
        userAuth.style.display = 'flex'; // Display the user authentication section
        cart.style.display = 'flex';
        addCartToHTML();
    }
};

// Function to add cart items to HTML
function addCartToHTML() {
    let totalQuantity = 0;
    let user_email = localStorage.getItem("user_email");

    if (localStorage.getItem('cartItems')) {
        let carts = JSON.parse(localStorage.getItem('cartItems'));

        let cartItemsCount = 0;

        $(carts[user_email].cart).each((index, data) => {
            let keys = Object.keys(data);

            keys.forEach(function (key) {
                cartItemsCount += data[key].quantity;
            });
        })

        $("body")
            .find("span.cart_span")
            .text(cartItemsCount);
    }
};

checkCurrentUser();

