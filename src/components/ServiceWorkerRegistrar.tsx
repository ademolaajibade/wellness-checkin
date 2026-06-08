'use client';

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');
      wb.register();
    }
  }, []);

  return null;
}
