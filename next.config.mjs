/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: [ 
//       "lh3.googleusercontent.com", 
//       "cdn1.iconfinder.com",
//     ]
//   },
// };

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ]
  },
};

export default nextConfig;

