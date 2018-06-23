//let lib = require("../utils/library.js");

export default class Auth {
    constructor() {
        let isLoggedIn = false;
        let jwtToken = "";
        let email = "";
        let password = "";
        let expiry = "";
    }

    login() {
        // Sign in the user if email+password are present, AND if the expiry suggests a new token is needed
    }

    isAuthenticated() {
        // Return true iff user is authenticated and jwt is still valid
    }

    logout() {
        // Get rid of the user credentials
    }

    getUserDetails() {
        // Returns an object with info about the currently logged in user
    }

    loginPostRequest() {
        // Makes the HTTP request to obtain JWT token + expiry + user details
    }
}
