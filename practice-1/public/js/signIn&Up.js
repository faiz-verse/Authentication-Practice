const signupForm = document.querySelector('form[action="/signup"]');
// const signupRemember = document.querySelector('form[action="/signup"] div input[type="checkbox"]').checked
// console.log(signupRemember)

window.addEventListener('DOMContentLoaded', () => {
    const getCookie = (name) => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='))
            ?.split('=')[1];
    };

    // for sign up
    const savedUsername = getCookie('savedUsername');
    const savedPassword = getCookie('savedPassword');
    const savedEmail = getCookie('savedUseremail');
    if (savedUsername && savedPassword && savedEmail) {
        document.querySelector('form[action="/signup"] input[name="username"]').value = savedUsername;
        document.querySelector('form[action="/signup"] input[name="password"]').value = savedPassword;
        document.querySelector('form[action="/signup"] input[name="email"]').value = savedEmail;
        document.querySelector('form[action="/signup"] input[type="checkbox"]').checked = true;
    }
    
    // for sign in
    const savedSignInUsername = getCookie('savedSignInUsername');
    const savedSignInPassword = getCookie('savedSignInPassword');
    if (savedSignInUsername && savedSignInPassword){
        document.querySelector('form[action="/signin"] input[name="username"]').value = savedSignInUsername;
        document.querySelector('form[action="/signin"] input[name="password"]').value = savedSignInPassword;
        document.querySelector('form[action="/signin"] input[type="checkbox"]').checked = true;
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    for (let [key, value] of formData.entries()) {
        console.log(key, value);  // Log key-value pairs
    }

    const username = document.querySelector('form[action="/signup"] input[name="username"]').value;
    const useremail = document.querySelector('form[action="/signup"] input[name="email"]').value;
    const password = document.querySelector('form[action="/signup"] input[name="password"]').value;

    // const rememberMe = formData.get('remember')
    // ✅ If rememberMe is checked → store in cookie
    if (formData.has('remember')) {
        document.cookie = `savedUsername=${username}; max-age=${7 * 24 * 60 * 60}`;
        document.cookie = `savedUseremail=${useremail}; max-age=${7 * 24 * 60 * 60}`;
        document.cookie = `savedPassword=${password}; max-age=${7 * 24 * 60 * 60}`;
    } else {
        // Clear old cookies if unchecked
        document.cookie = 'savedUsername=; max-age=0';
        document.cookie = 'savedUseremail=; max-age=0';
        document.cookie = 'savedPassword=; max-age=0';
    }

    const urlEncodedData = new URLSearchParams(formData).toString();

    const res = await fetch('/signup', {
        method: 'POST',
        body: urlEncodedData,
    });

    const data = await res.json();
    if (data.success) {
        alert(data.message)
        // window.location.href = data.redirectTo;
    } else {
        alert(data.message || "Signup failed");
    }
});

const signinForm = document.querySelector('form[action="/signin"]');
signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(signinForm);
    for (let [key, value] of formData.entries()) {
        console.log(key, value);  // Log key-value pairs
    }

    const username = document.querySelector('form[action="/signin"] input[name="username"]').value;
    const password = document.querySelector('form[action="/signin"] input[name="password"]').value;
    // ✅ If rememberMe is checked → store in cookie
    if (formData.has('remember')) {
        document.cookie = `savedSignInUsername=${username}; max-age=${7 * 24 * 60 * 60}`;
        document.cookie = `savedSignInPassword=${password}; max-age=${7 * 24 * 60 * 60}`;
    } else {
        // Clear old sign in cookies if unchecked
        document.cookie = 'savedSignInUsername=; max-age=0';
        document.cookie = 'savedSignInPassword=; max-age=0';
    }

    const urlEncodedData = new URLSearchParams(formData).toString();

    const res = await fetch('/signin', {
        method: 'POST',
        body: urlEncodedData,
    });

    const data = await res.json();
    if (data.success) {
        alert(data.message)
        // window.location.href = data.redirectTo;
    } else {
        alert(data.message || "Signin failed");
    }
});