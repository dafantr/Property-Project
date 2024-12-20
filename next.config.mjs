/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com'
            },
            {
                protocol: 'https',
                hostname: 'jjjefrzxvxvbaeibwiig.supabase.co'
            }
        ]
    },

    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
