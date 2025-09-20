"use client";

import { useEffect } from "react";
import { useSettings } from "@/contexts/settings-context";

export function DynamicMetadata() {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings) {
      // Update document title
      document.title = `${settings.siteName} - ${settings.tagline}`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${settings.tagline}. Experience authentic Thar Desert life with ${settings.siteName}. Organic farming, rural tourism, traditional Rajasthani culture, and sustainable agricultural practices from Barmer, Rajasthan.`
        );
      }

      // Update favicon if available
      if (settings.favicon) {
        let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = settings.favicon;
        favicon.type = 'image/x-icon';

        // Also update apple-touch-icon
        let appleFavicon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
        if (!appleFavicon) {
          appleFavicon = document.createElement('link');
          appleFavicon.rel = 'apple-touch-icon';
          document.head.appendChild(appleFavicon);
        }
        appleFavicon.href = settings.favicon;
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${settings.siteName} - ${settings.tagline}`);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:title');
        meta.setAttribute('content', `${settings.siteName} - ${settings.tagline}`);
        document.head.appendChild(meta);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', 
          `${settings.tagline}. Experience authentic Thar Desert life with organic farming, rural tourism, and traditional Rajasthani culture.`
        );
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        meta.setAttribute('content', 
          `${settings.tagline}. Experience authentic Thar Desert life with organic farming, rural tourism, and traditional Rajasthani culture.`
        );
        document.head.appendChild(meta);
      }

      // Update Twitter Card tags
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', `${settings.siteName} - ${settings.tagline}`);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'twitter:title');
        meta.setAttribute('content', `${settings.siteName} - ${settings.tagline}`);
        document.head.appendChild(meta);
      }
    }
  }, [settings]);

  return null;
}
