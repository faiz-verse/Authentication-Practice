document.addEventListener("DOMContentLoaded", () => {
    const themeOptions = document.querySelectorAll('#theme-options .option');
    const themeInput = document.querySelector(`input[name='theme']`);
    const body = document.querySelector('body');
    const fontInput = document.getElementById('fontInput');
    const dropdown = document.getElementById('dropdown');
    const root = document.documentElement;

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

    // Function to apply the saved preferences to the page
    const applyPreferences = (preferences) => {
        if (preferences) {
            console.log("Applying preferences:", preferences);  // Add this line
            selectedTheme = preferences.theme || 'default';
            selectedFont = preferences.font || 'Arial';

            // Apply theme
            const themeObj = themeJsonObj[selectedTheme] || themeJsonObj['default'];
            root.style.setProperty('--theme-light', themeObj.themeLight);
            root.style.setProperty('--theme-dark', themeObj.themeDark);
            themeInput.value = selectedTheme;

            // Apply font
            body.style.fontFamily = selectedFont;
            fontInput.style.fontFamily = selectedFont;
            dropdown.value = selectedFont;  // Ensure the dropdown shows the selected font

            // Apply 'clicked' class to the selected theme option
            themeOptions.forEach(option => {
                // Remove the 'clicked' class from all options
                option.classList.remove('clicked');

                // Add 'clicked' class to the option that matches the selected theme
                if (option.dataset.theme === selectedTheme) {
                    option.classList.add('clicked');
                }
            });
        }
    };


    // Fetch preferences from the backend
    const loadPreferences = async () => {
        try {
            const response = await fetch('/getPreferences', {
                method: 'GET',
                credentials: 'include' // Ensure the user's session or cookies are sent along
            });

            if (!response.ok) {
                throw new Error('Failed to fetch preferences');
            }

            const data = await response.json();

            console.log(data);  // Add this line to inspect the returned data

            if (data.success && data.preferences) {
                applyPreferences(data.preferences);
            } else {
                console.log('No preferences found for user.');
            }
        } catch (error) {
            console.error("Error fetching preferences from backend:", error);
        }
    };


    // Event listener for theme selection
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

    // Event listener for font selection
    dropdown.addEventListener('change', () => {
        selectedFont = dropdown.value; // <-- Save it here
        fontInput.style.fontFamily = selectedFont;
        body.style.fontFamily = selectedFont;
        fontInput.value = selectedFont;
    });

    // Event listener for logout button
    const logoutButton = document.querySelector('#log-out-button');
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

    // Event listener for the form submission to save preferences
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
                // Save the preferences to localStorage for future page loads
                localStorage.setItem('userPreferences', JSON.stringify({ theme: selectedTheme, font: selectedFont }));
                alert("Preferences updated!");
            } else {
                alert("Error updating preferences");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error");
        }
    });

    // Apply saved preferences when the page loads
    loadPreferences();
});
