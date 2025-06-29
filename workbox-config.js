module.exports = {
  mode: 'generateSW',
  globDirectory: 'public/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,ico}',
  ],
  swDest: 'public/sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/www\.gstatic\.com\/firebasejs\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'firebase-js',
      },
    },
  ],
};
