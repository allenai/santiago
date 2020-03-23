declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        googleAnalyticsUA?: string;
    }
}

export function trackPageView(title: string, location: string) {
    const pageView = {
        page_title: title,
        page_location: location
    };
    if (window.gtag && window.googleAnalyticsUA) {
        window.gtag('config', window.window.googleAnalyticsUA, pageView);
    } else {
        console.log(`GA disabled, would have tracked:`, pageView);
    }
}
