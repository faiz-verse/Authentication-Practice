const themeOptions = document.querySelectorAll('#theme-options .option');
const themeInput = document.querySelector(`input[name='theme']`);
const body = document.querySelector('body');

const themeJsonObj = {
    gray: {
        themeName: "gray",
        themeLight: "rgb(238, 238, 238)",
        themeDark: "darkslategray"
    },
    maroon: {
        themeName: "maroon",
        themeLight: "papayawhip",
        themeDark: "darkred"
    },
    ocean: {
        themeName: "ocean",
        themeLight: "lightcyan",
        themeDark: "darkcyan"
    },
    forest: {
        themeName: "forest",
        themeLight: "rgb(225, 255, 225)",
        themeDark: "darkgreen"
    },
    default: {
        themeName: "default",
        themeLight: "white",
        themeDark: "tomato"
    }
};

const root = document.documentElement; // This is the :root

themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove 'clicked' class from all options
        themeOptions.forEach(opt => opt.classList.remove('clicked'));

        // Add 'clicked' class to the clicked option
        option.classList.add('clicked');

        // Get theme key
        const themeKey = option.dataset.theme;

        // Update input and CSS variables
        if (themeJsonObj[themeKey]) {
            const selectedTheme = themeJsonObj[themeKey];
            themeInput.value = selectedTheme.themeName;

            // Set CSS variables in :root
            root.style.setProperty('--theme-light', selectedTheme.themeLight);
            root.style.setProperty('--theme-dark', selectedTheme.themeDark);
        }
    });
});

const dropdown = document.getElementById('dropdown');
const fontInput = document.getElementById('fontInput');

dropdown.addEventListener('change', () => {
    const selectedFont = dropdown.value;
    fontInput.style.fontFamily = selectedFont;
    body.style.fontFamily = selectedFont;
    fontInput.value = selectedFont;
});


// LOGOUT
const logoutButton = document.querySelector('#log-out-button')
logoutButton.addEventListener('click', async ()=> {
    // logging out of the session
    const response = await fetch('/logout', {
        method: 'GET',
        credentials: 'include'
    });

    const data = await response.json();

    if (data.success) {
        console.log(data.message);
        alert('Logged out successfully!');
        window.location.href = '/';
    } else {
        console.log('Unable to delete the session');
    }
})
