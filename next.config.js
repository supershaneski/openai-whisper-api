/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
]

const nextConfig = {
  webpack: function(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  env: {
    siteTitle: 'Whisper API Sample App',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      }
    ]
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  trailingSlash: true,
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;