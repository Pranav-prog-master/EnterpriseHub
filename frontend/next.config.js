/** @type {import('next').NextConfig} */
const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,  // Use SWC minifier for faster builds
  
  // Optimize images
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
      { protocol: 'https', hostname: '**' },  // Allow all HTTPS for flexibility
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Experimental optimizations for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Fix for util._extend deprecation warning
    config.resolve.fallback = {
      ...config.resolve.fallback,
      util: false,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Optimize bundle
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              chunks: 'all',
            },
            // React/Next chunks
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: 'framework',
              priority: 20,
              chunks: 'all',
            },
            // Common chunks
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // API rewrites
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND}/:path*`,
      },
    ];
  },
  
  // Output optimization
  output: 'standalone',
  poweredByHeader: false,
};

module.exports = nextConfig;
