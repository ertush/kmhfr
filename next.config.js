/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    experimental: {
        largePageDataBytes: 128 * 100000,
      },
  }
   
  module.exports = nextConfig