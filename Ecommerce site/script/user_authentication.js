// Function to register a new user
function register() {
    // Extracting values from input fields
    let full_name, email, password;
    full_name = document.querySelector('.name').value;
    email = document.querySelector('.email').value;
    password = document.querySelector('.password').value;

    // Validating input fields
    if (!full_name || !email || !password) {
        alert('Please fill in all fields');
        return; 
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Retrieving user records from localStorage or initializing an empty array
    let userRecord = JSON.parse(localStorage.getItem('users')) || [];

    // Checking if the user already exists
    if (userRecord.some(user => user.email === email)) {
        alert('User already exists');
    } else {
        // If the user does not exist, add them to the userRecord array
        userRecord.push({ name: full_name, email: email, password: password });
        // Store updated userRecord in localStorage
        localStorage.setItem('users', JSON.stringify(userRecord));
        alert('User registered successfully');
    }
}

// Function to handle user login
function login() {
    // Extracting values from input fields
    let email, password;
    email = document.querySelector('.email').value;
    password = document.querySelector('.password').value;

    // Validating input fields
    if (!email || !password) {
        alert('Please fill in all fields');
        return; // Stop further execution if fields are not filled
    }

    // Retrieving user records from localStorage or initializing an empty array
    let userRecord = JSON.parse(localStorage.getItem('users')) || [];

    // Checking if the entered credentials match any existing user
    if (userRecord.some(user => user.email === email && user.password === password)) {
        // If credentials match, alert success message and set current user in localStorage
        alert('Login successfully');
        let current_user = userRecord.find(user => user.email === email && user.password === password);
        localStorage.setItem('current_user', current_user.name);
        localStorage.setItem('user_email', current_user.email);
        // Redirect to index.html
        window.location.href = 'index.html';
    } else {
        // If credentials do not match, alert failure message
        alert('User credentials not matching');
    }
}
function logout() {
    // Remove current user from localStorage
    localStorage.removeItem('current_user');
    localStorage.removeItem('user_email');
    // Redirect to index.html
    window.location.href = 'login.html';
}
