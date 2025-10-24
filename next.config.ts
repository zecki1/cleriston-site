/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['zecki1.com.br'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;