/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;
