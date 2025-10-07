// src/sw-register.ts
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    // Try the common public worker name first ('/sw.js'), then fallback to '/service-worker.js'
    const tryRegister = async (url: string) => {
      try {
        // Ensure the script is actually JS and not an HTML fallback
        const resp = await fetch(url, { cache: 'no-store' });
        const contentType = resp.headers.get('content-type') || '';
        if (!resp.ok || !/javascript|application\/x-javascript|text\/javascript/.test(contentType)) {
          throw new Error(`Service worker script not found or wrong MIME type at ${url} (content-type: ${contentType})`);
        }
        return await navigator.serviceWorker.register(url);
      } catch (err) {
        console.warn('SW register try failed for', url, err);
        throw err;
      }
    };

    let registration;
    try {
      registration = await tryRegister('/sw.js');
    } catch (err) {
      registration = await tryRegister('/service-worker.js');
    }

    if (registration.waiting) {
      window.dispatchEvent(new CustomEvent('sw.updated', { detail: { waiting: registration.waiting } }));
    }

    registration.onupdatefound = () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.onstatechange = () => {
        if (installing.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent('sw.updated', { detail: { waiting: registration.waiting } }));
          } else {
            window.dispatchEvent(new Event('sw.offline'));
          }
        }
      };
    };
  } catch (err) {
    console.error('SW registration failed', err);
  }
}

export async function unregisterServiceWorkersAndClearCache() {
  if ('serviceWorker' in navigator) {
    const { serviceWorker } = navigator;
    if (serviceWorker.getRegistrations) {
      const regs = await serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    } else {
      const reg = await serviceWorker.getRegistration();
      if (reg) await reg.unregister();
    }
  }
  if (window.caches) {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  }
}