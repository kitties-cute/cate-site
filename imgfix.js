document.addEventListener('error', function (e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        // Prevents infinite loops if the fallback link ever breaks
        e.target.onerror = null; 
        e.target.src = 'https://raw.githubusercontent.com/EBURGG/site/refs/heads/main/placeholders/broken.png';
    }
}, true);
