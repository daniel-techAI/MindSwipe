export function resolveServiceWorkerUrls(baseUrl = './', currentUrl = 'https://example.invalid/') {
  const scopeUrl = new URL(baseUrl, currentUrl);
  return {
    scope: scopeUrl.pathname,
    serviceWorkerUrl: new URL('sw.js', scopeUrl).href
  };
}

export async function registerMindSwipeServiceWorker() {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return null;

  await new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });

  const { scope, serviceWorkerUrl } = resolveServiceWorkerUrls('./', document.baseURI);
  const registration = await navigator.serviceWorker.register(serviceWorkerUrl, { scope });
  void registration.update();
  return registration;
}
