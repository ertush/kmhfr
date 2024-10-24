const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// const cspHeader = `
//     default-src 'self';
//     script-src 'self' 'unsafe-eval' 'unsafe-inline';
//     style-src 'self' 'unsafe-inline';
//     img-src 'self' blob: data:;
//     font-src 'self';
//     object-src 'none';
//     base-uri 'self';
//     form-action 'self';
//     frame-ancestors 'none';
//     upgrade-insecure-requests;
// `

/** @type {import('next').NextConfig} */

const nextConfig = {
    /* config options here */
    // experimental:{
    //   largePageDataBytes: 168960 // 165kB; Default is 128kB
    // }

    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, max-age=0'
            },
          ],
        },
      ]
    }

 
}   
 
module.exports = withBundleAnalyzer(nextConfig)