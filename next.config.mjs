/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'swalay-music-files.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'swalay-test-files.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },

  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
  
  // Configure the app to have dynamic API routes that aren't statically generated
  output: 'standalone',
  
  // This makes it possible to use dynamic features within API routes
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  }
};

export default nextConfig;
  
