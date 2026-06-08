import withPWA from 'next-pwa';

/** @type {import('next-pwa').PWAConfig} */
const pwaConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  fallbacks: {
    document: '/offline.html',
  },
  runtimeCaching: [
    {
      urlPattern: /^\/api\/questions/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-questions',
      },
    },
    {
      urlPattern: /^\/api\/recordings/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-recordings',
      },
    },
    {
      urlPattern: /firebasestorage\.googleapis\.com\/.*\.(mp3|m4a)(\?.*)?$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'audio-files',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 2592000,
        },
      },
    },
    {
      urlPattern: /^\/api\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-others',
      },
    },
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 10,
      },
    },
  ],
};

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA(pwaConfig)(nextConfig);
