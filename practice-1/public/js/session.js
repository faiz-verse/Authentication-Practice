window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/validate-session');
    const data = await res.json();
    if (data.success) {
        alert('Auto-login successful!', data.user);
        // redirect or show dashboard directly
        window.location.href = '/dashboard';
    } else {
        alert('Not logged in:', data.message);
    }
});