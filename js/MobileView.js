export const MOBILE_MEDIA_QUERY = '(max-width: 900px)';

export function isMobileViewport() {
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

/** Mark the page as mobile read-only and tweak splash copy. Returns true when active. */
export function initMobileView(documentRoot = document.documentElement) {
    if (!isMobileViewport()) return false;

    documentRoot.dataset.mobileReadonly = 'true';

    const hint = document.querySelector('.splash-hint');
    if (hint) hint.textContent = 'Tryck för att fortsätta';

    return true;
}
