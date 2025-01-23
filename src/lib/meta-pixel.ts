declare global {
  interface Window {
    fbq: any;
  }
}

export const trackEvent = (event: string, params?: object) => {
  if (window.fbq) {
    window.fbq('track', event, params);
  }
};

export const metaPixelEvents = {
  viewProduct: (data: { content_name: string; content_type: string; content_ids: string[] }) => {
    trackEvent('ViewContent', data);
  },
  contactClick: () => {
    trackEvent('Contact');
  },
  storeLocationView: () => {
    trackEvent('FindLocation');
  }
};