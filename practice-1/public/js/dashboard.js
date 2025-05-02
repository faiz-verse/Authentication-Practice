document.addEventListener("DOMContentLoaded", () => {
    const themeOptions = document.querySelectorAll('#theme-options .option');
    const themeInput = document.querySelector(`input[name='theme']`);
    const body = document.querySelector('body');

    let selectedTheme = 'default'; // <--- Declare here
    let selectedFont = 'Arial';    // <--- Declare here

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

    const root = document.documentElement;

    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(opt => opt.classList.remove('clicked'));
            option.classList.add('clicked');

            const themeKey = option.dataset.theme;
            if (themeJsonObj[themeKey]) {
                const themeObj = themeJsonObj[themeKey];
                selectedTheme = themeObj.themeName; // <-- Save it here
                themeInput.value = selectedTheme;

                root.style.setProperty('--theme-light', themeObj.themeLight);
                root.style.setProperty('--theme-dark', themeObj.themeDark);
            }
        });
    });

    const dropdown = document.getElementById('dropdown');
    const fontInput = document.getElementById('fontInput');

    dropdown.addEventListener('change', () => {
        selectedFont = dropdown.value; // <-- Save it here
        fontInput.style.fontFamily = selectedFont;
        body.style.fontFamily = selectedFont;
        fontInput.value = selectedFont;
    });

    const logoutButton = document.querySelector('#log-out-button')
    logoutButton.addEventListener('click', async () => {
        const response = await fetch('/logout', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            alert('Logged out successfully!');
            window.location.href = '/';
        } else {
            console.log('Unable to delete the session');
        }
    });

    document.getElementById("customizeForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/customize', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    theme: selectedTheme,
                    font: selectedFont
                })
            });

            const data = await response.json();

            if (data.success) {
                alert("Preferences updated!");
            } else {
                alert("Error updating preferences");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error");
        }
    });
});
