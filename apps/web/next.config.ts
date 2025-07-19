import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for better debugging
  reactStrictMode: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Experimental features
  experimental: {
    // Enable app directory (Next.js 13+)
    appDir: true,
    // Enable turbo for faster development
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Image optimization (disabled for static export)
  images: {
    unoptimized: true,
  },

  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
    NEXT_PUBLIC_APP_NAME: 'Rigger Platform',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Note: redirects and headers are not supported with static export

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack configurations here
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Output configuration for Cloud Run (standalone)
  output: 'standalone',
  
  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: true,
  
  // Compress response
  compress: true,
  
  // PoweredBy header
  poweredByHeader: false,
  
  // TypeScript configuration
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Run ESLint during build
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;