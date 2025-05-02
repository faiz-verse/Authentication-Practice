window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/validate-session');
    const data = await res.json();
    if (data.success) {
        // redirect or show dashboard directly
        window.location.href = '/dashboard';
    }
});