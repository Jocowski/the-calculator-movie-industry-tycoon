// src/hooks/useGtag.ts
import { useEffect, useState, useCallback } from "react";

export const useGtag = () => {
  const [gtagReady, setGtagReady] = useState(false);

  useEffect(() => {
    const checkGtag = () => {
      if (typeof window.gtag === 'function') {
        setGtagReady(true);
        return true;
      }
      return false;
    };

    if (!checkGtag()) {
      const timer = setInterval(() => {
        if (checkGtag()) clearInterval(timer);
      }, 500);
      return () => clearInterval(timer);
    }
  }, []);

  const safeGtag = useCallback((event: string, params: Record<string, any>) => {
    if (gtagReady && typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    } else {
      console.warn('[GTAG] Evento não enviado:', event, params);
    }
  }, [gtagReady]);

  return { safeGtag };
};
