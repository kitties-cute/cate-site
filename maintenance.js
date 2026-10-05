(async function() {
    // Don't loop infinitely if already on maintenance page
    if (window.location.pathname.includes('maintenance')) return;

    try {
        // Fetch status.json bypassing cache
        const res = await fetch('/status.json?t=' + Date.now());
        const data = await res.json();

        if (data.maintenance === true) {
            window.location.href = '/maintenance';
        }
    } catch (e) {
        // Ignore fetch errors
    }
})();
