// CareerAlign dashboard script placeholder
// Future interactive dashboard logic will be added here.

document.addEventListener('DOMContentLoaded', function () {
    console.log('CareerAlign dashboard loaded');

    // Register service worker so the dashboard also benefits from offline support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(function (err) {
            console.log('Service worker registration failed from dashboard.js:', err);
        });
    }
});
