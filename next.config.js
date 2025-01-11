/** @type {import("next").NextConfig} */
const nextConfig = {};

// https://github.com/vercel/next.js/discussions/57555
if (process.env.NODE_ENV === 'production') {
  nextConfig.compiler = {
    removeConsole: true
  };
}

module.exports = nextConfig;
