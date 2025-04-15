// Select elements
const cookieNotifier = document.querySelector('#cookie-notifier');
const cookieRejectBtn = document.querySelector('#cookie-reject');
const cookieAcceptBtn = document.querySelector('#cookie-accept');
const clearCookiesBtn = document.querySelector('#clear-cookies');

// Function to check if 'canStoreCookie' is set
function hasCookieConsent() {
    return document.cookie.split('; ').some(cookie => cookie.startsWith('canStoreCookie='));
}

// Function to set a cookie with expiration
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// Function to show or hide the cookies notifier
function toggleCookieNotifier() {
    if (hasCookieConsent()) {
        cookieNotifier.style.transform = "translateX(100%)"; // Hide the notifier if cookie exists
        cookieNotifier.style.opacity = "0"; // Hide the notifier
    } else {
        cookieNotifier.style.transition = "all 2s cubic-bezier(0.23, 1, 0.320, 1)";
        cookieNotifier.style.transitionDelay = "3.5s"; // Delay the transition
        cookieNotifier.style.transform = "translateX(0%)"; // Show the notifier if no cookie
        cookieNotifier.style.opacity = "1"; // Make it visible
    }
}

// Show/hide the cookie notifier based on the cookie presence
toggleCookieNotifier();

// Reject button event
cookieRejectBtn.addEventListener('click', () => {
    setCookie('canStoreCookie', 'false', 2); // Set cookie as false
    cookieNotifier.style.transition = "all 2s cubic-bezier(0.23, 1, 0.320, 1)"
    cookieNotifier.style.transform = "translateX(100%)"; // Hide the notifier
    cookieNotifier.style.opacity = "0"; // Fade out the notifier
});

// Accept button event
cookieAcceptBtn.addEventListener('click', () => {
    setCookie('canStoreCookie', 'true', 2); // Set cookie as true
    cookieNotifier.style.transition = "all 2s cubic-bezier(0.23, 1, 0.320, 1)"
    cookieNotifier.style.transform = "translateX(100%)"; // Hide the notifier
    cookieNotifier.style.opacity = "0"; // Fade out the notifier
});

// Clear cookie button event
clearCookiesBtn.addEventListener('click', () => {

    if (document.cookie) {
        // Delete the cookie
        document.cookie = "canStoreCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

        cookieNotifier.style.transition = "all 2s cubic-bezier(0.23, 1, 0.320, 1)"
        cookieNotifier.style.transform = "translateX(0%)"; // show the notifier
        cookieNotifier.style.opacity = "1"; // show out the notifier
    }
    else {
        return
    }

});


// SIGN UP and SIGN IN
const signUpBtn = document.querySelector('#sign-up-button');
const signInBtn = document.querySelector('#sign-in-button');
const signUpForm = document.querySelector('#sign-up-form');
const signInForm = document.querySelector('#sign-in-form');
const signUpCancel = document.querySelector('#sign-up-cancel');
const signInCancel = document.querySelector('#sign-in-cancel');
const signUpLink = document.querySelector('#sign-up-link');
const signInLink = document.querySelector('#sign-in-link');

signUpBtn.addEventListener('click', () => {
    signUpForm.style.display = 'flex'
})
signInBtn.addEventListener('click', () => {
    signInForm.style.display = 'flex'
})

signUpCancel.addEventListener('click', () => {
    signUpForm.style.display = 'none'
})
signInCancel.addEventListener('click', () => {
    signInForm.style.display = 'none'
})

signUpLink.addEventListener('click', () => {
    signInForm.style.display = 'none'
    signUpForm.style.display = 'flex'
})

signInLink.addEventListener('click', () => {
    signUpForm.style.display = 'none'
    signInForm.style.display = 'flex'
})

